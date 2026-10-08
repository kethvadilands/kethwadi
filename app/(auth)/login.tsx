import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, ShieldCheck, Sprout, Tractor, UserCog } from 'lucide-react-native';
import { Button, Card, Field, Input, FadeIn, Row } from '@/components/ui';
import { Logo } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { DEMO_ACCOUNTS } from '@/data';
import { colors, gradients, radius, spacing, type } from '@/constants/theme';
import { Role } from '@/types';

const QUICK: { role: Role; label: string; sub: string; icon: any }[] = [
  { role: 'landlord', label: 'Landlord', sub: 'Ramesh Reddy · Warangal', icon: Sprout },
  { role: 'farmer', label: 'Renter farmer', sub: 'Anil Kumar · Karimnagar', icon: Tractor },
  { role: 'admin', label: 'Admin', sub: 'Platform operations', icon: UserCog },
];

export default function Login() {
  const { dispatch } = useApp();
  const toast = useToast();
  const [phone, setPhone] = useState('9848012345');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const sendOtp = () => {
    if (phone.trim().length !== 10) return toast('Enter a 10 digit mobile number', 'error');
    setBusy(true);
    setTimeout(() => { setBusy(false); setSent(true); toast('OTP sent. Use 1234 for the demo.', 'info'); }, 700);
  };

  const verify = () => {
    if (otp !== '1234') return toast('Incorrect OTP. The demo OTP is 1234.', 'error');
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      dispatch({ type: 'LOGIN', user: DEMO_ACCOUNTS.landlord });
      toast('Welcome back, Ramesh');
      router.replace('/(tabs)');
    }, 600);
  };

  const quickLogin = (role: Role) => {
    dispatch({ type: 'LOGIN', user: DEMO_ACCOUNTS[role] });
    toast(`Signed in as ${role}`);
    router.replace(role === 'admin' ? '/admin' : '/(tabs)');
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={gradients.hero} style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={{ alignItems: 'center', paddingTop: 22, paddingBottom: 46 }}>
            <Logo size={32} tone="light" showTag />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, marginTop: -34 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <FadeIn>
            <Card>
              <Text style={type.h1}>Sign in</Text>
              <Text style={[type.small, { marginTop: 4, marginBottom: 22 }]}>
                We send a one time password to your registered mobile number.
              </Text>

              <Field label="Mobile number">
                <Row style={{ gap: 8 }}>
                  <View style={styles.cc}><Text style={{ fontWeight: '700', color: colors.ink }}>+91</Text></View>
                  <Input
                    value={phone} onChangeText={setPhone} keyboardType="number-pad" maxLength={10}
                    placeholder="10 digit number" style={{ flex: 1 }}
                  />
                </Row>
              </Field>

              {sent ? (
                <Field label="One time password" hint="Demo OTP is 1234">
                  <Input
                    value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={4}
                    placeholder="1234" style={{ letterSpacing: 10, fontSize: 18, fontWeight: '700' }}
                  />
                </Field>
              ) : null}

              <Button
                title={sent ? 'Verify and continue' : 'Send OTP'}
                icon={sent ? ShieldCheck : Phone}
                loading={busy}
                onPress={sent ? verify : sendOtp}
              />
              <Pressable onPress={() => router.push('/(auth)/register')} style={{ marginTop: 16 }}>
                <Text style={styles.link}>
                  New to KETHWADI? <Text style={{ color: colors.green, fontWeight: '800' }}>Create an account</Text>
                </Text>
              </Pressable>
            </Card>
          </FadeIn>

          <FadeIn delay={120}>
            <Text style={[type.micro, { marginTop: 28, marginBottom: 10 }]}>Demo shortcuts</Text>
            <View style={{ gap: 10 }}>
              {QUICK.map(q => (
                <Pressable key={q.role} onPress={() => quickLogin(q.role)} style={styles.quick}>
                  <View style={styles.quickIcon}><q.icon size={18} color={colors.green} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3}>{q.label}</Text>
                    <Text style={[type.small, { fontSize: 11.5 }]}>{q.sub}</Text>
                  </View>
                  <Text style={{ color: colors.green, fontWeight: '800', fontSize: 12 }}>ENTER</Text>
                </Pressable>
              ))}
            </View>
          </FadeIn>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingBottom: 20 },
  cc: { height: 47, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
  link: { textAlign: 'center', color: colors.muted, fontSize: 13 },
  quick: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 13, borderWidth: 1, borderColor: colors.line },
  quickIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
});
