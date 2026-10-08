import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ShieldAlert } from 'lucide-react-native';
import { Button, Card, Chip, Field, Input, Label, Photo, Row, SuccessModal, TopBar } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { CLAIM_TYPES } from '@/data';
import { inr, seq, uid } from '@/constants/format';
import { colors, radius, spacing, type } from '@/constants/theme';
import { Claim } from '@/types';

export default function RaiseClaim() {
  const { policyId } = useLocalSearchParams<{ policyId?: string }>();
  const { policies, user, dispatch } = useApp();
  const toast = useToast();

  const policy = policies.find(p => p.id === policyId) ?? policies.find(p => p.holderId === user?.id && p.status === 'active');
  const [ctype, setCtype] = useState(CLAIM_TYPES[0]);
  const [amount, setAmount] = useState('');
  const [when, setWhen] = useState(new Date().toISOString().slice(0, 10));
  const [desc, setDesc] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Claim | null>(null);

  const pick = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return toast('Camera access is needed for damage photos', 'error');
    const res = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!res.canceled && res.assets?.[0]) { setPhotos(p => [...p, res.assets[0].uri]); toast('Photo attached'); }
  };

  if (!policy) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TopBar title="Raise a claim" />
        <View style={{ padding: spacing.lg }}>
          <Card>
            <Row style={{ gap: 10 }}>
              <ShieldAlert size={20} color={colors.warn} />
              <Text style={[type.h3, { flex: 1 }]}>You need an active policy before filing a claim</Text>
            </Row>
            <Button title="See plans" onPress={() => router.replace('/policy/plans')} style={{ marginTop: 16 }} />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  const submit = () => {
    if (!amount || Number(amount) <= 0) return toast('Enter the loss amount you are claiming', 'error');
    if (Number(amount) > policy.coverage) return toast(`Claim cannot exceed the ${inr(policy.coverage)} sum insured`, 'error');
    if (desc.trim().length < 15) return toast('Describe what happened in a line or two', 'error');

    setBusy(true);
    setTimeout(() => {
      const today = new Date().toISOString().slice(0, 10);
      const claim: Claim = {
        id: uid('cl'), claimNo: seq('CLM-'), policyId: policy.id, policyNo: policy.policyNo,
        holderId: user?.id ?? 'u-fr-1', type: ctype, amount: Number(amount),
        incidentDate: when, description: desc, status: 'submitted', createdAt: today,
        timeline: [
          { label: 'Claim submitted', date: today, done: true },
          { label: 'Documents verification', date: 'In progress', done: false },
          { label: 'Field survey', date: 'Pending', done: false },
          { label: 'Assessment', date: 'Pending', done: false },
          { label: 'Settlement credited', date: 'Pending', done: false },
        ],
      };
      dispatch({ type: 'ADD_CLAIM', claim });
      dispatch({ type: 'NOTIFY', item: { id: uid('n'), title: 'Claim registered', body: `${claim.claimNo} is with our assessment team.`, kind: 'insurance', time: 'Just now', read: false } });
      setBusy(false);
      setDone(claim);
    }, 1100);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Raise a claim" subtitle={`${policy.planName} · ${policy.policyNo}`} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <Card>
            <Field label="What happened">
              <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                {CLAIM_TYPES.map(t => <Chip key={t} label={t} active={ctype === t} onPress={() => setCtype(t)} />)}
              </Row>
            </Field>
            <Field label="Amount claimed" hint={`Sum insured on this policy is ${inr(policy.coverage)}`}>
              <Input value={amount} onChangeText={setAmount} keyboardType="number-pad" placeholder="e.g. 68000" />
            </Field>
            <Field label="Date of incident">
              <Input value={when} onChangeText={setWhen} placeholder="YYYY-MM-DD" />
            </Field>
            <Field label="Describe the loss">
              <Input
                value={desc} onChangeText={setDesc} multiline
                placeholder="Which survey number, how many acres, what was damaged"
                style={{ height: 110, textAlignVertical: 'top' }}
              />
            </Field>

            <Label style={{ marginBottom: 9 }}>Damage photos</Label>
            <Row style={{ gap: 10, flexWrap: 'wrap' }}>
              {photos.map((p, i) => <Photo key={i} uri={p} style={{ width: 76, height: 76 }} rounded={radius.md} />)}
              <Pressable onPress={pick} style={styles.upload}>
                <Camera size={18} color={colors.green} />
                <Text style={styles.uploadText}>Capture</Text>
              </Pressable>
            </Row>
            <Text style={[type.small, { fontSize: 11.5, marginTop: 12 }]}>
              Clear photos of the affected area speed up the field survey considerably.
            </Text>
          </Card>

          <Button title="Submit claim" onPress={submit} loading={busy} style={{ marginTop: spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={!!done}
        title="Claim registered"
        body="A surveyor is assigned within 48 hours. You can track every step from the claim page."
        meta={done ? [
          { k: 'Claim number', v: done.claimNo },
          { k: 'Amount claimed', v: inr(done.amount) },
          { k: 'Status', v: 'Submitted' },
        ] : []}
        primaryLabel="Track claim"
        onPrimary={() => { const id = done?.id; setDone(null); router.replace(`/policy/claim/${id}`); }}
        secondaryLabel="Back to insurance"
        onSecondary={() => { setDone(null); router.replace('/(tabs)/insurance'); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  upload: { width: 76, height: 76, borderRadius: radius.md, borderWidth: 1.4, borderStyle: 'dashed', borderColor: '#BBD3C4', alignItems: 'center', justifyContent: 'center', gap: 3, backgroundColor: colors.leafSoft },
  uploadText: { fontSize: 10, fontWeight: '800', color: colors.green },
});
