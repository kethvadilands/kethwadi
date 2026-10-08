import React from 'react';
import {
  ActivityIndicator, Image, ImageStyle, Pressable, ScrollView, StyleSheet, Text, TextInput,
  TextInputProps, TextStyle, View, ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, ChevronLeft, LucideIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors, gradients, radius, shadow, spacing, type } from '@/constants/theme';

/* ---------- text ---------- */
export const Label = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[type.micro, style]}>{children}</Text>
);

export const SectionHeader = ({
  title, action, onAction,
}: { title: string; action?: string; onAction?: () => void }) => (
  <View style={styles.sectionHeader}>
    <Text style={type.h2}>{title}</Text>
    {action ? (
      <Pressable onPress={onAction} hitSlop={8}>
        <Text style={styles.action}>{action}</Text>
      </Pressable>
    ) : null}
  </View>
);

/* ---------- surfaces ---------- */
export const Card = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.card, style]}>{children}</View>
);

/** Signature motif: a field-row rule with a gold seed marker. */
export const FieldRule = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.ruleWrap, style]}>
    <View style={styles.rule} />
    <View style={styles.seed} />
    <View style={styles.rule} />
  </View>
);

/* ---------- buttons ---------- */
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
export function Button({
  title, onPress, variant = 'primary', icon: Icon, loading, disabled, full = true, style, compact,
}: {
  title: string; onPress?: () => void; variant?: BtnVariant; icon?: LucideIcon;
  loading?: boolean; disabled?: boolean; full?: boolean; style?: ViewStyle; compact?: boolean;
}) {
  const off = disabled || loading;
  const fg =
    variant === 'secondary' ? colors.green :
    variant === 'ghost' ? colors.body :
    variant === 'danger' ? colors.danger : '#FFF';
  const body = (
    <View style={[styles.btnInner, compact && { paddingVertical: 10 }]}>
      {loading ? <ActivityIndicator color={fg} size="small" /> : Icon ? <Icon size={17} color={fg} /> : null}
      <Text style={[styles.btnText, { color: fg }, compact && { fontSize: 13.5 }]}>{title}</Text>
    </View>
  );

  return (
    <Pressable
      onPress={off ? undefined : onPress}
      style={({ pressed }) => [
        styles.btn,
        full && { alignSelf: 'stretch' },
        variant === 'secondary' && styles.btnSecondary,
        variant === 'ghost' && styles.btnGhost,
        variant === 'danger' && styles.btnDanger,
        off && { opacity: 0.5 },
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      {variant === 'primary' || variant === 'gold' ? (
        <LinearGradient
          colors={variant === 'gold' ? gradients.gold : gradients.leaf}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {body}
    </Pressable>
  );
}

export function IconButton({ icon: Icon, onPress, tone = 'light', badge }: {
  icon: LucideIcon; onPress?: () => void; tone?: 'light' | 'dark'; badge?: number;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.iconBtn,
      tone === 'dark' ? { backgroundColor: 'rgba(255,255,255,0.16)' } : null,
      pressed && { opacity: 0.7 },
    ]}>
      <Icon size={19} color={tone === 'dark' ? '#FFF' : colors.ink} />
      {badge ? (
        <View style={styles.badgeDot}>
          <Text style={styles.badgeDotText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/* ---------- chips & badges ---------- */
export function Chip({ label, active, onPress, emoji }: {
  label: string; active?: boolean; onPress?: () => void; emoji?: string;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      {emoji ? <Text style={{ fontSize: 13 }}>{emoji}</Text> : null}
      <Text style={[styles.chipText, active && { color: '#FFF' }]}>{label}</Text>
    </Pressable>
  );
}

export type Tone = 'green' | 'gold' | 'red' | 'blue' | 'grey';
const TONES: Record<Tone, { bg: string; fg: string }> = {
  green: { bg: colors.leafSoft, fg: colors.green },
  gold: { bg: colors.goldSoft, fg: colors.warn },
  red: { bg: colors.dangerSoft, fg: colors.danger },
  blue: { bg: colors.infoSoft, fg: colors.info },
  grey: { bg: '#EEF2EF', fg: colors.muted },
};

export const Badge = ({ label, tone = 'green', icon: Icon }: { label: string; tone?: Tone; icon?: LucideIcon }) => {
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      {Icon ? <Icon size={11} color={t.fg} /> : null}
      <Text style={[styles.badgeText, { color: t.fg }]}>{label}</Text>
    </View>
  );
};

/* ---------- inputs ---------- */
export function Field({
  label, error, hint, children,
}: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Label style={{ marginBottom: 7 }}>{label}</Label>
      {children}
      {error ? <Text style={styles.err}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export const Input = React.forwardRef<TextInput, TextInputProps & { invalid?: boolean }>(
  ({ invalid, style, ...p }, ref) => (
    <TextInput
      ref={ref}
      placeholderTextColor={colors.muted}
      style={[styles.input, invalid && { borderColor: colors.danger, backgroundColor: colors.dangerSoft }, style]}
      {...p}
    />
  ),
);
Input.displayName = 'Input';

export function SearchBar({ value, onChangeText, placeholder, onPress, right }: {
  value?: string; onChangeText?: (v: string) => void; placeholder?: string; onPress?: () => void; right?: React.ReactNode;
}) {
  const inner = (
    <View style={styles.search}>
      <Search size={18} color={colors.muted} />
      {onPress ? (
        <Text style={[styles.searchText, { color: colors.muted }]}>{placeholder}</Text>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          style={styles.searchText}
        />
      )}
      {right}
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{inner}</Pressable> : inner;
}

/* ---------- imagery ---------- */
export function Photo({ uri, style, rounded = radius.lg }: { uri?: string; style?: ImageStyle; rounded?: number }) {
  const [failed, setFailed] = React.useState(false);
  if (!uri || failed) {
    return (
      <LinearGradient
        colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={[{ borderRadius: rounded, alignItems: 'center', justifyContent: 'center' }, style as ViewStyle]}
      >
        <Text style={{ fontSize: 26 }}>{'\uD83C\uDF3E'}</Text>
      </LinearGradient>
    );
  }
  return (
    <Image source={{ uri }} onError={() => setFailed(true)} style={[{ borderRadius: rounded, backgroundColor: '#DCE6DE' }, style]} />
  );
}

/* ---------- states ---------- */
export function Skeleton({ h = 16, w = '100%', r = 8, style }: { h?: number; w?: any; r?: number; style?: ViewStyle }) {
  return <View style={[{ height: h, width: w, borderRadius: r, backgroundColor: '#E6EDE8' }, style]} />;
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <View style={{ gap: spacing.md }}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={[styles.card, { flexDirection: 'row', gap: 12 }]}>
          <Skeleton h={72} w={92} r={12} />
          <View style={{ flex: 1, gap: 9, paddingVertical: 4 }}>
            <Skeleton h={13} w="70%" />
            <Skeleton h={11} w="45%" />
            <Skeleton h={11} w="60%" />
          </View>
        </View>
      ))}
    </View>
  );
}

export function EmptyState({ icon: Icon, title, body, action, onAction }: {
  icon: LucideIcon; title: string; body: string; action?: string; onAction?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}><Icon size={26} color={colors.green} /></View>
      <Text style={[type.h2, { textAlign: 'center' }]}>{title}</Text>
      <Text style={[type.small, { textAlign: 'center', marginTop: 6, marginBottom: 18 }]}>{body}</Text>
      {action ? <Button title={action} onPress={onAction} full={false} compact style={{ paddingHorizontal: 22 }} /> : null}
    </View>
  );
}

/* ---------- header ---------- */
export function TopBar({ title, subtitle, right, onBack }: {
  title: string; subtitle?: string; right?: React.ReactNode; onBack?: () => void;
}) {
  return (
    <View style={styles.topbar}>
      <Pressable onPress={onBack ?? (() => router.back())} style={styles.backBtn} hitSlop={10}>
        <ChevronLeft size={22} color={colors.ink} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={type.h2} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={type.small} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export const Divider = () => <View style={styles.divider} />;

export const Row = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
);

export function KeyValue({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <Row style={{ justifyContent: 'space-between', paddingVertical: 9 }}>
      <Text style={type.small}>{k}</Text>
      <Text style={{ fontSize: 13.5, fontWeight: '700', color: tone ?? colors.ink }}>{v}</Text>
    </Row>
  );
}

export const Scroll = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <ScrollView
    style={{ flex: 1 }}
    contentContainerStyle={[{ padding: spacing.lg, paddingBottom: 120 }, style]}
    showsVerticalScrollIndicator={false}
  >
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, ...shadow.card },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  action: { color: colors.green, fontWeight: '700', fontSize: 13 },
  ruleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: spacing.lg },
  rule: { flex: 1, height: 1, backgroundColor: colors.line },
  seed: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gold, transform: [{ rotate: '45deg' }] },
  btn: { borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.green, alignItems: 'center' },
  btnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 18 },
  btnText: { fontSize: 14.5, fontWeight: '700', letterSpacing: 0.1 },
  btnSecondary: { backgroundColor: colors.leafSoft, borderWidth: 1, borderColor: '#CFE6DA' },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line },
  btnDanger: { backgroundColor: colors.dangerSoft },
  iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#EFF4F0', alignItems: 'center', justifyContent: 'center' },
  badgeDot: { position: 'absolute', top: -3, right: -3, minWidth: 17, height: 17, paddingHorizontal: 4, borderRadius: 9, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  badgeDotText: { color: '#3B2A05', fontSize: 9.5, fontWeight: '800' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  chipActive: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { fontSize: 12.5, fontWeight: '600', color: colors.body },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4.5, borderRadius: radius.pill, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10.5, fontWeight: '800', letterSpacing: 0.4, textTransform: 'uppercase' },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, color: colors.ink },
  err: { color: colors.danger, fontSize: 11.5, marginTop: 5, fontWeight: '600' },
  hint: { color: colors.muted, fontSize: 11.5, marginTop: 5 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: colors.line },
  searchText: { flex: 1, fontSize: 14, color: colors.ink, padding: 0 },
  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 30 },
  emptyIcon: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: spacing.lg, paddingVertical: 12, backgroundColor: colors.bone, borderBottomWidth: 1, borderBottomColor: colors.line },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: spacing.md },
});
