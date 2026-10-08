import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { CreditCard, Minus, Plus, ShieldCheck, Smartphone, Wallet } from 'lucide-react-native';
import { Button, Card, Chip, ConfirmDialog, Divider, FadeIn, KeyValue, Photo, Row, TopBar } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { addMonths, inr, seq, uid } from '@/constants/format';
import { colors, radius, spacing, type } from '@/constants/theme';
import { Lease } from '@/types';

const DURATIONS = [12, 24, 36];
const PAY = [
  { key: 'UPI', label: 'UPI', icon: Smartphone, sub: 'PhonePe, GPay, Paytm' },
  { key: 'Card', label: 'Debit / credit card', icon: CreditCard, sub: 'Visa, Mastercard, RuPay' },
  { key: 'Bank', label: 'Net banking', icon: Wallet, sub: 'All major banks' },
];

export default function BookLand() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lands, user, dispatch } = useApp();
  const toast = useToast();
  const land = lands.find(l => l.id === id);
  const [area, setArea] = useState(2);
  const [months, setMonths] = useState(12);
  const [pay, setPay] = useState('UPI');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const total = useMemo(() => (land ? Math.round(land.pricePerAcreYear * area * (months / 12)) : 0), [land, area, months]);
  const advance = Math.round(total * 0.2);
  const platform = Math.round(total * 0.02);

  if (!land) return null;

  const submit = () => {
    setConfirm(false);
    setBusy(true);
    setTimeout(() => {
      const start = new Date().toISOString();
      const lease: Lease = {
        id: uid('ls'),
        agreementNo: `KW/LSE/${new Date().getFullYear()}/${seq('').slice(0, 4)}`,
        landId: land.id, landTitle: land.title, landImage: land.image, district: land.district,
        farmerId: user?.id ?? 'u-fr-1', farmerName: user?.name ?? 'Anil Kumar',
        landlordId: land.ownerId, landlordName: land.ownerName,
        area, durationMonths: months, amount: total,
        status: 'pending', paymentStatus: 'paid',
        startDate: start, endDate: addMonths(start, months), createdAt: start,
      };
      dispatch({ type: 'ADD_LEASE', lease });
      dispatch({
        type: 'NOTIFY',
        item: { id: uid('n'), title: 'Lease request sent', body: `${area} acres on ${land.title} awaiting owner approval.`, kind: 'lease', time: 'Just now', read: false },
      });
      setBusy(false);
      router.replace({ pathname: '/lease/confirmation', params: { id: lease.id } });
    }, 1200);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Book this land" subtitle={land.title} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <FadeIn>
          <Card>
            <Row style={{ gap: 12 }}>
              <Photo uri={land.image} style={{ width: 66, height: 66 }} rounded={radius.md} />
              <View style={{ flex: 1 }}>
                <Text style={type.h3}>{land.title}</Text>
                <Text style={[type.small, { marginTop: 2 }]}>{land.village}, {land.district}</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: colors.forest, marginTop: 5 }}>
                  {inr(land.pricePerAcreYear)} / acre / year
                </Text>
              </View>
            </Row>
          </Card>
        </FadeIn>

        <FadeIn delay={70}>
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={type.h2}>Area to lease</Text>
            <Text style={[type.small, { marginTop: 3 }]}>{land.availableArea} acres available on this plot</Text>
            <Row style={{ justifyContent: 'space-between', marginTop: 16 }}>
              <Pressable onPress={() => setArea(a => Math.max(1, a - 1))} style={styles.step}>
                <Minus size={17} color={colors.green} />
              </Pressable>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 34, fontWeight: '800', color: colors.ink, letterSpacing: -1 }}>{area}</Text>
                <Text style={type.micro}>ACRES</Text>
              </View>
              <Pressable
                onPress={() => setArea(a => (a < land.availableArea ? a + 1 : (toast('That exceeds the free area on this plot', 'error'), a)))}
                style={styles.step}
              >
                <Plus size={17} color={colors.green} />
              </Pressable>
            </Row>
          </Card>
        </FadeIn>

        <FadeIn delay={120}>
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={type.h2}>Lease duration</Text>
            <Row style={{ gap: 9, marginTop: 13, flexWrap: 'wrap' }}>
              {DURATIONS.map(d => (
                <Chip
                  key={d} label={`${d} months`} active={months === d}
                  onPress={() => (d < land.minLeaseMonths ? toast(`Owner requires at least ${land.minLeaseMonths} months`, 'error') : setMonths(d))}
                />
              ))}
            </Row>
          </Card>
        </FadeIn>

        <FadeIn delay={170}>
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={type.h2}>Payment method</Text>
            <View style={{ gap: 10, marginTop: 13 }}>
              {PAY.map(p => (
                <Pressable key={p.key} onPress={() => setPay(p.key)} style={[styles.pay, pay === p.key && styles.payOn]}>
                  <View style={styles.payIcon}><p.icon size={17} color={colors.green} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3}>{p.label}</Text>
                    <Text style={[type.small, { fontSize: 11.5 }]}>{p.sub}</Text>
                  </View>
                  <View style={[styles.radio, pay === p.key && { borderColor: colors.green, borderWidth: 6 }]} />
                </Pressable>
              ))}
            </View>
          </Card>
        </FadeIn>

        <FadeIn delay={210}>
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={type.h2}>Payment summary</Text>
            <Divider />
            <KeyValue k={`Lease · ${area} ac × ${months} mo`} v={inr(total)} />
            <KeyValue k="Platform fee (2%)" v={inr(platform)} />
            <KeyValue k="Security advance (20%)" v={inr(advance)} />
            <Divider />
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={type.h3}>Payable now</Text>
              <Text style={{ fontSize: 21, fontWeight: '800', color: colors.forest }}>{inr(advance + platform)}</Text>
            </Row>
            <Row style={{ gap: 7, marginTop: 12, backgroundColor: colors.leafSoft, padding: 11, borderRadius: radius.md }}>
              <ShieldCheck size={15} color={colors.green} />
              <Text style={[type.small, { flex: 1, fontSize: 11.5, color: colors.green }]}>
                Held in escrow until the owner approves. Refunded in full if the request is declined.
              </Text>
            </Row>
          </Card>
        </FadeIn>
      </ScrollView>

      <View style={styles.bar}>
        <View style={{ flex: 1 }}>
          <Text style={[type.micro, { fontSize: 9.5 }]}>Pay now</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.forest }}>{inr(advance + platform)}</Text>
        </View>
        <Button title="Pay and request" onPress={() => setConfirm(true)} loading={busy} full={false} style={{ paddingHorizontal: 24 }} />
      </View>

      <ConfirmDialog
        visible={confirm}
        title="Send this lease request?"
        body={`${area} acres of ${land.title} for ${months} months. ${inr(advance + platform)} will be debited via ${pay}.`}
        confirmLabel="Pay now"
        onConfirm={submit}
        onCancel={() => setConfirm(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  step: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
  pay: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.4, borderColor: colors.line, borderRadius: radius.md, padding: 12 },
  payOn: { borderColor: colors.green, backgroundColor: '#FBFDFB' },
  payIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.6, borderColor: colors.line },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingTop: 12, paddingBottom: 20, borderTopWidth: 1, borderTopColor: colors.line },
});
