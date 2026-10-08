import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Sprout, Tractor } from 'lucide-react-native';
import { Button, FadeIn, TopBar } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { colors, radius, spacing, type } from '@/constants/theme';
import { Role, User } from '@/types';
import { uid } from '@/constants/format';

const OPTIONS: { role: Role; title: string; body: string; icon: any }[] = [
  { role: 'landlord', title: 'Landlord / Landowner', body: 'List plots, set lease terms and earn from land you are not cultivating.', icon: Sprout },
  { role: 'farmer', title: 'Renter farmer', body: 'Find the right land, lease it for a season and buy inputs in one place.', icon: Tractor },
];

export default function RoleSelect() {
  const params = useLocalSearchParams<{ name?: string; phone?: string; district?: string; state?: string }>();
  const { dispatch } = useApp();
  const toast = useToast();
  const [role, setRole] = useState<Role>('farmer');

  const finish = () => {
    const user: User = {
      id: uid('u'),
      name: params.name || 'Demo User',
      phone: params.phone || '9000000001',
      email: `${(params.name || 'demo').toLowerCase().replace(/\s+/g, '.')}@kethwadi.in`,
      role,
      district: params.district || 'Warangal',
      state: params.state || 'Telangana',
      kycStatus: 'not_started',
      verified: false,
      joinedOn: new Date().toISOString().slice(0, 10),
      avatarSeed: (params.name || 'DU').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    };
    dispatch({ type: 'LOGIN', user });
    toast('Account created. Finish KYC to unlock leasing.');
    router.replace('/kyc');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Choose your role" subtitle="You can switch later from your profile" />
      <View style={{ padding: spacing.lg, flex: 1 }}>
        {OPTIONS.map((o, i) => (
          <FadeIn key={o.role} delay={i * 90}>
            <Pressable onPress={() => setRole(o.role)} style={[styles.opt, role === o.role && styles.optActive]}>
              <View style={[styles.icon, role === o.role && { backgroundColor: colors.green }]}>
                <o.icon size={22} color={role === o.role ? '#FFF' : colors.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={type.h2}>{o.title}</Text>
                <Text style={[type.small, { marginTop: 5 }]}>{o.body}</Text>
              </View>
              {role === o.role ? (
                <View style={styles.tick}><Check size={13} color="#FFF" strokeWidth={3} /></View>
              ) : <View style={styles.ring} />}
            </Pressable>
          </FadeIn>
        ))}
        <View style={{ flex: 1 }} />
        <Button title="Continue to KYC" onPress={finish} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  opt: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1.6, borderColor: colors.line, marginBottom: spacing.md },
  optActive: { borderColor: colors.green, backgroundColor: '#FBFDFB' },
  icon: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
  tick: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  ring: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.6, borderColor: colors.line },
});
