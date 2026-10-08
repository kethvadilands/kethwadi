import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Check, CreditCard, FileUp, IdCard, Landmark, ScanFace } from 'lucide-react-native';
import { Badge, Button, Card, Divider, FadeIn, Field, Input, Row, SuccessModal, TopBar } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { colors, radius, spacing, type } from '@/constants/theme';

const DOCS = [
  { key: 'aadhaar', label: 'Aadhaar card', sub: 'Front and back', icon: IdCard },
  { key: 'pan', label: 'PAN card', sub: 'For payouts above ₹50,000', icon: CreditCard },
  { key: 'land', label: 'Land record', sub: 'Pattadar passbook, 7/12 or RTC', icon: Landmark },
];

export default function Kyc() {
  const { user, dispatch } = useApp();
  const toast = useToast();
  const [uploaded, setUploaded] = useState<Record<string, string>>({});
  const [aadhaar, setAadhaar] = useState('');
  const [selfie, setSelfie] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const upload = async (key: string) => {
    const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: false });
    if (!res.canceled && res.assets?.[0]) {
      setUploaded(u => ({ ...u, [key]: res.assets[0].name }));
      toast('Document uploaded');
    }
  };

  const takeSelfie = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return toast('Camera access is needed for face verification', 'error');
    const res = await ImagePicker.launchCameraAsync({ quality: 0.4, cameraType: ImagePicker.CameraType.front });
    if (!res.canceled) { setSelfie(true); toast('Face captured'); }
  };

  const submit = () => {
    if (!/^\d{12}$/.test(aadhaar)) return toast('Enter the 12 digit Aadhaar number', 'error');
    if (Object.keys(uploaded).length < 2) return toast('Upload at least your Aadhaar and land record', 'error');
    setBusy(true);
    setTimeout(() => {
      dispatch({ type: 'SET_KYC', status: 'verified' });
      setBusy(false);
      setDone(true);
    }, 1400);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="KYC and documents" subtitle={user?.kycStatus === 'verified' ? 'Verified' : 'Verification pending'} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {user?.kycStatus === 'verified' ? (
          <FadeIn>
            <Card>
              <Row style={{ gap: 12 }}>
                <View style={styles.ok}><Check size={19} color="#FFF" strokeWidth={3} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={type.h2}>You are verified</Text>
                  <Text style={[type.small, { marginTop: 3 }]}>
                    Aadhaar, PAN and land records checked against state registries.
                  </Text>
                </View>
              </Row>
            </Card>
          </FadeIn>
        ) : null}

        <FadeIn delay={60}>
          <Card style={{ marginTop: user?.kycStatus === 'verified' ? spacing.lg : 0 }}>
            <Text style={type.h2}>Identity</Text>
            <View style={{ height: 14 }} />
            <Field label="Aadhaar number" hint="Used only for verification. Never shown to other users.">
              <Input value={aadhaar} onChangeText={setAadhaar} keyboardType="number-pad" maxLength={12} placeholder="12 digit number" />
            </Field>
            <Pressable onPress={takeSelfie} style={[styles.selfie, selfie && { borderColor: colors.green, backgroundColor: '#FBFDFB' }]}>
              <View style={styles.selfieIcon}><ScanFace size={19} color={colors.green} /></View>
              <View style={{ flex: 1 }}>
                <Text style={type.h3}>Face verification</Text>
                <Text style={[type.small, { fontSize: 11.5 }]}>{selfie ? 'Captured' : 'Match your face to the Aadhaar photo'}</Text>
              </View>
              {selfie ? <Badge label="Done" tone="green" /> : <Badge label="Pending" tone="gold" />}
            </Pressable>
          </Card>
        </FadeIn>

        <FadeIn delay={110}>
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={type.h2}>Documents</Text>
            <Divider />
            <View style={{ gap: 12 }}>
              {DOCS.map(d => (
                <Row key={d.key} style={{ gap: 12 }}>
                  <View style={styles.docIcon}><d.icon size={17} color={colors.green} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3}>{d.label}</Text>
                    <Text style={[type.small, { fontSize: 11.5 }]} numberOfLines={1}>{uploaded[d.key] ?? d.sub}</Text>
                  </View>
                  {uploaded[d.key] ? (
                    <Badge label="Uploaded" tone="green" />
                  ) : (
                    <Button title="Upload" icon={FileUp} variant="secondary" compact full={false} onPress={() => upload(d.key)} style={{ paddingHorizontal: 12 }} />
                  )}
                </Row>
              ))}
            </View>
          </Card>
        </FadeIn>

        <Button title="Submit for verification" onPress={submit} loading={busy} style={{ marginTop: spacing.xl }} />
      </ScrollView>

      <SuccessModal
        visible={done}
        title="KYC verified"
        body="Your account carries the verified badge now. Lease requests are prioritised."
        primaryLabel="Continue"
        onPrimary={() => { setDone(false); router.replace('/(tabs)'); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ok: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  selfie: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.4, borderColor: colors.line, borderRadius: radius.md, padding: 13 },
  selfieIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
  docIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
});
