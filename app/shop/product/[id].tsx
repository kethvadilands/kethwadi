import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Minus, Plus, ShieldCheck, Star, Truck, RotateCcw } from 'lucide-react-native';
import { Badge, Button, Card, Divider, FadeIn, Photo, Row, KeyValue } from '@/components/ui';
import { ProductCard } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { PRODUCTS } from '@/data';
import { inr } from '@/constants/format';
import { colors, radius, spacing, type } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dispatch, cartCount } = useApp();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return null;

  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  const similar = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);

  const add = (goToCart: boolean) => {
    dispatch({ type: 'CART_ADD', productId: p.id, qty });
    if (goToCart) router.push('/shop/cart');
    else toast(`${qty} × ${p.name} added`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ backgroundColor: '#FFF' }}>
          <Photo uri={p.image} style={{ width, height: 268 }} rounded={0} />
          <SafeAreaView edges={['top']} style={{ position: 'absolute', left: 0 }}>
            <Pressable onPress={() => router.back()} style={styles.nav}><ChevronLeft size={20} color={colors.ink} /></Pressable>
          </SafeAreaView>
        </View>

        <View style={{ padding: spacing.lg }}>
          <FadeIn>
            <Card>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text style={type.micro}>{p.brand}</Text>
                {off > 0 ? <Badge label={`${off}% off`} tone="green" /> : null}
              </Row>
              <Text style={[type.h1, { marginTop: 6 }]}>{p.name}</Text>
              <Row style={{ gap: 10, marginTop: 9 }}>
                <Row style={{ gap: 4, backgroundColor: colors.leafSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Star size={12} color={colors.green} fill={colors.green} />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: colors.green }}>{p.rating}</Text>
                </Row>
                <Text style={type.small}>{p.reviews.toLocaleString('en-IN')} farmer reviews</Text>
              </Row>
              <Row style={{ alignItems: 'flex-end', gap: 10, marginTop: 16 }}>
                <Text style={{ fontSize: 27, fontWeight: '800', color: colors.forest, letterSpacing: -0.8 }}>{inr(p.price)}</Text>
                <Text style={{ fontSize: 14, color: colors.muted, textDecorationLine: 'line-through', marginBottom: 4 }}>{inr(p.mrp)}</Text>
                <Text style={[type.small, { marginBottom: 5 }]}>per {p.unit}</Text>
              </Row>
              <Row style={{ gap: 6, marginTop: 12 }}>
                {p.stock > 20 ? <Badge label="In stock" tone="green" /> : <Badge label={`Only ${p.stock} left`} tone="gold" />}
                {p.tags.map(t => <Badge key={t} label={t} tone="blue" />)}
              </Row>
            </Card>
          </FadeIn>

          <FadeIn delay={70}>
            <Row style={{ gap: spacing.md, marginTop: spacing.lg }}>
              <Perk icon={Truck} label="2-4 day delivery" />
              <Perk icon={ShieldCheck} label="Genuine product" />
              <Perk icon={RotateCcw} label="7 day return" />
            </Row>
          </FadeIn>

          <FadeIn delay={120}>
            <Card style={{ marginTop: spacing.lg }}>
              <Text style={type.h2}>About</Text>
              <Text style={[type.body, { marginTop: 8 }]}>{p.description}</Text>
              <Divider />
              <Text style={type.h2}>How to use</Text>
              <Text style={[type.body, { marginTop: 8 }]}>{p.usage}</Text>
              <Divider />
              <KeyValue k="Category" v={p.category} />
              <KeyValue k="Pack size" v={p.unit} />
              <KeyValue k="Brand" v={p.brand} />
            </Card>
          </FadeIn>

          {similar.length ? (
            <View style={{ marginTop: spacing.xl }}>
              <Text style={[type.h2, { marginBottom: spacing.md }]}>Farmers also bought</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
                {similar.map(s => (
                  <View key={s.id} style={{ width: 158 }}>
                    <ProductCard product={s} onAdd={() => { dispatch({ type: 'CART_ADD', productId: s.id, qty: 1 }); toast(`${s.name} added`); }} />
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.bar}>
        <Row style={styles.qty}>
          <Pressable onPress={() => setQty(q => Math.max(1, q - 1))} hitSlop={8}><Minus size={16} color={colors.green} /></Pressable>
          <Text style={{ fontSize: 15, fontWeight: '800', color: colors.ink, minWidth: 22, textAlign: 'center' }}>{qty}</Text>
          <Pressable onPress={() => setQty(q => q + 1)} hitSlop={8}><Plus size={16} color={colors.green} /></Pressable>
        </Row>
        <Button title="Add to cart" variant="secondary" onPress={() => add(false)} style={{ flex: 1 }} compact />
        <Button title="Buy now" onPress={() => add(true)} style={{ flex: 1 }} compact />
      </View>
    </View>
  );
}

function Perk({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.perk}>
      <Icon size={16} color={colors.green} />
      <Text style={{ fontSize: 10.5, fontWeight: '700', color: colors.body, marginTop: 7, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { width: 38, height: 38, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', marginLeft: spacing.lg, marginTop: 6 },
  perk: { flex: 1, alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: 13, paddingHorizontal: 6, borderWidth: 1, borderColor: colors.line },
  qty: { gap: 12, borderWidth: 1.4, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: colors.bone },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingTop: 12, paddingBottom: 22, borderTopWidth: 1, borderTopColor: colors.line },
});
