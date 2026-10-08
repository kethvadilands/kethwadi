import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Download, FileWarning, Phone } from 'lucide-react-native';
import { Button, Card, Divider, FadeIn, KeyValue, Row, TopBar } from '@/components/ui';
import { ClaimCard, PolicyCard } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { PLANS } from '@/data';
import { inr, shortDate } from '@/constants/format';
import { colors, spacing, type } from '@/constants/theme';

const EXCLUSIONS = [
  'Damage from deliberate neglect of the crop',
  'Losses reported more than 14 days after the incident',
  'Land or equipment not declared at the time of purchase',
];

export default function PolicyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { policies, claims } = useApp();
  const toast = useToast();
  const policy = policies.find(p => p.id === id);
  if (!policy) return null;

  const plan = PLANS.find(p => p.id === policy.planId);
  const related = claims.filter(c => c.policyId === policy.id);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Policy details" subtitle={policy.policyNo} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <FadeIn><PolicyCard policy={policy} /></FadeIn>

        <FadeIn delay={80}>
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={type.h2}>Cover summary</Text>
            <Divider />
            <KeyValue k="Plan" v={policy.planName} />
            <KeyValue k="Holder type" v={policy.holderRole === 'landlord' ? 'Landlord' : 'Renter farmer'} />
            <KeyValue k="Sum insured" v={inr(policy.coverage)} />
            <KeyValue k="Premium paid" v={inr(policy.premium)} />
            <KeyValue k="Cover from" v={shortDate(policy.startDate)} />
            <KeyValue k="Cover until" v={shortDate(policy.endDate)} />
            <KeyValue k="Status" v={policy.status} tone={policy.status === 'active' ? colors.green : colors.danger} />
          </Card>
        </FadeIn>

        {plan ? (
          <FadeIn delay={130}>
            <Card style={{ marginTop: spacing.lg }}>
              <Text style={type.h2}>What is covered</Text>
              <View style={{ gap: 10, marginTop: 12 }}>
                {plan.features.map(f => (
                  <Row key={f} style={{ gap: 9 }}>
                    <View style={styles.check}><Check size={11} color="#FFF" strokeWidth={3} /></View>
                    <Text style={[type.body, { fontSize: 13, flex: 1 }]}>{f}</Text>
                  </Row>
                ))}
              </View>
              <Divider />
              <Text style={type.h2}>What is not covered</Text>
              <View style={{ gap: 10, marginTop: 12 }}>
                {EXCLUSIONS.map(e => (
                  <Row key={e} style={{ gap: 9 }}>
                    <View style={styles.cross}><Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>{'\u00D7'}</Text></View>
                    <Text style={[type.body, { fontSize: 13, flex: 1 }]}>{e}</Text>
                  </Row>
                ))}
              </View>
            </Card>
          </FadeIn>
        ) : null}

        {related.length ? (
          <View style={{ marginTop: spacing.xl }}>
            <Text style={[type.h2, { marginBottom: spacing.md }]}>Claims on this policy</Text>
            <View style={{ gap: spacing.md }}>
              {related.map(c => <ClaimCard key={c.id} claim={c} onPress={() => router.push(`/policy/claim/${c.id}`)} />)}
            </View>
          </View>
        ) : null}

        <View style={{ gap: 10, marginTop: spacing.xl }}>
          <Button
            title="Raise a claim" icon={FileWarning}
            onPress={() => router.push({ pathname: '/policy/claim-new', params: { policyId: policy.id } })}
          />
          <Button title="Download policy document" icon={Download} variant="secondary" compact onPress={() => toast('Policy PDF saved to documents')} />
          <Button title="Call claims helpline" icon={Phone} variant="ghost" compact onPress={() => toast('Helpline: 1800 200 4567', 'info')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  check: { width: 17, height: 17, borderRadius: 9, backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center' },
  cross: { width: 17, height: 17, borderRadius: 9, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
});
