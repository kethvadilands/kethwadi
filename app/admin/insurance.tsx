import React, { useState } from 'react';
import { AdminScreen, AdminRow } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { Button, Tone } from '@/components/ui';
import { inr, shortDate } from '@/constants/format';

const TABS = ['All', 'Active', 'Expired'];

export default function AdminInsurance() {
  const { policies, users } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState('All');

  const filtered = policies.filter(p => tab === 'All' || p.status === tab.toLowerCase());
  const holder = (id: string) => users.find(u => u.id === id)?.name ?? 'Demo user';

  const rows: AdminRow[] = filtered.map(p => ({
    id: p.id,
    title: `${p.planName} · ${p.policyNo}`,
    sub: `${holder(p.holderId)} · ${p.holderRole}`,
    meta: `Cover ${inr(p.coverage)} · premium ${inr(p.premium)} · ${shortDate(p.startDate)} to ${shortDate(p.endDate)}`,
    badge: { label: p.status, tone: (p.status === 'active' ? 'green' : 'grey') as Tone },
    actions: p.status === 'expired' ? (
      <Button title="Send renewal reminder" variant="secondary" compact onPress={() => toast('Renewal SMS queued', 'info')} />
    ) : undefined,
  }));

  return <AdminScreen title="Insurance policies" subtitle={`${filtered.length} policy(s)`} rows={rows} tabs={TABS} tab={tab} onTab={setTab} />;
}
