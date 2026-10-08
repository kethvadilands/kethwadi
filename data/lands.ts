import { Land } from '@/types';
import { LAND_IMAGES } from './images';

export const STATES = ['Telangana', 'Andhra Pradesh', 'Maharashtra', 'Karnataka'];

export const DISTRICTS: Record<string, string[]> = {
  Telangana: ['Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Medak'],
  'Andhra Pradesh': ['Guntur', 'Kurnool', 'West Godavari', 'Chittoor', 'Anantapur'],
  Maharashtra: ['Nashik', 'Nagpur', 'Ahmednagar', 'Solapur', 'Jalgaon'],
  Karnataka: ['Belagavi', 'Mandya', 'Davanagere', 'Raichur', 'Haveri'],
};

export const SOILS = ['Black Cotton', 'Red Loamy', 'Alluvial', 'Sandy Loam', 'Laterite'] as const;
export const CROPS = ['Paddy', 'Cotton', 'Maize', 'Turmeric', 'Chilli', 'Groundnut', 'Sugarcane', 'Soybean', 'Onion', 'Grapes', 'Ragi', 'Tur Dal'];
export const WATER_SOURCES = ['Borewell', 'Canal', 'Open Well', 'River Lift', 'Rain-fed + Borewell'];

export const LANDS: Land[] = [
  {
    id: 'ld-1', title: 'Godavari Canal Farm', ownerId: 'u-ll-1', ownerName: 'Ramesh Reddy', ownerVerified: true,
    village: 'Parkal', district: 'Warangal', state: 'Telangana',
    totalArea: 18, availableArea: 12, soilType: 'Black Cotton', waterSource: 'Canal', waterAvailability: 'Abundant',
    electricity: true, crops: ['Paddy', 'Cotton', 'Maize'], minLeaseMonths: 12, pricePerAcreYear: 32000,
    image: LAND_IMAGES[0], gallery: [LAND_IMAGES[0], LAND_IMAGES[2], LAND_IMAGES[4]],
    documents: ['Pattadar Passbook', 'Land Survey 1B', 'Encumbrance Certificate'],
    status: 'published', rating: 4.8,
    description: 'Level black cotton plot with year-round canal water and a 24-hour agricultural connection. Tractor access to the field bund and a 40-tonne storage shed on site.',
    createdAt: '2025-01-14',
  },
  {
    id: 'ld-2', title: 'Manair Riverside Block', ownerId: 'u-ll-1', ownerName: 'Ramesh Reddy', ownerVerified: true,
    village: 'Kothapalli', district: 'Karimnagar', state: 'Telangana',
    totalArea: 9, availableArea: 5, soilType: 'Red Loamy', waterSource: 'Borewell', waterAvailability: 'Moderate',
    electricity: true, crops: ['Turmeric', 'Maize', 'Chilli'], minLeaseMonths: 12, pricePerAcreYear: 28000,
    image: LAND_IMAGES[1], gallery: [LAND_IMAGES[1], LAND_IMAGES[5]],
    documents: ['Pattadar Passbook', 'Land Survey 1B'],
    status: 'published', rating: 4.5,
    description: 'Two borewells at 6 inch yield, drip lines already laid across five acres. Suited to turmeric rotation.',
    createdAt: '2025-02-02',
  },
  {
    id: 'ld-3', title: 'Krishna Delta Paddy Fields', ownerId: 'u-ll-2', ownerName: 'Sudhakar Rao', ownerVerified: true,
    village: 'Tenali', district: 'Guntur', state: 'Andhra Pradesh',
    totalArea: 24, availableArea: 16, soilType: 'Alluvial', waterSource: 'Canal', waterAvailability: 'Abundant',
    electricity: true, crops: ['Paddy', 'Chilli', 'Cotton'], minLeaseMonths: 24, pricePerAcreYear: 41000,
    image: LAND_IMAGES[2], gallery: [LAND_IMAGES[2], LAND_IMAGES[3], LAND_IMAGES[6]],
    documents: ['Pattadar Passbook', 'Adangal', 'Encumbrance Certificate'],
    status: 'published', rating: 4.9,
    description: 'Prime delta alluvium in the Guntur chilli belt. Two crops a year with assured Krishna canal release.',
    createdAt: '2024-12-08',
  },
  {
    id: 'ld-4', title: 'Rayalaseema Dryland Estate', ownerId: 'u-ll-2', ownerName: 'Sudhakar Rao', ownerVerified: true,
    village: 'Adoni', district: 'Kurnool', state: 'Andhra Pradesh',
    totalArea: 30, availableArea: 22, soilType: 'Black Cotton', waterSource: 'Rain-fed + Borewell', waterAvailability: 'Limited',
    electricity: false, crops: ['Groundnut', 'Tur Dal', 'Cotton'], minLeaseMonths: 12, pricePerAcreYear: 17500,
    image: LAND_IMAGES[3], gallery: [LAND_IMAGES[3], LAND_IMAGES[7]],
    documents: ['Pattadar Passbook'],
    status: 'published', rating: 4.1,
    description: 'Large contiguous dryland block, best suited to groundnut and pulses. Farm pond holds water through November.',
    createdAt: '2025-03-11',
  },
  {
    id: 'ld-5', title: 'Nashik Vineyard Plot', ownerId: 'u-ll-3', ownerName: 'Vitthal Pawar', ownerVerified: false,
    village: 'Dindori', district: 'Nashik', state: 'Maharashtra',
    totalArea: 12, availableArea: 8, soilType: 'Red Loamy', waterSource: 'Open Well', waterAvailability: 'Moderate',
    electricity: true, crops: ['Grapes', 'Onion', 'Soybean'], minLeaseMonths: 36, pricePerAcreYear: 55000,
    image: LAND_IMAGES[4], gallery: [LAND_IMAGES[4], LAND_IMAGES[0]],
    documents: ['7/12 Extract', 'Land Map'],
    status: 'pending', rating: 4.6,
    description: 'Established trellis on six acres with cold-storage access nine kilometres away. Long lease preferred.',
    createdAt: '2025-04-27',
  },
  {
    id: 'ld-6', title: 'Vidarbha Cotton Belt Land', ownerId: 'u-ll-3', ownerName: 'Vitthal Pawar', ownerVerified: false,
    village: 'Katol', district: 'Nagpur', state: 'Maharashtra',
    totalArea: 20, availableArea: 14, soilType: 'Black Cotton', waterSource: 'Borewell', waterAvailability: 'Moderate',
    electricity: true, crops: ['Cotton', 'Soybean', 'Tur Dal'], minLeaseMonths: 12, pricePerAcreYear: 23000,
    image: LAND_IMAGES[5], gallery: [LAND_IMAGES[5], LAND_IMAGES[1]],
    documents: ['7/12 Extract', 'Encumbrance Certificate'],
    status: 'published', rating: 4.3,
    description: 'Deep black soil holding moisture well into the rabi season. Cotton ginning unit within 12 km.',
    createdAt: '2025-02-19',
  },
  {
    id: 'ld-7', title: 'Cauvery Command Farm', ownerId: 'u-ll-4', ownerName: 'Shivanna Gowda', ownerVerified: true,
    village: 'Malavalli', district: 'Mandya', state: 'Karnataka',
    totalArea: 15, availableArea: 9, soilType: 'Alluvial', waterSource: 'Canal', waterAvailability: 'Abundant',
    electricity: true, crops: ['Sugarcane', 'Paddy', 'Ragi'], minLeaseMonths: 24, pricePerAcreYear: 38000,
    image: LAND_IMAGES[6], gallery: [LAND_IMAGES[6], LAND_IMAGES[2]],
    documents: ['RTC Pahani', 'Mutation Extract', 'Encumbrance Certificate'],
    status: 'published', rating: 4.7,
    description: 'Inside the Cauvery command area with a sugar mill tie-up available for cane supply contracts.',
    createdAt: '2025-01-30',
  },
  {
    id: 'ld-8', title: 'Malaprabha Red Soil Farm', ownerId: 'u-ll-4', ownerName: 'Shivanna Gowda', ownerVerified: true,
    village: 'Saundatti', district: 'Belagavi', state: 'Karnataka',
    totalArea: 11, availableArea: 7, soilType: 'Laterite', waterSource: 'River Lift', waterAvailability: 'Moderate',
    electricity: true, crops: ['Maize', 'Groundnut', 'Ragi'], minLeaseMonths: 12, pricePerAcreYear: 21000,
    image: LAND_IMAGES[7], gallery: [LAND_IMAGES[7], LAND_IMAGES[4]],
    documents: ['RTC Pahani', 'Land Map'],
    status: 'published', rating: 4.2,
    description: 'Lift irrigation sanctioned from the Malaprabha. Gentle slope, fully fenced, labour available in the village.',
    createdAt: '2025-05-05',
  },
];

export const CROP_ADVICE = [
  { crop: 'Paddy', season: 'Kharif', window: 'Jun - Nov', yield: '22-26 qtl/acre', soil: 'Alluvial, Black Cotton', emoji: '\uD83C\uDF3E' },
  { crop: 'Cotton', season: 'Kharif', window: 'Jun - Jan', yield: '9-12 qtl/acre', soil: 'Black Cotton', emoji: '\uD83E\uDDF5' },
  { crop: 'Turmeric', season: 'Kharif', window: 'May - Feb', yield: '28-32 qtl/acre', soil: 'Red Loamy', emoji: '\uD83D\uDFE1' },
  { crop: 'Groundnut', season: 'Rabi', window: 'Nov - Mar', yield: '10-14 qtl/acre', soil: 'Sandy Loam', emoji: '\uD83E\uDD5C' },
  { crop: 'Sugarcane', season: 'Annual', window: 'Dec - Jan', yield: '38-45 t/acre', soil: 'Alluvial', emoji: '\uD83C\uDF6C' },
];
