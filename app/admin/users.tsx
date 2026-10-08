import React, { useState } from 'react';
import { AdminScreen, AdminRow } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { Button, Row, Tone } from '@/components/ui';
import { shortDate } from '@/constants/format';

const TONE: Record<string, Tone> = { verified: 'green', pending: 'gold', not_started: 'grey', rejected: 'red' };
const TABS = ['All', 'Landlords', 'Farmers', 'Pending KYC'];

export default function AdminUsers() {
  const { users } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState('All');

  const filtered = users.filter(u => {
    if (tab === 'Landlords') return u.role === 'landlord';
    if (tab === 'Farmers') return u.role === 'farmer';
    if (tab === 'Pending KYC') return u.kycStatus !== 'verified';
    return true;
  });

  const rows: AdminRow[] = filtered.map(u => ({
    id: u.id,
    title: u.name,
    sub: `${u.role} · ${u.district}, ${u.state} · ${u.phone}`,
    meta: `Joined ${shortDate(u.joinedOn)} · ${u.email}`,
    badge: { label: u.kycStatus.replace('_', ' '), tone: TONE[u.kycStatus] ?? 'grey' },
    actions: u.kycStatus !== 'verified' ? (
      <Row style={{ gap: 10 }}>
        <Button title="Reject" variant="danger" compact style={{ flex: 1 }} onPress={() => toast(`KYC rejected for ${u.name}`, 'info')} />
        <Button title="Approve KYC" compact style={{ flex: 1.4 }} onPress={() => toast(`${u.name} verified`)} />
      </Row>
    ) : undefined,
  }));

  return <AdminScreen title="Users" subtitle={`${filtered.length} of ${users.length} accounts`} rows={rows} tabs={TABS} tab={tab} onTab={setTab} />;
}
