import { Platform, TextStyle, ViewStyle } from 'react-native';

export const colors = {
  forest: '#0A3B2C',
  forestDeep: '#06251C',
  primary: '#157A4E',
  green: '#157A4E',
  leaf: '#3FBF6F',
  leafSoft: '#E6F4EC',
  gold: '#C99A2E',
  goldSoft: '#FBF1DC',
  bone: '#F5F7F2',
  surface: '#FFFFFF',
  ink: '#0E1F18',
  body: '#3A4A43',
  muted: '#6C7F76',
  line: '#E2EAE4',
  danger: '#C0392B',
  dangerSoft: '#FBEAE7',
  warn: '#B7791F',
  warnSoft: '#FDF3E0',
  info: '#1D6FA5',
  infoSoft: '#E7F1F8',
  sky: '#4FA3D9',
  overlay: 'rgba(6,37,28,0.55)',
};

export const gradients = {
  hero: ['#0A3B2C', '#157A4E'] as const,
  leaf: ['#157A4E', '#3FBF6F'] as const,
  gold: ['#C99A2E', '#E8C168'] as const,
  fade: ['transparent', 'rgba(6,37,28,0.85)'] as const,
  sky: ['#2E7FB8', '#6FC2E8'] as const,
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 };

export const shadow = {
  card: Platform.select<ViewStyle>({
    android: { elevation: 3 },
    default: {
      shadowColor: '#0A3B2C',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
  })!,
  raised: Platform.select<ViewStyle>({
    android: { elevation: 8 },
    default: {
      shadowColor: '#0A3B2C',
      shadowOpacity: 0.16,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
    },
  })!,
};

/** Utility label style: uppercase micro-caps carry the brand voice. */
export const type = {
  display: { fontSize: 30, fontWeight: '800', color: colors.ink, letterSpacing: -0.6 } as TextStyle,
  h1: { fontSize: 23, fontWeight: '800', color: colors.ink, letterSpacing: -0.4 } as TextStyle,
  h2: { fontSize: 18, fontWeight: '700', color: colors.ink, letterSpacing: -0.2 } as TextStyle,
  h3: { fontSize: 15, fontWeight: '700', color: colors.ink } as TextStyle,
  body: { fontSize: 14, color: colors.body, lineHeight: 21 } as TextStyle,
  small: { fontSize: 12.5, color: colors.muted, lineHeight: 18 } as TextStyle,
  micro: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: colors.muted,
  } as TextStyle,
  price: { fontSize: 19, fontWeight: '800', color: colors.forest, letterSpacing: -0.3 } as TextStyle,
};
