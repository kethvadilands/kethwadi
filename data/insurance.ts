import { InsurancePlan, Policy, Claim } from '@/types';

export const PLANS: InsurancePlan[] = [
  {
    id: 'pl-1', name: 'Bhoomi Suraksha', forRole: 'landlord', coverage: 500000, premium: 2400, tenureMonths: 12,
    tagline: 'Protects the land asset and lease income',
    features: ['Lease default cover up to 3 months rent', 'Boundary and structure damage', 'Legal dispute assistance', 'Free document vault'],
  },
  {
    id: 'pl-2', name: 'Bhoomi Suraksha Plus', forRole: 'landlord', coverage: 1200000, premium: 5200, tenureMonths: 12,
    tagline: 'Higher cover for multi-plot owners', popular: true,
    features: ['Everything in Bhoomi Suraksha', 'Cover across up to 5 listed plots', 'Borewell and pump-set damage', 'Priority claim settlement in 7 days'],
  },
  {
    id: 'pl-3', name: 'Kisan Raksha', forRole: 'farmer', coverage: 300000, premium: 1450, tenureMonths: 12,
    tagline: 'Accident and crop loss cover for the cultivator',
    features: ['Personal accident cover \u20B92 lakh', 'Crop loss from flood, drought or hail', 'Hospital cash \u20B91,000 per day', 'Cover for two family workers'],
  },
  {
    id: 'pl-4', name: 'Kisan Raksha Pro', forRole: 'farmer', coverage: 750000, premium: 3100, tenureMonths: 12,
    tagline: 'Full season protection with input cover', popular: true,
    features: ['Everything in Kisan Raksha', 'Input cost reimbursement up to \u20B91.5 lakh', 'Farm machinery accident cover', 'Tele-vet and agronomy helpline'],
  },
];

export const POLICIES: Policy[] = [
  { id: 'po-1', policyNo: 'KW-LL-448210', planId: 'pl-2', planName: 'Bhoomi Suraksha Plus', holderId: 'u-ll-1', holderRole: 'landlord', coverage: 1200000, premium: 5200, startDate: '2025-04-01', endDate: '2026-03-31', status: 'active' },
  { id: 'po-2', policyNo: 'KW-FR-771903', planId: 'pl-4', planName: 'Kisan Raksha Pro', holderId: 'u-fr-1', holderRole: 'farmer', coverage: 750000, premium: 3100, startDate: '2025-06-15', endDate: '2026-06-14', status: 'active' },
  { id: 'po-3', policyNo: 'KW-FR-660127', planId: 'pl-3', planName: 'Kisan Raksha', holderId: 'u-fr-3', holderRole: 'farmer', coverage: 300000, premium: 1450, startDate: '2024-07-01', endDate: '2025-06-30', status: 'expired' },
];

export const CLAIMS: Claim[] = [
  {
    id: 'cl-1', claimNo: 'CLM-902341', policyId: 'po-2', policyNo: 'KW-FR-771903', holderId: 'u-fr-1',
    type: 'Crop damage - unseasonal rain', amount: 68000, incidentDate: '2025-11-18',
    description: 'Standing paddy on 4 acres flattened by two days of unseasonal rain before harvest.',
    status: 'under_review', createdAt: '2025-11-20',
    timeline: [
      { label: 'Claim submitted', date: '2025-11-20', done: true },
      { label: 'Documents verified', date: '2025-11-22', done: true },
      { label: 'Field survey scheduled', date: '2025-11-26', done: true },
      { label: 'Assessment under review', date: '2025-11-28', done: false },
      { label: 'Settlement credited', date: 'Pending', done: false },
    ],
  },
  {
    id: 'cl-2', claimNo: 'CLM-881006', policyId: 'po-1', policyNo: 'KW-LL-448210', holderId: 'u-ll-1',
    type: 'Pump-set damage', amount: 22000, incidentDate: '2025-08-04',
    description: 'Submersible pump burnt out after a voltage surge on the agricultural feeder.',
    status: 'settled', createdAt: '2025-08-06',
    timeline: [
      { label: 'Claim submitted', date: '2025-08-06', done: true },
      { label: 'Documents verified', date: '2025-08-07', done: true },
      { label: 'Field survey completed', date: '2025-08-11', done: true },
      { label: 'Claim approved', date: '2025-08-14', done: true },
      { label: 'Settlement credited', date: '2025-08-16', done: true },
    ],
  },
];

export const CLAIM_TYPES = [
  'Crop damage - unseasonal rain',
  'Crop damage - drought',
  'Crop damage - pest attack',
  'Farm accident - personal injury',
  'Farm machinery damage',
  'Pump-set or borewell damage',
  'Lease payment default',
];
