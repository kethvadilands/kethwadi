import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BadgeCheck, Bell, ChevronRight, FileText, Landmark, LogOut, Package, RefreshCw,
  ShieldCheck, Sprout, Tractor, UserCog,
} from 'lucide-react-native';
import { Badge, Button, Card, ConfirmDialog, FadeIn, Row } from '@/components/ui';
import { Avatar, Logo } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { colors, gradients, radius, shadow, spacing, type } from '@/constants/theme';
import { Role } from '@/types';

export default function Profile() {
  const { user, dispatch, reset, unread, isLandlord, leases, orders, policies } = useApp();
  const toast = useToast();
  const [out, setOut] = useState(false);
  const [wipe, setWipe] = useState(false);

  if (!user) return null;

  const switchRole = () => {
    const next: Role = user.role === 'landlord' ? 'farmer' : 'landlord';
    dispatch({ type: 'LOGIN', user: { ...user, role: next } });
    toast(`Switched to ${next === 'landlord' ? 'landlord' : 'renter farmer'} view`);
  };

  const items = [
    { icon: FileText, label: 'KYC and documents', sub: kycLabel(user.kycStatus), to: '/kyc' },
    { icon: Landmark, label: isLandlord ? 'My lands' : 'My leases', sub: `${isLandlord ? '' : leases.filter(l => l.farmerId === user.id).length + ' agreement(s)'}`, to: isLandlord ? '/landlord/my-lands' : '/lease/my-leases' },
    { icon: Package, label: 'My orders', sub: `${orders.length} order(s)`, to: '/shop/orders' },
    { icon: ShieldCheck, label: 'Insurance policies', sub: `${policies.filter(p => p.holderId === user.id).length} policy(s)`, to: '/(tabs)/insurance' },
    { icon: Bell, label: 'Notifications', sub: unread ? `${unread} unread` : 'All caught up', to: '/notifications' },
    { icon: UserCog, label: 'Admin console', sub: 'Platform operations', to: '/admin' },
  ] as const;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={gradients.hero} style={{ paddingBottom: 50, paddingTop: 10 }}>
          <View style={{ alignItems: 'center' }}>
            <Avatar seed={user.avatarSeed} size={72} style={{ backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.25)' }} />
            <Row style={{ gap: 7, marginTop: 13 }}>
              <Text style={styles.name}>{user.name}</Text>
              {user.verified ? <BadgeCheck size={17} color={colors.leaf} /> : null}
            </Row>
            <Text style={styles.meta}>{user.phone} · {user.district}, {user.state}</Text>
            <View style={styles.roleTag}>
              {isLandlord ? <Sprout size={12} color={colors.gold} /> : <Tractor size={12} color={colors.gold} />}
              <Text style={styles.roleText}>{isLandlord ? 'Landlord' : 'Renter farmer'}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: -30 }}>
          <FadeIn>
            <Card>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.stat}>{leases.filter(l => isLandlord ? l.landlordId === user.id : l.farmerId === user.id).length}</Text>
                  <Text style={type.micro}>Leases</Text>
                </View>
                <View style={styles.vline} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.stat}>{orders.length}</Text>
                  <Text style={type.micro}>Orders</Text>
                </View>
                <View style={styles.vline} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.stat}>{policies.filter(p => p.holderId === user.id).length}</Text>
                  <Text style={type.micro}>Policies</Text>
                </View>
              </Row>
            </Card>
          </FadeIn>

          {user.kycStatus !== 'verified' ? (
            <FadeIn delay={70}>
              <Pressable onPress={() => router.push('/kyc')} style={styles.kyc}>
                <View style={{ flex: 1 }}>
                  <Row style={{ gap: 8 }}>
                    <Text style={type.h3}>Finish your KYC</Text>
                    <Badge label={user.kycStatus.replace('_', ' ')} tone="gold" />
                  </Row>
                  <Text style={[type.small, { fontSize: 11.5, marginTop: 3 }]}>
                    Verified accounts get lease approvals up to 3x faster.
                  </Text>
                </View>
                <ChevronRight size={18} color={colors.warn} />
              </Pressable>
            </FadeIn>
          ) : null}

          <FadeIn delay={110}>
            <Card style={{ marginTop: spacing.lg, padding: 0, overflow: 'hidden' }}>
              {items.map((it, i) => (
                <Pressable key={it.label} onPress={() => router.push(it.to as any)} style={[styles.item, i < items.length - 1 && styles.itemBorder]}>
                  <View style={styles.itemIcon}><it.icon size={17} color={colors.green} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3}>{it.label}</Text>
                    {it.sub ? <Text style={[type.small, { fontSize: 11.5, marginTop: 1 }]}>{it.sub}</Text> : null}
                  </View>
                  <ChevronRight size={17} color={colors.muted} />
                </Pressable>
              ))}
            </Card>
          </FadeIn>

          <View style={{ gap: 10, marginTop: spacing.xl }}>
            <Button title={`Switch to ${isLandlord ? 'farmer' : 'landlord'} view`} icon={RefreshCw} variant="secondary" compact onPress={switchRole} />
            <Button title="Reset demo data" variant="ghost" compact onPress={() => setWipe(true)} />
            <Button title="Sign out" icon={LogOut} variant="danger" compact onPress={() => setOut(true)} />
          </View>

          <View style={{ alignItems: 'center', marginTop: spacing.xxl, opacity: 0.5 }}>
            <Logo size={17} />
            <Text style={[type.small, { fontSize: 10.5, marginTop: 6 }]}>Demo build v1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={out} title="Sign out?" body="Your demo data stays on this device."
        confirmLabel="Sign out" danger
        onConfirm={() => { setOut(false); dispatch({ type: 'LOGOUT' }); router.replace('/(auth)/login'); }}
        onCancel={() => setOut(false)}
      />
      <ConfirmDialog
        visible={wipe} title="Reset demo data?" body="All lands, leases, orders and policies you created return to the seeded state."
        confirmLabel="Reset" danger
        onConfirm={() => { setWipe(false); reset(); toast('Demo data reset', 'info'); router.replace('/'); }}
        onCancel={() => setWipe(false)}
      />
    </SafeAreaView>
  );
}

function kycLabel(s: string) {
  return s === 'verified' ? 'Verified' : s === 'pending' ? 'Under review' : s === 'rejected' ? 'Action needed' : 'Not started';
}

const styles = StyleSheet.create({
  name: { color: '#FFF', fontSize: 19, fontWeight: '800' },
  meta: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 4 },
  roleTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.13)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginTop: 12 },
  roleText: { color: '#FFF', fontSize: 11.5, fontWeight: '700' },
  stat: { fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 3 },
  vline: { width: 1, backgroundColor: colors.line },
  kyc: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.goldSoft, borderRadius: radius.lg, padding: 15, marginTop: spacing.lg, borderWidth: 1, borderColor: '#F0DFB6' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  itemIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
});
