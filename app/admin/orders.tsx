import React, { useState } from 'react';
import { AdminScreen, AdminRow } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { Button, Tone } from '@/components/ui';
import { inr, shortDate } from '@/constants/format';

const TONE: Record<string, Tone> = { placed: 'gold', packed: 'blue', shipped: 'blue', delivered: 'green' };
const TABS = ['All', 'Placed', 'Shipped', 'Delivered'];

export default function AdminOrders() {
  const { orders } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState('All');

  const filtered = orders.filter(o => tab === 'All' || o.status === tab.toLowerCase());

  const rows: AdminRow[] = filtered.map(o => ({
    id: o.id,
    title: `#${o.id.toUpperCase()}`,
    sub: o.items.map(i => `${i.name} × ${i.qty}`).join(', '),
    meta: `${shortDate(o.placedAt)} · ${o.paymentMode} · ${inr(o.total)} · ${o.address}`,
    badge: { label: o.status, tone: TONE[o.status] ?? 'grey' },
    actions: o.status !== 'delivered' ? (
      <Button title="Move to next stage" variant="secondary" compact onPress={() => toast('Fulfilment stage updated', 'info')} />
    ) : undefined,
  }));

  return <AdminScreen title="Marketplace orders" subtitle={`${filtered.length} order(s)`} rows={rows} tabs={TABS} tab={tab} onTab={setTab} />;
}
