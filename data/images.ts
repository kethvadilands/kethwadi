/** Remote demo imagery. Every consumer falls back to a gradient block if offline. */
const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const LAND_IMAGES = [
  U('1500382017468-9049fed747ef'),
  U('1560493676-04071c5f467b'),
  U('1464226184884-fa280b87c399'),
  U('1523348837708-15d4a09cfac2'),
  U('1592982537447-7440770cbfc9'),
  U('1625246333195-78d9c38ad449'),
  U('1574943320219-553eb213f72d'),
  U('1508921340878-ba53e1f016ec'),
];

export const PRODUCT_IMAGES: Record<string, string> = {
  urea: U('1628352081506-83c43123ed6d', 500),
  dap: U('1615671524827-c1fe3973b648', 500),
  seed: U('1574323347407-f5e1ad6d020b', 500),
  pest: U('1416879595882-3373a0480b5b', 500),
  organic: U('1592982537447-7440770cbfc9', 500),
  equip: U('1605000797499-95a51c5269ae', 500),
  spray: U('1530836369250-ef72a3f5cda8', 500),
  drip: U('1621460248083-6271cc4437a8', 500),
};
