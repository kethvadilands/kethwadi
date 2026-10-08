import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Check, ShieldCheck } from 'lucide-react-native';
import { Button, Card, Chip, ConfirmDialog, Divider, FadeIn, Row, SuccessModal, TopBar } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { PLANS } from '@/data';
import { addMonths, inr, seq, uid } from '@/constants/format';
import { colors, radius, spacing, type } from '@/constants/theme';
import { InsurancePlan, Policy, Role } from '@/types';

export default function Plans() {
  const { user, dispatch, isLandlord } = useApp();
  const [role, setRole] = useState<Role>(isLandlord ? 'landlord' : 'farmer');
  const [picked, setPicked] = useState<InsurancePlan | null>(null);
  const [confirm, setConfirm] = useState<InsurancePlan | null>(null);
  const [issued, setIssued] = useState<Policy | null>(null);

  const list = PLANS.filter(p => p.forRole === role);

  const buy = (plan: InsurancePlan) => {
    const start = new Date().toISOString();
    const policy: Policy = {
      id: uid('po'), policyNo: seq(role === 'landlord' ? 'KW-LL-' : 'KW-FR-'),
      planId: plan.id, planName: plan.name, holderId: user?.id ?? 'u-fr-1', holderRole: role,
      coverage: plan.coverage, premium: plan.premium,
      startDate: start, endDate: addMonths(start, plan.tenureMonths), status: 'active',
    };
    dispatch({ type: 'ADD_POLICY', policy });
    dispatch({ type: 'NOTIFY', item: { id: uid('n'), title: 'Policy issued', body: `${plan.name} is active. Policy ${policy.policyNo}.`, kind: 'insurance', time: 'Just now', read: false } });
    setConfirm(null);
    setIssued(policy);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Insurance plans" subtitle="Underwritten by KETHWADI partner insurers" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Row style={{ gap: 8, marginBottom: spacing.lg }}>
          <Chip label="For landlords" active={role === 'landlord'} onPress={() => setRole('landlord')} />
          <Chip label="For farmers" active={role === 'farmer'} onPress={() => setRole('farmer')} />
        </Row>

        <View style={{ gap: spacing.lg }}>
          {list.map((p, i) => {
            const open = picked?.id === p.id;
            return (
              <FadeIn key={p.id} delay={i * 90}>
                <Pressable onPress={() => setPicked(open ? null : p)}>
                  <Card style={open ? { borderWidth: 1.6, borderColor: colors.green } : undefined}>
                    <Row style={{ justifyContent: 'space-between' }}>
                      <Row style={{ gap: 10, flex: 1 }}>
                        <View style={styles.icon}><ShieldCheck size={18} color={colors.green} /></View>
                        <View style={{ flex: 1 }}>
                          <Row style={{ gap: 7 }}>
                            <Text style={type.h2}>{p.name}</Text>
                            {p.popular ? <View style={styles.tag}><Text style={styles.tagText}>POPULAR</Text></View> : null}
                          </Row>
                          <Text style={[type.small, { marginTop: 3 }]}>{p.tagline}</Text>
                        </View>
                      </Row>
                    </Row>

                    <Row style={{ marginTop: 16, gap: spacing.md }}>
                      <View style={styles.metric}>
                        <Text style={type.micro}>Cover up to</Text>
                        <Text style={styles.metricVal}>{inr(p.coverage)}</Text>
                      </View>
                      <View style={styles.metric}>
                        <Text style={type.micro}>Premium</Text>
                        <Text style={styles.metricVal}>{inr(p.premium)}<Text style={[type.small, { fontSize: 11 }]}> /yr</Text></Text>
                      </View>
                    </Row>

                    <Divider />
                    <View style={{ gap: 9 }}>
                      {p.features.map(f => (
                        <Row key={f} style={{ gap: 9 }}>
                          <View style={styles.check}><Check size={11} color="#FFF" strokeWidth={3} /></View>
                          <Text style={[type.body, { fontSize: 13, flex: 1 }]}>{f}</Text>
                        </Row>
                      ))}
                    </View>

                    <Button title={`Buy for ${inr(p.premium)}`} onPress={() => setConfirm(p)} style={{ marginTop: 18 }} />
                  </Card>
                </Pressable>
              </FadeIn>
            );
          })}
        </View>

        <Text style={[type.small, { fontSize: 11.5, marginTop: spacing.xl, textAlign: 'center' }]}>
          Demo product. Cover, exclusions and settlement times are illustrative.
        </Text>
      </ScrollView>

      <ConfirmDialog
        visible={!!confirm}
        title={`Buy ${confirm?.name ?? ''}?`}
        body={`${inr(confirm?.premium ?? 0)} will be debited for 12 months of cover up to ${inr(confirm?.coverage ?? 0)}.`}
        confirmLabel="Pay premium"
        onConfirm={() => confirm && buy(confirm)}
        onCancel={() => setConfirm(null)}
      />

      <SuccessModal
        visible={!!issued}
        title="Policy issued"
        body="Cover starts immediately. Your policy document is in the documents vault."
        meta={issued ? [
          { k: 'Policy number', v: issued.policyNo },
          { k: 'Cover', v: inr(issued.coverage) },
          { k: 'Valid for', v: '12 months' },
        ] : []}
        primaryLabel="View policy"
        onPrimary={() => { const id = issued?.id; setIssued(null); router.replace(`/policy/${id}`); }}
        secondaryLabel="Back to insurance"
        onSecondary={() => { setIssued(null); router.replace('/(tabs)/insurance'); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  icon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
  tag: { backgroundColor: colors.goldSoft, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  tagText: { fontSize: 8.5, fontWeight: '800', color: colors.warn, letterSpacing: 0.6 },
  metric: { flex: 1, backgroundColor: colors.bone, borderRadius: radius.md, padding: 13 },
  metricVal: { fontSize: 17, fontWeight: '800', color: colors.forest, marginTop: 4 },
  check: { width: 17, height: 17, borderRadius: 9, backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center' },
});
