import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Landmark, Plus } from 'lucide-react-native';
import { Badge, BottomSheet, Button, Chip, Divider, EmptyState, FadeIn, KeyValue, Row, Tone, TopBar } from '@/components/ui';
import { LandRow } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { inr } from '@/constants/format';
import { spacing } from '@/constants/theme';
import { Land, LandStatus } from '@/types';

const TONE: Record<LandStatus, Tone> = { published: 'green', pending: 'gold', draft: 'grey', rejected: 'red' };
const TABS: (LandStatus | 'all')[] = ['all', 'published', 'pending', 'draft'];

export default function MyLands() {
  const { lands, user, leases, dispatch } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState<LandStatus | 'all'>('all');
  const [open, setOpen] = useState<Land | null>(null);

  const mine = lands.filter(l => l.ownerId === user?.id);
  const list = tab === 'all' ? mine : mine.filter(l => l.status === tab);
  const leasedArea = (id: string) =>
    leases.filter(l => l.landId === id && l.status === 'active').reduce((t, l) => t + l.area, 0);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar
        title="My lands"
        subtitle={`${mine.length} plot${mine.length === 1 ? '' : 's'} listed`}
        right={<Button title="Add" icon={Plus} compact full={false} onPress={() => router.push('/landlord/add-land')} style={{ paddingHorizontal: 14 }} />}
      />
      <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 12 }}>
        <Row style={{ gap: 8 }}>
          {TABS.map(t => <Chip key={t} label={t === 'all' ? 'All' : t} active={tab === t} onPress={() => setTab(t)} />)}
        </Row>
      </View>

      <FlatList
        data={list}
        keyExtractor={l => l.id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 4, gap: spacing.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeIn delay={Math.min(index * 60, 200)}>
            <LandRow land={item} onPress={() => setOpen(item)} right={<Badge label={item.status} tone={TONE[item.status]} />} />
          </FadeIn>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={Landmark}
            title="Nothing listed yet"
            body="List a plot with its documents and lease terms. Verification takes about a day."
            action="List a plot"
            onAction={() => router.push('/landlord/add-land')}
          />
        }
      />

      <BottomSheet visible={!!open} onClose={() => setOpen(null)} title={open?.title ?? ''}>
        {open ? (
          <View>
            <KeyValue k="Location" v={`${open.village}, ${open.district}`} />
            <KeyValue k="Total area" v={`${open.totalArea} acres`} />
            <KeyValue k="Available" v={`${open.availableArea} acres`} />
            <KeyValue k="Currently leased" v={`${leasedArea(open.id)} acres`} />
            <KeyValue k="Rate" v={`${inr(open.pricePerAcreYear)} / acre / year`} />
            <KeyValue k="Soil" v={open.soilType} />
            <KeyValue k="Water" v={`${open.waterSource} · ${open.waterAvailability}`} />
            <KeyValue k="Status" v={open.status} />
            <Divider />
            <View style={{ gap: 10 }}>
              <Button title="View public listing" variant="secondary" compact onPress={() => { const id = open.id; setOpen(null); router.push(`/land/${id}`); }} />
              {open.status === 'published' ? (
                <Button title="Unpublish listing" variant="ghost" compact onPress={() => { dispatch({ type: 'SET_LAND_STATUS', id: open.id, status: 'draft' }); setOpen(null); toast('Listing moved to drafts', 'info'); }} />
              ) : (
                <Button title="Publish listing" compact onPress={() => { dispatch({ type: 'SET_LAND_STATUS', id: open.id, status: 'published' }); setOpen(null); toast('Listing is live'); }} />
              )}
            </View>
          </View>
        ) : null}
      </BottomSheet>
    </SafeAreaView>
  );
}
