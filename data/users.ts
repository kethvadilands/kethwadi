import { User } from '@/types';

export const USERS: User[] = [
  { id: 'u-ll-1', name: 'Ramesh Reddy', phone: '9848012345', email: 'ramesh.reddy@kethwadi.in', role: 'landlord', district: 'Warangal', state: 'Telangana', kycStatus: 'verified', verified: true, joinedOn: '2024-06-11', avatarSeed: 'RR' },
  { id: 'u-ll-2', name: 'Sudhakar Rao', phone: '9440098711', email: 'sudhakar.rao@kethwadi.in', role: 'landlord', district: 'Guntur', state: 'Andhra Pradesh', kycStatus: 'verified', verified: true, joinedOn: '2024-08-02', avatarSeed: 'SR' },
  { id: 'u-ll-3', name: 'Vitthal Pawar', phone: '9822011234', email: 'vitthal.pawar@kethwadi.in', role: 'landlord', district: 'Nashik', state: 'Maharashtra', kycStatus: 'pending', verified: false, joinedOn: '2025-01-19', avatarSeed: 'VP' },
  { id: 'u-ll-4', name: 'Shivanna Gowda', phone: '9880076543', email: 'shivanna.gowda@kethwadi.in', role: 'landlord', district: 'Mandya', state: 'Karnataka', kycStatus: 'verified', verified: true, joinedOn: '2024-11-27', avatarSeed: 'SG' },
  { id: 'u-fr-1', name: 'Anil Kumar', phone: '9701122334', email: 'anil.kumar@kethwadi.in', role: 'farmer', district: 'Karimnagar', state: 'Telangana', kycStatus: 'verified', verified: true, joinedOn: '2025-02-14', avatarSeed: 'AK' },
  { id: 'u-fr-2', name: 'Naveen Chowdary', phone: '9963345566', email: 'naveen.c@kethwadi.in', role: 'farmer', district: 'Kurnool', state: 'Andhra Pradesh', kycStatus: 'pending', verified: false, joinedOn: '2025-03-30', avatarSeed: 'NC' },
  { id: 'u-fr-3', name: 'Sandeep Jadhav', phone: '9765544332', email: 'sandeep.j@kethwadi.in', role: 'farmer', district: 'Nagpur', state: 'Maharashtra', kycStatus: 'verified', verified: true, joinedOn: '2025-04-08', avatarSeed: 'SJ' },
  { id: 'u-fr-4', name: 'Basavaraj Patil', phone: '9845567788', email: 'basavaraj.p@kethwadi.in', role: 'farmer', district: 'Belagavi', state: 'Karnataka', kycStatus: 'not_started', verified: false, joinedOn: '2025-05-21', avatarSeed: 'BP' },
  { id: 'u-ad-1', name: 'KETHWADI Admin', phone: '9000000000', email: 'admin@kethwadi.in', role: 'admin', district: 'Hyderabad', state: 'Telangana', kycStatus: 'verified', verified: true, joinedOn: '2024-01-01', avatarSeed: 'KA' },
];

export const DEMO_ACCOUNTS = {
  landlord: USERS[0],
  farmer: USERS[4],
  admin: USERS[8],
};
