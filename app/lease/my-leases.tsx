import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FileText, Headphones, RefreshCw, Sprout } from 'lucide-react-native';
import {
  BottomSheet, Button, Chip, EmptyState, FadeIn, KeyValue, Divider, Row, TopBar,
} from '@/components/ui';
import { LeaseCard } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { inr, shortDate } from '@/constants/format';
import { spacing, type } from '@/constants/theme';
import { Lease, LeaseStatus } from '@/types';

const TABS: { key: LeaseStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function MyLeases() {
  const { leases, user, isLandlord, dispatch } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState<LeaseStatus | 'all'>('all');
  const [open, setOpen] = useState<Lease | null>(null);

  const mine = leases.filter(l => (isLandlord ? l.landlordId === user?.id : l.farmerId === user?.id));
  const list = tab === 'all' ? mine : mine.filter(l => l.status === tab);

  const renew = (l: Lease) => {
    setOpen(null);
    toast(`Renewal request sent for ${l.agreementNo}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="My leases" subtitle={`${mine.length} agreement${mine.length === 1 ? '' : 's'}`} />
      <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 12 }}>
        <Row style={{ gap: 8 }}>
          {TABS.map(t => (
            <Chip key={t.key} label={t.label} active={tab === t.key} onPress={() => setTab(t.key)} />
          ))}
        </Row>
      </View>

      <FlatList
        data={list}
        keyExtractor={l => l.id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 4, gap: spacing.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeIn delay={Math.min(index * 60, 200)}>
            <LeaseCard lease={item} onPress={() => setOpen(item)} />
          </FadeIn>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={Sprout}
            title="No leases here yet"
            body="Browse verified plots and send a request. Owners usually reply within a day."
            action="Find land"
            onAction={() => router.push('/(tabs)/lands')}
          />
        }
      />

      <BottomSheet visible={!!open} onClose={() => setOpen(null)} title={open?.landTitle ?? ''}>
        {open ? (
          <View>
            <KeyValue k="Agreement" v={open.agreementNo} />
            <KeyValue k="Counterparty" v={isLandlord ? open.farmerName : open.landlordName} />
            <KeyValue k="Area" v={`${open.area} acres`} />
            <KeyValue k="Duration" v={`${open.durationMonths} months`} />
            <KeyValue k="Starts" v={shortDate(open.startDate)} />
            <KeyValue k="Ends" v={shortDate(open.endDate)} />
            <KeyValue k="Lease value" v={inr(open.amount)} />
            <KeyValue k="Payment" v={open.paymentStatus === 'paid' ? 'Settled' : 'Due'} />
            <Divider />
            <View style={{ gap: 10 }}>
              <Button title="View lease agreement" icon={FileText} variant="secondary" compact onPress={() => { setOpen(null); toast('Agreement opened in the documents vault'); }} />
              {open.status === 'active' ? (
                <Button title="Request renewal" icon={RefreshCw} compact onPress={() => renew(open)} />
              ) : null}
              {open.status === 'pending' && isLandlord ? (
                <Row style={{ gap: 10 }}>
                  <Button title="Decline" variant="danger" compact style={{ flex: 1 }} onPress={() => { dispatch({ type: 'SET_LEASE_STATUS', id: open.id, status: 'rejected' }); setOpen(null); toast('Request declined', 'info'); }} />
                  <Button title="Approve" compact style={{ flex: 1 }} onPress={() => { dispatch({ type: 'SET_LEASE_STATUS', id: open.id, status: 'active' }); setOpen(null); toast('Lease approved and activated'); }} />
                </Row>
              ) : null}
              <Button title="Raise a dispute" icon={Headphones} variant="ghost" compact onPress={() => { setOpen(null); toast('Support ticket created. We will call you within 24 hours.', 'info'); }} />
            </View>
          </View>
        ) : null}
      </BottomSheet>
    </SafeAreaView>
  );
}
