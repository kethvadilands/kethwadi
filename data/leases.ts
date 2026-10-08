import { Lease, Order, AppNotification } from '@/types';
import { LAND_IMAGES } from './images';

export const LEASES: Lease[] = [
  { id: 'ls-1', agreementNo: 'KW/LSE/2025/0117', landId: 'ld-1', landTitle: 'Godavari Canal Farm', landImage: LAND_IMAGES[0], district: 'Warangal', farmerId: 'u-fr-1', farmerName: 'Anil Kumar', landlordId: 'u-ll-1', landlordName: 'Ramesh Reddy', area: 6, durationMonths: 12, amount: 192000, status: 'active', paymentStatus: 'paid', startDate: '2025-06-01', endDate: '2026-05-31', createdAt: '2025-05-18' },
  { id: 'ls-2', agreementNo: 'KW/LSE/2025/0244', landId: 'ld-3', landTitle: 'Krishna Delta Paddy Fields', landImage: LAND_IMAGES[2], district: 'Guntur', farmerId: 'u-fr-2', farmerName: 'Naveen Chowdary', landlordId: 'u-ll-2', landlordName: 'Sudhakar Rao', area: 8, durationMonths: 24, amount: 656000, status: 'pending', paymentStatus: 'pending', startDate: '2026-01-01', endDate: '2027-12-31', createdAt: '2025-12-02' },
  { id: 'ls-3', agreementNo: 'KW/LSE/2024/0089', landId: 'ld-7', landTitle: 'Cauvery Command Farm', landImage: LAND_IMAGES[6], district: 'Mandya', farmerId: 'u-fr-4', farmerName: 'Basavaraj Patil', landlordId: 'u-ll-4', landlordName: 'Shivanna Gowda', area: 5, durationMonths: 12, amount: 190000, status: 'completed', paymentStatus: 'paid', startDate: '2024-06-01', endDate: '2025-05-31', createdAt: '2024-05-10' },
  { id: 'ls-4', agreementNo: 'KW/LSE/2025/0310', landId: 'ld-6', landTitle: 'Vidarbha Cotton Belt Land', landImage: LAND_IMAGES[5], district: 'Nagpur', farmerId: 'u-fr-3', farmerName: 'Sandeep Jadhav', landlordId: 'u-ll-3', landlordName: 'Vitthal Pawar', area: 6, durationMonths: 12, amount: 138000, status: 'active', paymentStatus: 'paid', startDate: '2025-07-01', endDate: '2026-06-30', createdAt: '2025-06-20' },
  { id: 'ls-5', agreementNo: 'KW/LSE/2025/0355', landId: 'ld-2', landTitle: 'Manair Riverside Block', landImage: LAND_IMAGES[1], district: 'Karimnagar', farmerId: 'u-fr-1', farmerName: 'Anil Kumar', landlordId: 'u-ll-1', landlordName: 'Ramesh Reddy', area: 3, durationMonths: 12, amount: 84000, status: 'pending', paymentStatus: 'pending', startDate: '2026-02-01', endDate: '2027-01-31', createdAt: '2026-01-08' },
];

export const ORDERS: Order[] = [
  { id: 'or-1', items: [{ productId: 'p-1', name: 'Neem Coated Urea 46% N', qty: 4, price: 285, image: '' }, { productId: 'p-6', name: 'Hybrid Paddy Seed BPT-5204', qty: 1, price: 1180, image: '' }], total: 2320, status: 'delivered', placedAt: '2026-05-28', address: 'H.No 4-21, Parkal, Warangal, Telangana 506164', paymentMode: 'UPI' },
  { id: 'or-2', items: [{ productId: 'p-10', name: 'Battery Knapsack Sprayer 16L', qty: 1, price: 3250, image: '' }], total: 3250, status: 'shipped', placedAt: '2026-07-19', address: 'H.No 4-21, Parkal, Warangal, Telangana 506164', paymentMode: 'Cash on delivery' },
];

export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n-1', title: 'Lease request received', body: 'Naveen Chowdary requested 8 acres on Krishna Delta Paddy Fields.', kind: 'lease', time: '2 hours ago', read: false },
  { id: 'n-2', title: 'Order out for delivery', body: 'Your Battery Knapsack Sprayer arrives tomorrow before 6 PM.', kind: 'order', time: '5 hours ago', read: false },
  { id: 'n-3', title: 'Claim survey scheduled', body: 'Surveyor visit for CLM-902341 is set for 26 Nov, 11 AM.', kind: 'insurance', time: 'Yesterday', read: true },
  { id: 'n-4', title: 'KYC verified', body: 'Your Aadhaar and land records passed verification.', kind: 'system', time: '2 days ago', read: true },
  { id: 'n-5', title: 'Lease payment credited', body: '\u20B91,92,000 for KW/LSE/2025/0117 has been settled to your account.', kind: 'lease', time: '4 days ago', read: true },
];

export const WEATHER = {
  place: 'Warangal, Telangana',
  temp: 31,
  condition: 'Partly cloudy',
  humidity: 68,
  wind: 12,
  rainChance: 40,
  advisory: 'Light showers likely after 4 PM. Hold off on foliar spraying today.',
  week: [
    { day: 'Mon', t: 31, icon: 'cloud' },
    { day: 'Tue', t: 33, icon: 'sun' },
    { day: 'Wed', t: 29, icon: 'rain' },
    { day: 'Thu', t: 28, icon: 'rain' },
    { day: 'Fri', t: 32, icon: 'sun' },
  ],
};
