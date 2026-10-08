import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, FileWarning, HeartPulse, ShieldCheck, Sprout, Tractor } from 'lucide-react-native';
import { Button, Card, EmptyState, FadeIn, Row, SectionHeader } from '@/components/ui';
import { ClaimCard, PolicyCard } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { PLANS } from '@/data';
import { inr } from '@/constants/format';
import { colors, gradients, radius, shadow, spacing, type } from '@/constants/theme';

export default function InsuranceTab() {
  const { user, policies, claims, isLandlord } = useApp();
  const mine = policies.filter(p => p.holderId === user?.id);
  const active = mine.find(p => p.status === 'active');
  const myClaims = claims.filter(c => c.holderId === user?.id);
  const suggested = PLANS.filter(p => p.forRole === (isLandlord ? 'landlord' : 'farmer'));

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={type.h1}>Protection</Text>
        <Text style={[type.small, { marginTop: 2, marginBottom: spacing.lg }]}>
          {isLandlord ? 'Cover for your land, assets and lease income' : 'Cover for you, your crop and your equipment'}
        </Text>

        {active ? (
          <>
            <FadeIn><PolicyCard policy={active} onPress={() => router.push(`/policy/${active.id}`)} /></FadeIn>

            <FadeIn delay={80}>
              <Row style={{ gap: spacing.md, marginTop: spacing.lg }}>
                <Pressable onPress={() => router.push({ pathname: '/policy/claim-new', params: { policyId: active.id } })} style={styles.action}>
                  <View style={[styles.actionIcon, { backgroundColor: colors.dangerSoft }]}><FileWarning size={18} color={colors.danger} /></View>
                  <Text style={type.h3}>Raise a claim</Text>
                  <Text style={[type.small, { fontSize: 11.5, marginTop: 2 }]}>Report damage or an accident</Text>
                </Pressable>
                <Pressable onPress={() => router.push(`/policy/${active.id}`)} style={styles.action}>
                  <View style={styles.actionIcon}><ShieldCheck size={18} color={colors.green} /></View>
                  <Text style={type.h3}>Policy details</Text>
                  <Text style={[type.small, { fontSize: 11.5, marginTop: 2 }]}>Cover, exclusions, documents</Text>
                </Pressable>
              </Row>
            </FadeIn>
          </>
        ) : (
          <FadeIn>
            <View style={styles.promo}>
              <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: spacing.xl }}>
                <View style={styles.promoIcon}>
                  {isLandlord ? <Sprout size={20} color={colors.gold} /> : <Tractor size={20} color={colors.gold} />}
                </View>
                <Text style={styles.promoTitle}>You are farming without cover</Text>
                <Text style={styles.promoBody}>
                  One bad season or one accident can wipe out a year of work. Plans start at {inr(1450)} a year.
                </Text>
                <Button title="See plans" variant="gold" onPress={() => router.push('/policy/plans')} style={{ marginTop: 18 }} compact />
              </LinearGradient>
            </View>
          </FadeIn>
        )}

        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader title="Plans for you" action="Compare" onAction={() => router.push('/policy/plans')} />
          <View style={{ gap: spacing.md }}>
            {suggested.map((p, i) => (
              <FadeIn key={p.id} delay={i * 70}>
                <Pressable onPress={() => router.push('/policy/plans')}>
                  <Card>
                    <Row style={{ justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Row style={{ gap: 8 }}>
                          <Text style={type.h3}>{p.name}</Text>
                          {p.popular ? <View style={styles.tag}><Text style={styles.tagText}>POPULAR</Text></View> : null}
                        </Row>
                        <Text style={[type.small, { marginTop: 3 }]}>{p.tagline}</Text>
                      </View>
                      <ArrowRight size={17} color={colors.muted} />
                    </Row>
                    <Row style={{ marginTop: 14, gap: 20 }}>
                      <View>
                        <Text style={type.micro}>Cover</Text>
                        <Text style={styles.figure}>{inr(p.coverage)}</Text>
                      </View>
                      <View>
                        <Text style={type.micro}>Premium / year</Text>
                        <Text style={styles.figure}>{inr(p.premium)}</Text>
                      </View>
                    </Row>
                  </Card>
                </Pressable>
              </FadeIn>
            ))}
          </View>
        </View>

        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader title="My claims" />
          {myClaims.length ? (
            <View style={{ gap: spacing.md }}>
              {myClaims.map(c => <ClaimCard key={c.id} claim={c} onPress={() => router.push(`/policy/claim/${c.id}`)} />)}
            </View>
          ) : (
            <EmptyState
              icon={HeartPulse}
              title="No claims filed"
              body="If something goes wrong on the farm, raise a claim from here and track it to settlement."
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  promo: { borderRadius: radius.xl, overflow: 'hidden', ...shadow.raised },
  promoIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  promoTitle: { color: '#FFF', fontSize: 21, fontWeight: '800', marginTop: 16, letterSpacing: -0.4 },
  promoBody: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, marginTop: 8 },
  action: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 15, ...shadow.card },
  actionIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 11 },
  tag: { backgroundColor: colors.goldSoft, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  tagText: { fontSize: 8.5, fontWeight: '800', color: colors.warn, letterSpacing: 0.6 },
  figure: { fontSize: 16, fontWeight: '800', color: colors.forest, marginTop: 3 },
});
