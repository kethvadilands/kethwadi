import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PackageSearch, Receipt, ShoppingCart } from 'lucide-react-native';
import { Chip, EmptyState, FadeIn, Row, SearchBar, SectionHeader, Skeleton } from '@/components/ui';
import { ProductCard } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { CATEGORIES, PRODUCTS } from '@/data';
import { colors, gradients, radius, shadow, spacing, type } from '@/constants/theme';
import { ProductCategory } from '@/types';

export default function Marketplace() {
  const { dispatch, cartCount } = useApp();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<ProductCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 650); return () => clearTimeout(t); }, []);

  const list = useMemo(() => PRODUCTS.filter(p => {
    if (cat && p.category !== cat) return false;
    if (q && !`${p.name} ${p.brand} ${p.category} ${p.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, cat]);

  const add = (id: string, name: string) => {
    dispatch({ type: 'CART_ADD', productId: id, qty: 1 });
    toast(`${name} added to cart`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: 6 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <Text style={type.h1}>Agri inputs</Text>
            <Text style={[type.small, { marginTop: 2 }]}>Delivered to your village in 2 to 4 days</Text>
          </View>
          <Row style={{ gap: 9 }}>
            <Pressable onPress={() => router.push('/shop/orders')} style={styles.round}><Receipt size={18} color={colors.ink} /></Pressable>
            <Pressable onPress={() => router.push('/shop/cart')} style={styles.round}>
              <ShoppingCart size={18} color={colors.ink} />
              {cartCount ? <View style={styles.dot}><Text style={styles.dotText}>{cartCount}</Text></View> : null}
            </Pressable>
          </Row>
        </Row>
        <View style={{ marginTop: 14 }}>
          <SearchBar value={q} onChangeText={setQ} placeholder="Urea, seeds, sprayer, neem oil" />
        </View>
      </View>

      <FlatList
        data={list}
        keyExtractor={p => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg }}
        contentContainerStyle={{ paddingBottom: 40, gap: spacing.md }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <FadeIn>
              <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
                <View style={styles.banner}>
                  <LinearGradient colors={gradients.gold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: spacing.lg }}>
                    <Text style={styles.bannerTag}>KHARIF READY</Text>
                    <Text style={styles.bannerTitle}>Up to 18% off on{'\n'}fertilizer bundles</Text>
                    <Text style={styles.bannerBody}>Free delivery above ₹2,000 across Telangana and AP</Text>
                  </LinearGradient>
                </View>
              </View>
            </FadeIn>

            <View style={{ marginTop: spacing.xl }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 8 }}>
                <Chip label="All" active={!cat} onPress={() => setCat(null)} />
                {CATEGORIES.map(c => (
                  <Chip key={c.key} label={c.label} emoji={c.emoji} active={cat === c.key} onPress={() => setCat(cat === c.key ? null : c.key)} />
                ))}
              </ScrollView>
            </View>

            <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
              <SectionHeader title={cat ?? 'All products'} />
            </View>

            {loading ? (
              <Row style={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
                <Skeleton h={210} r={16} style={{ flex: 1 }} />
                <Skeleton h={210} r={16} style={{ flex: 1 }} />
              </Row>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) =>
          loading ? null : (
            <FadeIn delay={Math.min(index * 50, 200)} style={{ flex: 1 }}>
              <ProductCard product={item} onAdd={() => add(item.id, item.name)} />
            </FadeIn>
          )
        }
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              icon={PackageSearch}
              title="Nothing matches that search"
              body="Try a brand name, a crop, or pick a category above."
              action="Clear search"
              onAction={() => { setQ(''); setCat(null); }}
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  round: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  dotText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  banner: { borderRadius: radius.xl, overflow: 'hidden', ...shadow.card },
  bannerTag: { color: 'rgba(59,42,5,0.65)', fontSize: 9.5, fontWeight: '800', letterSpacing: 1.4 },
  bannerTitle: { color: '#3B2A05', fontSize: 21, fontWeight: '800', marginTop: 7, lineHeight: 27, letterSpacing: -0.4 },
  bannerBody: { color: 'rgba(59,42,5,0.72)', fontSize: 12, marginTop: 8, fontWeight: '600' },
});
