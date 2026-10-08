export type Role = 'landlord' | 'farmer' | 'admin';
export type KycStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  district: string;
  state: string;
  kycStatus: KycStatus;
  verified: boolean;
  joinedOn: string;
  avatarSeed: string;
}

export type SoilType = 'Black Cotton' | 'Red Loamy' | 'Alluvial' | 'Sandy Loam' | 'Laterite';
export type WaterLevel = 'Abundant' | 'Moderate' | 'Limited';
export type LandStatus = 'published' | 'pending' | 'draft' | 'rejected';

export interface Land {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  ownerVerified: boolean;
  village: string;
  district: string;
  state: string;
  totalArea: number;
  availableArea: number;
  soilType: SoilType;
  waterSource: string;
  waterAvailability: WaterLevel;
  electricity: boolean;
  crops: string[];
  minLeaseMonths: number;
  pricePerAcreYear: number;
  image: string;
  gallery: string[];
  documents: string[];
  status: LandStatus;
  rating: number;
  description: string;
  createdAt: string;
}

export type LeaseStatus = 'pending' | 'active' | 'completed' | 'rejected';

export interface Lease {
  id: string;
  agreementNo: string;
  landId: string;
  landTitle: string;
  landImage: string;
  district: string;
  farmerId: string;
  farmerName: string;
  landlordId: string;
  landlordName: string;
  area: number;
  durationMonths: number;
  amount: number;
  status: LeaseStatus;
  paymentStatus: 'paid' | 'pending';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export type ProductCategory =
  | 'Fertilizers'
  | 'Pesticides'
  | 'Seeds'
  | 'Organic'
  | 'Equipment'
  | 'Crop Protection';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  mrp: number;
  unit: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  usage: string;
  tags: string[];
}

export interface CartItem { productId: string; qty: number }

export type OrderStatus = 'placed' | 'packed' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  items: { productId: string; name: string; qty: number; price: number; image: string }[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  address: string;
  paymentMode: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  forRole: Role;
  coverage: number;
  premium: number;
  tenureMonths: number;
  tagline: string;
  features: string[];
  popular?: boolean;
}

export interface Policy {
  id: string;
  policyNo: string;
  planId: string;
  planName: string;
  holderId: string;
  holderRole: Role;
  coverage: number;
  premium: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired';
}

export type ClaimStatus = 'submitted' | 'under_review' | 'approved' | 'settled' | 'rejected';

export interface ClaimEvent { label: string; date: string; done: boolean }

export interface Claim {
  id: string;
  claimNo: string;
  policyId: string;
  policyNo: string;
  holderId: string;
  type: string;
  amount: number;
  incidentDate: string;
  description: string;
  status: ClaimStatus;
  createdAt: string;
  timeline: ClaimEvent[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  kind: 'lease' | 'order' | 'insurance' | 'system';
  time: string;
  read: boolean;
}
