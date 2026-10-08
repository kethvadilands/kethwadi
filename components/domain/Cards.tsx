import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BadgeCheck, Droplets, MapPin, Star, Zap, Package, ShieldCheck, CalendarDays,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { colors, gradients, radius, shadow, spacing, type } from '@/constants/theme';
import { Badge, Photo, Row, Tone } from '@/components/ui';
import { inr, inrShort, shortDate } from '@/constants/format';
import { Claim, Land, Lease, Order, Policy, Product } from '@/types';

/* ---------------- Land ---------------- */
export function LandCard({ land, onPress, wide }: { land: Land; onPress?: () => void; wide?: boolean }) {
  return (
    <Pressable
      onPress={onPress ?? (() => router.push(`/land/${land.id}`))}
      style={({ pressed }) => [styles.landCard, wide && { width: 260 }, pressed && { opacity: 0.9 }]}
    >
      <View>
        <Photo uri={land.image} style={{ width: '100%', height: 138, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
        <LinearGradient colors={gradients.fade} style={styles.imgFade} />
        <View style={styles.acreChip}>
          <Text style={styles.acreChipText}>{land.availableArea} ac free</Text>
        </View>
        <Row style={styles.landOverlay}>
          <MapPin size={12} color="#FFF" />
          <Text style={styles.overlayText} numberOfLines={1}>{land.village}, {land.district}</Text>
        </Row>
      </View>
      <View style={{ padding: spacing.md }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={[type.h3, { flex: 1 }]} numberOfLines={1}>{land.title}</Text>
          <Row style={{ gap: 3 }}>
            <Star size={12} color={colors.gold} fill={colors.gold} />
            <Text style={styles.rating}>{land.rating}</Text>
          </Row>
        </Row>
        <Row style={{ gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          <Badge label={land.soilType} tone="grey" />
          <Badge label={land.waterAvailability} tone="blue" icon={Droplets} />
          {land.electricity ? <Badge label="Power" tone="gold" icon={Zap} /> : null}
        </Row>
        <Row style={{ justifyContent: 'space-between', marginTop: 12 }}>
          <View>
            <Text style={type.price}>{inr(land.pricePerAcreYear)}</Text>
            <Text style={[type.small, { fontSize: 11 }]}>per acre / year</Text>
          </View>
          {land.ownerVerified ? (
            <Row style={{ gap: 4 }}>
              <BadgeCheck size={14} color={colors.green} />
              <Text style={styles.verified}>Verified owner</Text>
            </Row>
          ) : (
            <Badge label="KYC pending" tone="gold" />
          )}
        </Row>
      </View>
    </Pressable>
  );
}

export function LandRow({ land, right, onPress }: { land: Land; right?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}>
      <Photo uri={land.image} style={{ width: 78, height: 78 }} rounded={radius.md} />
      <View style={{ flex: 1 }}>
        <Text style={type.h3} numberOfLines={1}>{land.title}</Text>
        <Text style={[type.small, { marginTop: 2 }]} numberOfLines={1}>{land.district}, {land.state}</Text>
        <Row style={{ gap: 8, marginTop: 7 }}>
          <Text style={styles.rowPrice}>{inrShort(land.pricePerAcreYear)}/ac</Text>
          <Text style={[type.small, { fontSize: 11 }]}>{land.availableArea} of {land.totalArea} ac free</Text>
        </Row>
      </View>
      {right}
    </Pressable>
  );
}

/* ---------------- Lease ---------------- */
const LEASE_TONE: Record<Lease['status'], Tone> = { active: 'green', pending: 'gold', completed: 'grey', rejected: 'red' };

export function LeaseCard({ lease, footer, onPress }: { lease: Lease; footer?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Row style={{ gap: 12 }}>
        <Photo uri={lease.landImage} style={{ width: 62, height: 62 }} rounded={radius.md} />
        <View style={{ flex: 1 }}>
          <Row style={{ justifyContent: 'space-between', gap: 8 }}>
            <Text style={[type.h3, { flex: 1 }]} numberOfLines={1}>{lease.landTitle}</Text>
            <Badge label={lease.status} tone={LEASE_TONE[lease.status]} />
          </Row>
          <Text style={[type.small, { marginTop: 3 }]}>{lease.agreementNo}</Text>
          <Row style={{ gap: 6, marginTop: 6 }}>
            <CalendarDays size={12} color={colors.muted} />
            <Text style={[type.small, { fontSize: 11.5 }]}>
              {shortDate(lease.startDate)} to {shortDate(lease.endDate)}
            </Text>
          </Row>
        </View>
      </Row>
      <View style={styles.hair} />
      <Row style={{ justifyContent: 'space-between' }}>
        <View>
          <Text style={[type.micro, { fontSize: 9.5 }]}>Lease value</Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.forest }}>{inr(lease.amount)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[type.micro, { fontSize: 9.5 }]}>Area</Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.forest }}>{lease.area} ac</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[type.micro, { fontSize: 9.5 }]}>Payment</Text>
          <Text style={{ fontSize: 13.5, fontWeight: '800', color: lease.paymentStatus === 'paid' ? colors.green : colors.warn, marginTop: 2 }}>
            {lease.paymentStatus === 'paid' ? 'Settled' : 'Due'}
          </Text>
        </View>
      </Row>
      {footer}
    </Pressable>
  );
}

/* ---------------- Product ---------------- */
export function ProductCard({ product, onPress, onAdd }: { product: Product; onPress?: () => void; onAdd?: () => void }) {
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <Pressable
      onPress={onPress ?? (() => router.push(`/shop/product/${product.id}`))}
      style={({ pressed }) => [styles.productCard, pressed && { opacity: 0.9 }]}
    >
      <View>
        <Photo uri={product.image} style={{ width: '100%', height: 108, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
        {off > 0 ? <View style={styles.offTag}><Text style={styles.offText}>{off}% off</Text></View> : null}
      </View>
      <View style={{ padding: 11 }}>
        <Text style={[type.micro, { fontSize: 9.5 }]}>{product.brand}</Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink, marginTop: 3, minHeight: 34 }} numberOfLines={2}>
          {product.name}
        </Text>
        <Row style={{ gap: 4, marginTop: 4 }}>
          <Star size={11} color={colors.gold} fill={colors.gold} />
          <Text style={[type.small, { fontSize: 11 }]}>{product.rating} ({product.reviews})</Text>
        </Row>
        <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '800', color: colors.forest }}>{inr(product.price)}</Text>
            <Text style={[type.small, { fontSize: 10 }]}>{product.unit}</Text>
          </View>
          <Pressable onPress={onAdd} style={styles.addBtn} hitSlop={6}>
            <Text style={styles.addBtnText}>ADD</Text>
          </Pressable>
        </Row>
      </View>
    </Pressable>
  );
}

/* ---------------- Order / Policy / Claim ---------------- */
const ORDER_TONE: Record<Order['status'], Tone> = { placed: 'gold', packed: 'blue', shipped: 'blue', delivered: 'green' };

export function OrderCard({ order, onPress }: { order: Order; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row style={{ gap: 9 }}>
          <View style={styles.circle}><Package size={16} color={colors.green} /></View>
          <View>
            <Text style={type.h3}>#{order.id.toUpperCase()}</Text>
            <Text style={[type.small, { fontSize: 11.5 }]}>{shortDate(order.placedAt)} · {order.items.length} item(s)</Text>
          </View>
        </Row>
        <Badge label={order.status} tone={ORDER_TONE[order.status]} />
      </Row>
      <View style={styles.hair} />
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={[type.small, { flex: 1 }]} numberOfLines={1}>{order.items.map(i => i.name).join(', ')}</Text>
        <Text style={{ fontSize: 15, fontWeight: '800', color: colors.forest }}>{inr(order.total)}</Text>
      </Row>
    </Pressable>
  );
}

export function PolicyCard({ policy, onPress }: { policy: Policy; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ borderRadius: radius.lg, overflow: 'hidden', ...shadow.card }}>
      <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: spacing.lg }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row style={{ gap: 8 }}>
            <ShieldCheck size={18} color={colors.gold} />
            <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 15 }}>{policy.planName}</Text>
          </Row>
          <View style={[styles.pill, { backgroundColor: policy.status === 'active' ? 'rgba(63,191,111,0.24)' : 'rgba(255,255,255,0.16)' }]}>
            <Text style={styles.pillText}>{policy.status}</Text>
          </View>
        </Row>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10.5, letterSpacing: 1.2, marginTop: 16, fontWeight: '700' }}>
          POLICY NUMBER
        </Text>
        <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '800', letterSpacing: 1.4, marginTop: 3 }}>{policy.policyNo}</Text>
        <Row style={{ justifyContent: 'space-between', marginTop: 18 }}>
          <View>
            <Text style={styles.cardLabel}>COVER</Text>
            <Text style={styles.cardValue}>{inrShort(policy.coverage)}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>PREMIUM</Text>
            <Text style={styles.cardValue}>{inr(policy.premium)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.cardLabel}>VALID TILL</Text>
            <Text style={styles.cardValue}>{shortDate(policy.endDate)}</Text>
          </View>
        </Row>
      </LinearGradient>
    </Pressable>
  );
}

export const CLAIM_TONE: Record<Claim['status'], Tone> = {
  submitted: 'blue', under_review: 'gold', approved: 'green', settled: 'green', rejected: 'red',
};

export function ClaimCard({ claim, onPress }: { claim: Claim; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Row style={{ justifyContent: 'space-between', gap: 8 }}>
        <Text style={[type.h3, { flex: 1 }]} numberOfLines={1}>{claim.type}</Text>
        <Badge label={claim.status.replace('_', ' ')} tone={CLAIM_TONE[claim.status]} />
      </Row>
      <Text style={[type.small, { marginTop: 3 }]}>{claim.claimNo} · {claim.policyNo}</Text>
      <View style={styles.hair} />
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={type.small}>Claimed on {shortDate(claim.createdAt)}</Text>
        <Text style={{ fontSize: 15, fontWeight: '800', color: colors.forest }}>{inr(claim.amount)}</Text>
      </Row>
    </Pressable>
  );
}

/* ---------------- Stats ---------------- */
export function StatTile({ label, value, icon: Icon, tone = 'green', onPress }: {
  label: string; value: string; icon: any; tone?: 'green' | 'gold' | 'blue'; onPress?: () => void;
}) {
  const bg = tone === 'gold' ? colors.goldSoft : tone === 'blue' ? colors.infoSoft : colors.leafSoft;
  const fg = tone === 'gold' ? colors.warn : tone === 'blue' ? colors.info : colors.green;
  return (
    <Pressable onPress={onPress} style={[styles.stat, { opacity: 1 }]}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}><Icon size={16} color={fg} /></View>
      <Text style={{ fontSize: 19, fontWeight: '800', color: colors.ink, marginTop: 10, letterSpacing: -0.4 }}>{value}</Text>
      <Text style={[type.small, { fontSize: 11.5, marginTop: 1 }]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  landCard: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', ...shadow.card },
  imgFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 64 },
  landOverlay: { position: 'absolute', left: 11, bottom: 10, gap: 4, paddingRight: 14 },
  overlayText: { color: '#FFF', fontSize: 11.5, fontWeight: '600', flexShrink: 1 },
  acreChip: { position: 'absolute', top: 10, right: 10, backgroundColor: colors.gold, paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.pill },
  acreChipText: { fontSize: 10.5, fontWeight: '800', color: '#3B2A05' },
  rating: { fontSize: 12, fontWeight: '700', color: colors.ink },
  verified: { fontSize: 11.5, fontWeight: '700', color: colors.green },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 11, ...shadow.card },
  rowPrice: { fontSize: 14, fontWeight: '800', color: colors.forest },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, ...shadow.card },
  hair: { height: 1, backgroundColor: colors.line, marginVertical: 13 },
  productCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', ...shadow.card },
  offTag: { position: 'absolute', top: 8, left: 8, backgroundColor: colors.green, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  offText: { color: '#FFF', fontSize: 9.5, fontWeight: '800' },
  addBtn: { borderWidth: 1.4, borderColor: colors.green, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText: { color: colors.green, fontWeight: '800', fontSize: 11.5, letterSpacing: 0.5 },
  circle: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
  pill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.pill },
  pillText: { color: '#FFF', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
  cardLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  cardValue: { color: '#FFF', fontSize: 14, fontWeight: '800', marginTop: 2 },
  stat: { flex: 1, minWidth: '46%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, ...shadow.card },
  statIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
