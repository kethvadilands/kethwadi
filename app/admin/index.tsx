import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronRight, ClipboardCheck, FileWarning, Landmark, Package, ShieldCheck, Users, Sprout, Tractor,
} from 'lucide-react-native';
import { Card, FadeIn, Row, SectionHeader, TopBar } from '@/components/ui';
import { StatTile } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { inr, inrShort } from '@/constants/format';
import { colors, gradients, radius, shadow, spacing, type } from '@/constants/theme';

const MANAGE = [
  { label: 'Users', sub: 'Landlords, farmers, KYC status', icon: Users, to: '/admin/users' },
  { label: 'Land listings', sub: 'Verify and publish plots', icon: Landmark, to: '/admin/lands' },
  { label: 'Lease requests', sub: 'Agreements and disputes', icon: ClipboardCheck, to: '/admin/leases' },
  { label: 'Marketplace orders', sub: 'Fulfilment and returns', icon: Package, to: '/admin/orders' },
  { label: 'Insurance policies', sub: 'Issued cover and renewals', icon: ShieldCheck, to: '/admin/insurance' },
  { label: 'Claims', sub: 'Survey, approve, settle', icon: FileWarning, to: '/admin/claims' },
] as const;

export default function AdminDashboard() {
  const { users, lands, leases, orders, policies, claims } = useApp();

  const landlords = users.filter(u => u.role === 'landlord').length;
  const farmers = users.filter(u => u.role === 'farmer').length;
  const pendingKyc = users.filter(u => u.kycStatus === 'pending' || u.kycStatus === 'not_started').length;
  const pendingLand = lands.filter(l => l.status === 'pending').length;
  const pendingLease = leases.filter(l => l.status === 'pending').length;
  const openClaims = claims.filter(c => c.status !== 'settled' && c.status !== 'rejected').length;
  const gmv = leases.filter(l => l.paymentStatus === 'paid').reduce((t, l) => t + l.amount, 0)
    + orders.reduce((t, o) => t + o.total, 0);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Admin console" subtitle="Platform operations" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <FadeIn>
          <View style={styles.gmv}>
            <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: spacing.xl }}>
              <Text style={styles.gmvLbl}>GROSS PLATFORM VALUE</Text>
              <Text style={styles.gmvVal}>{inr(gmv)}</Text>
              <Row style={{ marginTop: 18, gap: 22 }}>
                <View>
                  <Text style={styles.miniLbl}>LEASE VALUE</Text>
                  <Text style={styles.miniVal}>{inrShort(leases.reduce((t, l) => t + l.amount, 0))}</Text>
                </View>
                <View>
                  <Text style={styles.miniLbl}>MARKETPLACE</Text>
                  <Text style={styles.miniVal}>{inrShort(orders.reduce((t, o) => t + o.total, 0))}</Text>
                </View>
                <View>
                  <Text style={styles.miniLbl}>PREMIUMS</Text>
                  <Text style={styles.miniVal}>{inrShort(policies.reduce((t, p) => t + p.premium, 0))}</Text>
                </View>
              </Row>
            </LinearGradient>
          </View>
        </FadeIn>

        <FadeIn delay={70}>
          <Row style={{ gap: spacing.md, flexWrap: 'wrap', marginTop: spacing.lg }}>
            <StatTile label="Total users" value={String(users.length)} icon={Users} />
            <StatTile label="Landlords" value={String(landlords)} icon={Sprout} tone="gold" />
            <StatTile label="Farmers" value={String(farmers)} icon={Tractor} tone="blue" />
            <StatTile label="Listed lands" value={String(lands.length)} icon={Landmark} />
            <StatTile label="Active leases" value={String(leases.filter(l => l.status === 'active').length)} icon={ClipboardCheck} tone="blue" />
            <StatTile label="Orders" value={String(orders.length)} icon={Package} tone="gold" />
          </Row>
        </FadeIn>

        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader title="Needs attention" />
          <Card>
            <Queue label="Pending KYC" count={pendingKyc} to="/admin/users" />
            <View style={styles.hair} />
            <Queue label="Land verification" count={pendingLand} to="/admin/lands" />
            <View style={styles.hair} />
            <Queue label="Lease requests" count={pendingLease} to="/admin/leases" />
            <View style={styles.hair} />
            <Queue label="Open claims" count={openClaims} to="/admin/claims" />
          </Card>
        </View>

        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader title="Manage" />
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {MANAGE.map((m, i) => (
              <Pressable key={m.label} onPress={() => router.push(m.to as any)} style={[styles.item, i < MANAGE.length - 1 && styles.itemBorder]}>
                <View style={styles.itemIcon}><m.icon size={17} color={colors.green} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={type.h3}>{m.label}</Text>
                  <Text style={[type.small, { fontSize: 11.5, marginTop: 1 }]}>{m.sub}</Text>
                </View>
                <ChevronRight size={17} color={colors.muted} />
              </Pressable>
            ))}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Queue({ label, count, to }: { label: string; count: number; to: string }) {
  return (
    <Pressable onPress={() => router.push(to as any)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 11 }}>
      <Text style={[type.body, { flex: 1, fontWeight: '600', color: colors.ink }]}>{label}</Text>
      <View style={[styles.count, count === 0 && { backgroundColor: '#EEF2EF' }]}>
        <Text style={[styles.countText, count === 0 && { color: colors.muted }]}>{count}</Text>
      </View>
      <ChevronRight size={16} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gmv: { borderRadius: radius.xl, overflow: 'hidden', ...shadow.raised },
  gmvLbl: { color: 'rgba(255,255,255,0.55)', fontSize: 9.5, fontWeight: '800', letterSpacing: 1.4 },
  gmvVal: { color: '#FFF', fontSize: 31, fontWeight: '800', letterSpacing: -1, marginTop: 6 },
  miniLbl: { color: 'rgba(255,255,255,0.5)', fontSize: 8.5, fontWeight: '800', letterSpacing: 1 },
  miniVal: { color: '#FFF', fontSize: 15, fontWeight: '800', marginTop: 3 },
  hair: { height: 1, backgroundColor: colors.line },
  count: { minWidth: 28, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: colors.goldSoft, alignItems: 'center', marginRight: 8 },
  countText: { fontSize: 12, fontWeight: '800', color: colors.warn },
  item: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  itemIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
});
