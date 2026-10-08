import React, { useState } from 'react';
import { AdminScreen, AdminRow } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { Button, Row, Tone } from '@/components/ui';
import { inr, shortDate } from '@/constants/format';

const TONE: Record<string, Tone> = { active: 'green', pending: 'gold', completed: 'grey', rejected: 'red' };
const TABS = ['All', 'Pending', 'Active', 'Completed'];

export default function AdminLeases() {
  const { leases, dispatch } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState('All');

  const filtered = leases.filter(l => tab === 'All' || l.status === tab.toLowerCase());

  const rows: AdminRow[] = filtered.map(l => ({
    id: l.id,
    title: l.landTitle,
    sub: `${l.farmerName} leasing from ${l.landlordName} · ${l.district}`,
    meta: `${l.agreementNo} · ${l.area} ac · ${l.durationMonths} mo · ${inr(l.amount)} · ${shortDate(l.startDate)} to ${shortDate(l.endDate)} · payment ${l.paymentStatus}`,
    badge: { label: l.status, tone: TONE[l.status] ?? 'grey' },
    actions: l.status === 'pending' ? (
      <Row style={{ gap: 10 }}>
        <Button title="Reject" variant="danger" compact style={{ flex: 1 }}
          onPress={() => { dispatch({ type: 'SET_LEASE_STATUS', id: l.id, status: 'rejected' }); toast('Lease rejected', 'info'); }} />
        <Button title="Approve" compact style={{ flex: 1.4 }}
          onPress={() => { dispatch({ type: 'SET_LEASE_STATUS', id: l.id, status: 'active' }); toast('Lease activated'); }} />
      </Row>
    ) : undefined,
  }));

  return <AdminScreen title="Lease requests" subtitle={`${filtered.length} agreement(s)`} rows={rows} tabs={TABS} tab={tab} onTab={setTab} />;
}
