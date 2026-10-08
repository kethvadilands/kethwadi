import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SlidersHorizontal, MapPinOff, X } from 'lucide-react-native';
import {
  Badge, Button, Chip, FadeIn, Label, ListSkeleton, Row, SearchBar, EmptyState, BottomSheet, Input, Field,
} from '@/components/ui';
import { LandCard } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { CROPS, DISTRICTS, SOILS, STATES } from '@/data';
import { colors, spacing, type } from '@/constants/theme';
import { inr } from '@/constants/format';

const WATER = ['Abundant', 'Moderate', 'Limited'];

export default function LandSearch() {
  const { lands } = useApp();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [crop, setCrop] = useState<string | null>(null);
  const [soil, setSoil] = useState<string | null>(null);
  const [water, setWater] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const activeCount = [state, district, crop, soil, water].filter(Boolean).length + (maxPrice ? 1 : 0) + (minArea ? 1 : 0);

  const results = useMemo(() => lands.filter(l => {
    if (l.status !== 'published') return false;
    const hay = `${l.title} ${l.village} ${l.district} ${l.state} ${l.soilType} ${l.crops.join(' ')}`.toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    if (state && l.state !== state) return false;
    if (district && l.district !== district) return false;
    if (crop && !l.crops.includes(crop)) return false;
    if (soil && l.soilType !== soil) return false;
    if (water && l.waterAvailability !== water) return false;
    if (maxPrice && l.pricePerAcreYear > Number(maxPrice)) return false;
    if (minArea && l.availableArea < Number(minArea)) return false;
    return true;
  }), [lands, q, state, district, crop, soil, water, maxPrice, minArea]);

  const clear = () => {
    setState(null); setDistrict(null); setCrop(null); setSoil(null); setWater(null); setMaxPrice(''); setMinArea('');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: 6, paddingBottom: 12 }}>
        <Text style={type.h1}>Find land</Text>
        <Text style={[type.small, { marginTop: 2, marginBottom: 14 }]}>
          {results.length} verified plot{results.length === 1 ? '' : 's'} across four states
        </Text>
        <SearchBar
          value={q} onChangeText={setQ}
          placeholder="District, village, crop or soil"
          right={
            <Pressable onPress={() => setOpen(true)} hitSlop={8} style={styles.filterBtn}>
              <SlidersHorizontal size={16} color={activeCount ? '#FFF' : colors.body} />
              {activeCount ? <View style={styles.fCount}><Text style={styles.fCountText}>{activeCount}</Text></View> : null}
            </Pressable>
          }
        />
        {activeCount ? (
          <Row style={{ gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {[state, district, crop, soil, water].filter(Boolean).map(f => (
              <View key={f as string} style={styles.pill}>
                <Text style={styles.pillText}>{f}</Text>
              </View>
            ))}
            <Pressable onPress={clear} style={[styles.pill, { backgroundColor: colors.dangerSoft, flexDirection: 'row', gap: 4, alignItems: 'center' }]}>
              <X size={11} color={colors.danger} />
              <Text style={[styles.pillText, { color: colors.danger }]}>Clear</Text>
            </Pressable>
          </Row>
        ) : null}
      </View>

      {loading ? (
        <View style={{ paddingHorizontal: spacing.lg }}><ListSkeleton rows={4} /></View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={l => l.id}
          contentContainerStyle={{ padding: spacing.lg, paddingTop: 4, paddingBottom: 40, gap: spacing.md }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <FadeIn delay={Math.min(index * 60, 240)}><LandCard land={item} /></FadeIn>
          )}
          ListEmptyComponent={
            <EmptyState
              icon={MapPinOff}
              title="No plots match those filters"
              body="Widen the price range or clear a filter or two. New land is listed every week."
              action="Clear filters"
              onAction={clear}
            />
          }
        />
      )}

      <BottomSheet visible={open} onClose={() => setOpen(false)} title="Filter land">
        <Label style={{ marginBottom: 8 }}>State</Label>
        <Row style={{ flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg }}>
          {STATES.map(s => (
            <Chip key={s} label={s} active={state === s} onPress={() => { setState(state === s ? null : s); setDistrict(null); }} />
          ))}
        </Row>

        {state ? (
          <>
            <Label style={{ marginBottom: 8 }}>District</Label>
            <Row style={{ flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg }}>
              {DISTRICTS[state].map(d => (
                <Chip key={d} label={d} active={district === d} onPress={() => setDistrict(district === d ? null : d)} />
              ))}
            </Row>
          </>
        ) : null}

        <Label style={{ marginBottom: 8 }}>Crop</Label>
        <Row style={{ flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg }}>
          {CROPS.slice(0, 8).map(c => (
            <Chip key={c} label={c} active={crop === c} onPress={() => setCrop(crop === c ? null : c)} />
          ))}
        </Row>

        <Label style={{ marginBottom: 8 }}>Soil</Label>
        <Row style={{ flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg }}>
          {SOILS.map(s => (
            <Chip key={s} label={s} active={soil === s} onPress={() => setSoil(soil === s ? null : s)} />
          ))}
        </Row>

        <Label style={{ marginBottom: 8 }}>Water availability</Label>
        <Row style={{ flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg }}>
          {WATER.map(w => (
            <Chip key={w} label={w} active={water === w} onPress={() => setWater(water === w ? null : w)} />
          ))}
        </Row>

        <Row style={{ gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field label="Max price / acre / yr">
              <Input value={maxPrice} onChangeText={setMaxPrice} keyboardType="number-pad" placeholder="e.g. 35000" />
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Min available area">
              <Input value={minArea} onChangeText={setMinArea} keyboardType="number-pad" placeholder="acres" />
            </Field>
          </View>
        </Row>

        <Row style={{ gap: 10 }}>
          <Button title="Reset" variant="ghost" onPress={clear} style={{ flex: 1 }} compact />
          <Button title={`Show ${results.length} plots`} onPress={() => setOpen(false)} style={{ flex: 1.4 }} compact />
        </Row>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  fCount: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  fCountText: { fontSize: 9, fontWeight: '800', color: '#3B2A05' },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: colors.leafSoft },
  pillText: { fontSize: 11.5, fontWeight: '700', color: colors.green },
});
