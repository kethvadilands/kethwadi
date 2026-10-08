import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowRight, ClipboardList, IndianRupee, Landmark, Plus, ShieldCheck, Sprout, TrendingUp,
} from 'lucide-react-native';
import { Button, Card, FadeIn, Row, Scroll, SectionHeader, TopBar, Badge } from '@/components/ui';
import { LeaseCard, StatTile } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { inr, inrShort } from '@/constants/format';
import { colors, gradients, radius, shadow, spacing, type } from '@/constants/theme';

export default function LandlordDashboard() {
  const { user, lands, leases, policies } = useApp();
  const myLands = lands.filter(l => l.ownerId === user?.id);
  const myLeases = leases.filter(l => l.landlordId === user?.id);
  const pending = myLeases.filter(l => l.status === 'pending');
  const active = myLeases.filter(l => l.status === 'active');
  const earnings = myLeases.filter(l => l.paymentStatus === 'paid').reduce((t, l) => t + l.amount, 0);
  const availableArea = myLands.reduce((t, l) => t + l.availableArea, 0);
  const policy = policies.find(p => p.holderId === user?.id && p.status === 'active');

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Landlord dashboard" subtitle={`${user?.district}, ${user?.state}`} />
      <Scroll>
        <FadeIn>
          <View style={styles.earn}>
            <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: spacing.xl }}>
              <Text style={styles.earnLbl}>TOTAL LEASE EARNINGS</Text>
              <Text style={styles.earnVal}>{inr(earnings)}</Text>
              <Row style={{ gap: 6, marginTop: 8 }}>
                <TrendingUp size={14} color={colors.leaf} />
                <Text style={{ color: colors.leaf, fontSize: 12, fontWeight: '700' }}>
                  {active.length} lease{active.length === 1 ? '' : 's'} generating income
                </Text>
              </Row>
              <View style={styles.earnSplit}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.miniLbl}>SETTLED</Text>
                  <Text style={styles.miniVal}>{inrShort(earnings)}</Text>
                </View>
                <View style={styles.vline} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.miniLbl}>AWAITING</Text>
                  <Text style={styles.miniVal}>{inrShort(pending.reduce((t, l) => t + l.amount, 0))}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </FadeIn>

        <FadeIn delay={70}>
          <Row style={{ gap: spacing.md, flexWrap: 'wrap', marginTop: spacing.lg }}>
            <StatTile label="Total lands" value={String(myLands.length)} icon={Landmark} onPress={() => router.push('/landlord/my-lands')} />
            <StatTile label="Available area" value={`${availableArea} ac`} icon={Sprout} tone="gold" onPress={() => router.push('/landlord/my-lands')} />
            <StatTile label="Active leases" value={String(active.length)} icon={ClipboardList} tone="blue" onPress={() => router.push('/lease/my-leases')} />
            <StatTile label="Lease requests" value={String(pending.length)} icon={IndianRupee} onPress={() => router.push('/landlord/requests')} />
          </Row>
        </FadeIn>

        <FadeIn delay={120}>
          <Pressable onPress={() => router.push('/(tabs)/insurance')} style={[styles.ins, { marginTop: spacing.lg }]}>
            <View style={styles.insIcon}><ShieldCheck size={18} color={colors.green} /></View>
            <View style={{ flex: 1 }}>
              <Row style={{ gap: 7 }}>
                <Text style={type.h3}>{policy ? policy.planName : 'No land cover yet'}</Text>
                {policy ? <Badge label="Active" tone="green" /> : <Badge label="Unprotected" tone="gold" />}
              </Row>
              <Text style={[type.small, { fontSize: 11.5, marginTop: 2 }]}>
                {policy ? `${inr(policy.coverage)} cover · ${policy.policyNo}` : 'Protect lease income and farm assets'}
              </Text>
            </View>
            <ArrowRight size={17} color={colors.muted} />
          </Pressable>
        </FadeIn>

        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader title="Lease requests" action="Manage" onAction={() => router.push('/landlord/requests')} />
          {pending.length ? (
            <View style={{ gap: spacing.md }}>
              {pending.slice(0, 2).map(l => <LeaseCard key={l.id} lease={l} onPress={() => router.push('/landlord/requests')} />)}
            </View>
          ) : (
            <Card><Text style={type.small}>No requests waiting on you. New requests appear here with the farmer profile attached.</Text></Card>
          )}
        </View>

        <Button title="List a new plot" icon={Plus} onPress={() => router.push('/landlord/add-land')} style={{ marginTop: spacing.xl }} />
      </Scroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  earn: { borderRadius: radius.xl, overflow: 'hidden', ...shadow.raised },
  earnLbl: { color: 'rgba(255,255,255,0.55)', fontSize: 9.5, fontWeight: '800', letterSpacing: 1.4 },
  earnVal: { color: '#FFF', fontSize: 33, fontWeight: '800', letterSpacing: -1, marginTop: 6 },
  earnSplit: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.md, padding: 13, marginTop: 18 },
  vline: { width: 1, backgroundColor: 'rgba(255,255,255,0.16)' },
  miniLbl: { color: 'rgba(255,255,255,0.5)', fontSize: 8.5, fontWeight: '800', letterSpacing: 1 },
  miniVal: { color: '#FFF', fontSize: 15, fontWeight: '800', marginTop: 3 },
  ins: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 13, ...shadow.card },
  insIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
});
