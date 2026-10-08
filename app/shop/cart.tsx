import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react-native';
import { Button, Card, Divider, EmptyState, FadeIn, KeyValue, Photo, Row, TopBar } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { PRODUCTS } from '@/data';
import { inr } from '@/constants/format';
import { colors, radius, spacing, type } from '@/constants/theme';

export default function Cart() {
  const { cart, dispatch } = useApp();
  const toast = useToast();

  const lines = cart.map(c => ({ ...c, product: PRODUCTS.find(p => p.id === c.productId)! })).filter(l => l.product);
  const subtotal = lines.reduce((t, l) => t + l.product.price * l.qty, 0);
  const saved = lines.reduce((t, l) => t + (l.product.mrp - l.product.price) * l.qty, 0);
  const delivery = subtotal >= 2000 || subtotal === 0 ? 0 : 90;

  if (!lines.length) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TopBar title="Cart" />
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          body="Add fertilizers, seeds or equipment and they will show up here."
          action="Browse products"
          onAction={() => router.replace('/(tabs)/marketplace')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Cart" subtitle={`${lines.length} item${lines.length === 1 ? '' : 's'}`} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: spacing.md }}>
          {lines.map((l, i) => (
            <FadeIn key={l.productId} delay={i * 60}>
              <Card style={{ padding: 12 }}>
                <Row style={{ gap: 12 }}>
                  <Photo uri={l.product.image} style={{ width: 72, height: 72 }} rounded={radius.md} />
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3} numberOfLines={2}>{l.product.name}</Text>
                    <Text style={[type.small, { fontSize: 11.5, marginTop: 2 }]}>{l.product.brand} · {l.product.unit}</Text>
                    <Row style={{ justifyContent: 'space-between', marginTop: 10 }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: colors.forest }}>{inr(l.product.price * l.qty)}</Text>
                      <Row style={styles.qty}>
                        <Pressable onPress={() => dispatch({ type: 'CART_SET', productId: l.productId, qty: l.qty - 1 })} hitSlop={8}>
                          <Minus size={14} color={colors.green} />
                        </Pressable>
                        <Text style={{ fontWeight: '800', fontSize: 13.5, minWidth: 18, textAlign: 'center' }}>{l.qty}</Text>
                        <Pressable onPress={() => dispatch({ type: 'CART_SET', productId: l.productId, qty: l.qty + 1 })} hitSlop={8}>
                          <Plus size={14} color={colors.green} />
                        </Pressable>
                      </Row>
                      <Pressable onPress={() => { dispatch({ type: 'CART_REMOVE', productId: l.productId }); toast('Removed from cart', 'info'); }} hitSlop={8}>
                        <Trash2 size={16} color={colors.danger} />
                      </Pressable>
                    </Row>
                  </View>
                </Row>
              </Card>
            </FadeIn>
          ))}
        </View>

        <Card style={{ marginTop: spacing.xl }}>
          <Text style={type.h2}>Bill summary</Text>
          <Divider />
          <KeyValue k="Item total" v={inr(subtotal)} />
          <KeyValue k="Delivery" v={delivery ? inr(delivery) : 'Free'} tone={delivery ? undefined : colors.green} />
          <KeyValue k="You save" v={inr(saved)} tone={colors.green} />
          <Divider />
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={type.h3}>To pay</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.forest }}>{inr(subtotal + delivery)}</Text>
          </Row>
          {delivery ? (
            <Text style={[type.small, { fontSize: 11.5, marginTop: 10 }]}>
              Add {inr(2000 - subtotal)} more to get free delivery.
            </Text>
          ) : null}
        </Card>
      </ScrollView>

      <View style={styles.bar}>
        <View style={{ flex: 1 }}>
          <Text style={[type.micro, { fontSize: 9.5 }]}>Total</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.forest }}>{inr(subtotal + delivery)}</Text>
        </View>
        <Button title="Checkout" onPress={() => router.push('/shop/checkout')} full={false} style={{ paddingHorizontal: 32 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  qty: { gap: 10, borderWidth: 1.2, borderColor: colors.line, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6 },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingTop: 12, paddingBottom: 22, borderTopWidth: 1, borderTopColor: colors.line },
});
