import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Inbox } from 'lucide-react-native';
import { Button, ConfirmDialog, EmptyState, FadeIn, Row, TopBar } from '@/components/ui';
import { LeaseCard } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { spacing } from '@/constants/theme';
import { uid } from '@/constants/format';

export default function LeaseRequests() {
  const { leases, user, dispatch } = useApp();
  const toast = useToast();
  const [decline, setDecline] = useState<string | null>(null);

  const pending = leases.filter(l => l.landlordId === user?.id && l.status === 'pending');

  const approve = (id: string, name: string) => {
    dispatch({ type: 'SET_LEASE_STATUS', id, status: 'active' });
    dispatch({ type: 'NOTIFY', item: { id: uid('n'), title: 'Lease approved', body: `${name} can start farming from the agreed date.`, kind: 'lease', time: 'Just now', read: false } });
    toast('Lease approved. Agreement generated.');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Lease requests" subtitle={`${pending.length} awaiting your decision`} />
      <FlatList
        data={pending}
        keyExtractor={l => l.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeIn delay={Math.min(index * 70, 220)}>
            <LeaseCard
              lease={item}
              footer={
                <Row style={{ gap: 10, marginTop: 14 }}>
                  <Button title="Decline" variant="danger" compact style={{ flex: 1 }} onPress={() => setDecline(item.id)} />
                  <Button title="Approve" compact style={{ flex: 1.4 }} onPress={() => approve(item.id, item.farmerName)} />
                </Row>
              }
            />
          </FadeIn>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={Inbox}
            title="No requests waiting"
            body="When a farmer requests acres on your plots, the request lands here with their KYC status attached."
          />
        }
      />
      <ConfirmDialog
        visible={!!decline}
        title="Decline this request?"
        body="The farmer is notified and the escrow advance is refunded in full within three working days."
        confirmLabel="Decline"
        danger
        onConfirm={() => { if (decline) dispatch({ type: 'SET_LEASE_STATUS', id: decline, status: 'rejected' }); setDecline(null); toast('Request declined', 'info'); }}
        onCancel={() => setDecline(null)}
      />
    </SafeAreaView>
  );
}
