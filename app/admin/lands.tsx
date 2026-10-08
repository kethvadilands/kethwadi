import React, { useState } from 'react';
import { router } from 'expo-router';
import { AdminScreen, AdminRow } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { Button, Row, Tone } from '@/components/ui';
import { inr } from '@/constants/format';

const TONE: Record<string, Tone> = { published: 'green', pending: 'gold', draft: 'grey', rejected: 'red' };
const TABS = ['All', 'Pending', 'Published', 'Draft'];

export default function AdminLands() {
  const { lands, dispatch } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState('Pending');

  const filtered = lands.filter(l => tab === 'All' || l.status === tab.toLowerCase());

  const rows: AdminRow[] = filtered.map(l => ({
    id: l.id,
    title: l.title,
    sub: `${l.ownerName} · ${l.village}, ${l.district}, ${l.state}`,
    meta: `${l.totalArea} ac total · ${l.availableArea} ac free · ${inr(l.pricePerAcreYear)}/ac/yr · ${l.documents.length} document(s)`,
    badge: { label: l.status, tone: TONE[l.status] ?? 'grey' },
    actions: (
      <Row style={{ gap: 10 }}>
        <Button title="Open" variant="ghost" compact style={{ flex: 1 }} onPress={() => router.push(`/land/${l.id}`)} />
        {l.status === 'pending' ? (
          <Button title="Verify and publish" compact style={{ flex: 1.6 }}
            onPress={() => { dispatch({ type: 'SET_LAND_STATUS', id: l.id, status: 'published' }); toast(`${l.title} is live`); }} />
        ) : (
          <Button title="Unpublish" variant="danger" compact style={{ flex: 1 }}
            onPress={() => { dispatch({ type: 'SET_LAND_STATUS', id: l.id, status: 'draft' }); toast('Listing unpublished', 'info'); }} />
        )}
      </Row>
    ),
  }));

  return <AdminScreen title="Land listings" subtitle={`${filtered.length} listing(s)`} rows={rows} tabs={TABS} tab={tab} onTab={setTab} />;
}
