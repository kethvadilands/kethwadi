import React, { useState } from 'react';
import { router } from 'expo-router';
import { AdminScreen, AdminRow, CLAIM_TONE } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { Button, Row } from '@/components/ui';
import { inr, shortDate } from '@/constants/format';

const TABS = ['All', 'Open', 'Settled'];

export default function AdminClaims() {
  const { claims, dispatch } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState('All');

  const filtered = claims.filter(c => {
    if (tab === 'Open') return c.status !== 'settled' && c.status !== 'rejected';
    if (tab === 'Settled') return c.status === 'settled';
    return true;
  });

  const rows: AdminRow[] = filtered.map(c => ({
    id: c.id,
    title: `${c.claimNo} · ${c.type}`,
    sub: c.description,
    meta: `Policy ${c.policyNo} · ${inr(c.amount)} · incident ${shortDate(c.incidentDate)} · filed ${shortDate(c.createdAt)}`,
    badge: { label: c.status.replace('_', ' '), tone: CLAIM_TONE[c.status] },
    actions: c.status !== 'settled' && c.status !== 'rejected' ? (
      <Row style={{ gap: 10 }}>
        <Button title="Open file" variant="ghost" compact style={{ flex: 1 }} onPress={() => router.push(`/policy/claim/${c.id}`)} />
        <Button title="Approve and settle" compact style={{ flex: 1.6 }}
          onPress={() => { dispatch({ type: 'SET_CLAIM_STATUS', id: c.id, status: 'settled' }); toast(`${c.claimNo} settled`); }} />
      </Row>
    ) : undefined,
  }));

  return <AdminScreen title="Claims" subtitle={`${filtered.length} claim(s)`} rows={rows} tabs={TABS} tab={tab} onTab={setTab} />;
}
