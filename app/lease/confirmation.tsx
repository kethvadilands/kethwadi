import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, Download, FileText } from 'lucide-react-native';
import { Button, Card, Divider, FadeIn, KeyValue, Row } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { inr, shortDate } from '@/constants/format';
import { colors, gradients, radius, spacing, type } from '@/constants/theme';

export default function LeaseConfirmation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { leases } = useApp();
  const toast = useToast();
  const lease = leases.find(l => l.id === id) ?? leases[0];
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, bounciness: 12, speed: 6 }).start();
  }, [pop]);

  if (!lease) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bone }}>
      <LinearGradient colors={gradients.hero} style={{ paddingBottom: 46 }}>
        <SafeAreaView edges={['top']}>
          <View style={{ alignItems: 'center', paddingTop: 34 }}>
            <Animated.View style={{ transform: [{ scale: pop }] }}>
              <View style={styles.tick}><CheckCircle2 size={40} color={colors.leaf} /></View>
            </Animated.View>
            <Text style={styles.title}>Request sent</Text>
            <Text style={styles.sub}>
              {lease.landlordName} has 48 hours to approve. Your advance sits in escrow until then.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={{ marginTop: -30 }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <FadeIn>
          <Card>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={type.micro}>Agreement number</Text>
              <Text style={{ fontWeight: '800', color: colors.forest, letterSpacing: 0.6 }}>{lease.agreementNo}</Text>
            </Row>
            <Divider />
            <KeyValue k="Land" v={lease.landTitle} />
            <KeyValue k="District" v={lease.district} />
            <KeyValue k="Area leased" v={`${lease.area} acres`} />
            <KeyValue k="Duration" v={`${lease.durationMonths} months`} />
            <KeyValue k="Start date" v={shortDate(lease.startDate)} />
            <KeyValue k="End date" v={shortDate(lease.endDate)} />
            <Divider />
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={type.h3}>Total lease value</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.forest }}>{inr(lease.amount)}</Text>
            </Row>
          </Card>
        </FadeIn>

        <FadeIn delay={90}>
          <Card style={{ marginTop: spacing.lg }}>
            <Row style={{ gap: 11 }}>
              <View style={styles.docIcon}><FileText size={18} color={colors.green} /></View>
              <View style={{ flex: 1 }}>
                <Text style={type.h3}>Lease agreement</Text>
                <Text style={[type.small, { fontSize: 11.5, marginTop: 2 }]}>
                  Generated and e-signed once the owner approves
                </Text>
              </View>
            </Row>
            <Button
              title="Download draft agreement" variant="secondary" icon={Download} compact
              style={{ marginTop: 14 }}
              onPress={() => toast('Draft agreement saved to your documents')}
            />
          </Card>
        </FadeIn>

        <View style={{ gap: 10, marginTop: spacing.xl }}>
          <Button title="Track my leases" onPress={() => router.replace('/lease/my-leases')} />
          <Button title="Back to home" variant="ghost" onPress={() => router.replace('/(tabs)')} compact />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tick: { width: 82, height: 82, borderRadius: 41, backgroundColor: 'rgba(63,191,111,0.16)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(63,191,111,0.35)' },
  title: { color: '#FFF', fontSize: 25, fontWeight: '800', marginTop: 18, letterSpacing: -0.5 },
  sub: { color: 'rgba(255,255,255,0.72)', fontSize: 13, textAlign: 'center', marginTop: 8, paddingHorizontal: 42, lineHeight: 20 },
  docIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
});
