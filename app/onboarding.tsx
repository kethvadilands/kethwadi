import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Landmark, ShieldCheck, ShoppingBasket } from 'lucide-react-native';
import { Button, FadeIn, Photo } from '@/components/ui';
import { Logo } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { LAND_IMAGES } from '@/data';
import { colors, spacing, type } from '@/constants/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  { icon: Landmark, image: LAND_IMAGES[0], title: 'Lease land without the paperwork maze', body: 'Verified owners, mapped plots and digital agreements. Pick the acres you need, for the season you need them.' },
  { icon: ShoppingBasket, image: LAND_IMAGES[2], title: 'Buy inputs at the right price', body: 'Fertilizers, seeds, crop protection and equipment delivered to the village, with usage guidance on every product.' },
  { icon: ShieldCheck, image: LAND_IMAGES[6], title: 'Farm with a safety net', body: 'Accident, crop loss and lease default cover for both sides. Raise a claim from the field and track it to settlement.' },
];

export default function Onboarding() {
  const { dispatch } = useApp();
  const [i, setI] = useState(0);
  const ref = useRef<FlatList>(null);

  const finish = () => { dispatch({ type: 'ONBOARDED' }); router.replace('/(auth)/login'); };
  const next = () => {
    if (i === SLIDES.length - 1) return finish();
    ref.current?.scrollToIndex({ index: i + 1, animated: true });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }} edges={['top', 'bottom']}>
      <View style={styles.head}>
        <Logo size={20} />
        <Pressable onPress={finish} hitSlop={10}><Text style={styles.skip}>Skip</Text></Pressable>
      </View>

      <FlatList
        ref={ref}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={s => s.title}
        onMomentumScrollEnd={e => setI(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index }) => (
          <View style={{ width, paddingHorizontal: spacing.xl }}>
            <FadeIn delay={index === 0 ? 120 : 0}>
              <Photo uri={item.image} style={{ width: '100%', height: 300 }} rounded={26} />
              <View style={styles.iconBadge}><item.icon size={20} color={colors.green} /></View>
              <Text style={[type.display, { marginTop: 28, lineHeight: 38 }]}>{item.title}</Text>
              <Text style={[type.body, { marginTop: 12, fontSize: 15, lineHeight: 23 }]}>{item.body}</Text>
            </FadeIn>
          </View>
        )}
      />

      <View style={styles.foot}>
        <View style={styles.dots}>
          {SLIDES.map((_, d) => (
            <View key={d} style={[styles.dot, d === i && styles.dotActive]} />
          ))}
        </View>
        <Button title={i === SLIDES.length - 1 ? 'Get started' : 'Next'} onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  skip: { color: colors.muted, fontWeight: '700', fontSize: 13 },
  iconBadge: { position: 'absolute', top: 268, left: 20, width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  foot: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, gap: spacing.lg },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.line },
  dotActive: { width: 22, backgroundColor: colors.gold },
});
