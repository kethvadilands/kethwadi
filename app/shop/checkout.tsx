import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Banknote, CreditCard, Smartphone } from 'lucide-react-native';
import { Button, Card, Divider, Field, Input, KeyValue, Row, SuccessModal, TopBar } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { PRODUCTS } from '@/data';
import { inr, uid } from '@/constants/format';
import { colors, radius, spacing, type } from '@/constants/theme';
import { Order } from '@/types';

const MODES = [
  { key: 'UPI', label: 'UPI', icon: Smartphone },
  { key: 'Card', label: 'Card', icon: CreditCard },
  { key: 'Cash on delivery', label: 'Cash on delivery', icon: Banknote },
];

export default function Checkout() {
  const { cart, user, dispatch } = useApp();
  const toast = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [addr, setAddr] = useState(`Village road, ${user?.district ?? 'Warangal'}, ${user?.state ?? 'Telangana'}`);
  const [pin, setPin] = useState('506164');
  const [mode, setMode] = useState('UPI');
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const lines = cart.map(c => ({ ...c, product: PRODUCTS.find(p => p.id === c.productId)! })).filter(l => l.product);
  const subtotal = lines.reduce((t, l) => t + l.product.price * l.qty, 0);
  const delivery = subtotal >= 2000 ? 0 : 90;
  const total = subtotal + delivery;

  const place = () => {
    if (!name.trim() || phone.trim().length !== 10 || !addr.trim() || pin.length !== 6) {
      return toast('Check the delivery details before placing the order', 'error');
    }
    setBusy(true);
    setTimeout(() => {
      const order: Order = {
        id: uid('or'),
        items: lines.map(l => ({ productId: l.productId, name: l.product.name, qty: l.qty, price: l.product.price, image: l.product.image })),
        total, status: 'placed', placedAt: new Date().toISOString(),
        address: `${addr} - ${pin}`, paymentMode: mode,
      };
      dispatch({ type: 'ADD_ORDER', order });
      dispatch({ type: 'NOTIFY', item: { id: uid('n'), title: 'Order placed', body: `${lines.length} item(s) worth ${inr(total)} confirmed.`, kind: 'order', time: 'Just now', read: false } });
      setBusy(false);
      setOrderId(order.id);
    }, 1100);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Checkout" subtitle={`${lines.length} item(s) · ${inr(total)}`} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <Card>
            <Text style={type.h2}>Delivery address</Text>
            <View style={{ height: 14 }} />
            <Field label="Name"><Input value={name} onChangeText={setName} placeholder="Full name" /></Field>
            <Field label="Mobile"><Input value={phone} onChangeText={setPhone} keyboardType="number-pad" maxLength={10} /></Field>
            <Field label="Address">
              <Input value={addr} onChangeText={setAddr} multiline style={{ height: 84, textAlignVertical: 'top' }} />
            </Field>
            <Field label="PIN code"><Input value={pin} onChangeText={setPin} keyboardType="number-pad" maxLength={6} /></Field>
          </Card>

          <Card style={{ marginTop: spacing.lg }}>
            <Text style={type.h2}>Payment</Text>
            <Row style={{ gap: 9, marginTop: 13, flexWrap: 'wrap' }}>
              {MODES.map(m => (
                <Pressable key={m.key} onPress={() => setMode(m.key)} style={[styles.mode, mode === m.key && styles.modeOn]}>
                  <m.icon size={16} color={mode === m.key ? '#FFF' : colors.body} />
                  <Text style={[styles.modeText, mode === m.key && { color: '#FFF' }]}>{m.label}</Text>
                </Pressable>
              ))}
            </Row>
          </Card>

          <Card style={{ marginTop: spacing.lg }}>
            <Text style={type.h2}>Order summary</Text>
            <Divider />
            {lines.map(l => (
              <KeyValue key={l.productId} k={`${l.product.name} × ${l.qty}`} v={inr(l.product.price * l.qty)} />
            ))}
            <Divider />
            <KeyValue k="Delivery" v={delivery ? inr(delivery) : 'Free'} />
            <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={type.h3}>Total</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.forest }}>{inr(total)}</Text>
            </Row>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bar}>
        <Button title={`Place order · ${inr(total)}`} onPress={place} loading={busy} />
      </View>

      <SuccessModal
        visible={!!orderId}
        title="Order confirmed"
        body="You will get an SMS when the consignment leaves the warehouse."
        meta={[{ k: 'Order', v: `#${orderId?.toUpperCase() ?? ''}` }, { k: 'Paid via', v: mode }, { k: 'Total', v: inr(total) }]}
        primaryLabel="Track order"
        onPrimary={() => { setOrderId(null); router.replace('/shop/orders'); }}
        secondaryLabel="Continue shopping"
        onSecondary={() => { setOrderId(null); router.replace('/(tabs)/marketplace'); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mode: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1.3, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 11 },
  modeOn: { backgroundColor: colors.green, borderColor: colors.green },
  modeText: { fontSize: 12.5, fontWeight: '700', color: colors.body },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingTop: 12, paddingBottom: 22, borderTopWidth: 1, borderTopColor: colors.line },
});
