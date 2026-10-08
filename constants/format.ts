export const inr = (n: number) =>
  '\u20B9' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const inrShort = (n: number) => {
  if (n >= 10000000) return '\u20B9' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '\u20B9' + (n / 100000).toFixed(2) + ' L';
  if (n >= 1000) return '\u20B9' + (n / 1000).toFixed(1) + 'K';
  return '\u20B9' + n;
};

export const acres = (n: number) => `${n} acre${n === 1 ? '' : 's'}`;

export const shortDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const addMonths = (iso: string, months: number) => {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
};

export const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 999)}`;

export const seq = (prefix: string) =>
  `${prefix}${Math.floor(100000 + Math.random() * 899999)}`;
