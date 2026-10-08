import React, { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Bell, CloudRain, Droplets, IndianRupee, Landmark, ShieldCheck, Sun, Wind, ArrowRight, Sprout, FileText,
} from 'lucide-react-native';
import {
  Badge, Button, Card, FadeIn, FieldRule, ListSkeleton, Photo, Row, SearchBar, SectionHeader, Skeleton,
} from '@/components/ui';
import { Avatar, LandCard, ProductCard, StatTile } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { CROP_ADVICE, PRODUCTS, WEATHER } from '@/data';
import { inr, inrShort, shortDate } from '@/constants/format';
import { colors, gradients, radius, shadow, spacing, type } from '@/constants/theme';

export default function HomeTab() {
  const { user, lands, leases, policies, unread, dispatch, isLandlord, notifications } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 850); return () => clearTimeout(t); }, []);

  const mine = isLandlord
    ? leases.filter(l => l.landlordId === user?.id)
    : leases.filter(l => l.farmerId === user?.id);
  const activeLease = mine.find(l => l.status === 'active');
  const myPolicy = policies.find(p => p.holderId === user?.id && p.status === 'active');
  const featured = lands.filter(l => l.status === 'published').slice(0, 5);
  const earnings = leases.filter(l => l.landlordId === user?.id && l.paymentStatus === 'paid').reduce((t, l) => t + l.amount, 0);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); toast('Dashboard updated', 'info'); }, 900);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bone }}>
      <LinearGradient colors={gradients.hero} style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <Row style={{ justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 8 }}>
            <Row style={{ gap: 11 }}>
              <Avatar seed={user?.avatarSeed ?? 'KW'} size={42} />
              <View>
                <Text style={styles.greet}>{greeting()}</Text>
                <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
              </View>
            </Row>
            <Pressable onPress={() => router.push('/notifications')} style={styles.bell}>
              <Bell size={19} color="#FFF" />
              {unread ? <View style={styles.bellDot}><Text style={styles.bellDotText}>{unread}</Text></View> : null}
            </Pressable>
          </Row>

          <View style={{ paddingHorizontal: spacing.lg, marginTop: 18, marginBottom: 44 }}>
            <SearchBar placeholder="Search land by district, crop or soil" onPress={() => router.push('/(tabs)/lands')} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1, marginTop: -32 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />}
      >
        {/* Weather */}
        <FadeIn>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <View style={styles.weather}>
              <LinearGradient colors={gradients.sky} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: spacing.lg }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.wPlace}>{WEATHER.place}</Text>
                    <Row style={{ alignItems: 'flex-start', marginTop: 4 }}>
                      <Text style={styles.wTemp}>{WEATHER.temp}</Text>
                      <Text style={styles.wDeg}>{'\u00B0C'}</Text>
                    </Row>
                    <Text style={styles.wCond}>{WEATHER.condition}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 8 }}>
                    <CloudRain size={38} color="#FFF" />
                    <Row style={{ gap: 12 }}>
                      <Row style={{ gap: 4 }}><Droplets size={12} color="rgba(255,255,255,0.85)" /><Text style={styles.wMeta}>{WEATHER.humidity}%</Text></Row>
                      <Row style={{ gap: 4 }}><Wind size={12} color="rgba(255,255,255,0.85)" /><Text style={styles.wMeta}>{WEATHER.wind} km/h</Text></Row>
                    </Row>
                  </View>
                </Row>
                <View style={styles.advisory}>
                  <Text style={styles.advisoryText}>{WEATHER.advisory}</Text>
                </View>
                <Row style={{ justifyContent: 'space-between', marginTop: 14 }}>
                  {WEATHER.week.map(d => (
                    <View key={d.day} style={{ alignItems: 'center', gap: 5 }}>
                      <Text style={styles.wDay}>{d.day}</Text>
                      {d.icon === 'sun' ? <Sun size={15} color="#FFE7A6" /> : d.icon === 'rain' ? <CloudRain size={15} color="#FFF" /> : <Sun size={15} color="rgba(255,255,255,0.7)" />}
                      <Text style={styles.wDayTemp}>{d.t}{'\u00B0'}</Text>
                    </View>
                  ))}
                </Row>
              </LinearGradient>
            </View>
          </View>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={80}>
          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
            <Row style={{ gap: spacing.md, flexWrap: 'wrap' }}>
              {isLandlord ? (
                <>
                  <StatTile label="My lands" value={String(lands.filter(l => l.ownerId === user?.id).length)} icon={Landmark} onPress={() => router.push('/landlord/my-lands')} />
                  <StatTile label="Lease earnings" value={inrShort(earnings)} icon={IndianRupee} tone="gold" onPress={() => router.push('/landlord/dashboard')} />
                </>
              ) : (
                <>
                  <StatTile label="Active leases" value={String(mine.filter(l => l.status === 'active').length)} icon={Landmark} onPress={() => router.push('/lease/my-leases')} />
                  <StatTile label="Acres farmed" value={`${mine.filter(l => l.status === 'active').reduce((t, l) => t + l.area, 0)} ac`} icon={Sprout} tone="gold" onPress={() => router.push('/lease/my-leases')} />
                </>
              )}
            </Row>
          </View>
        </FadeIn>

        {/* Active lease */}
        {activeLease ? (
          <FadeIn delay={140}>
            <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
              <SectionHeader title="Running lease" action="All leases" onAction={() => router.push('/lease/my-leases')} />
              <Pressable onPress={() => router.push('/lease/my-leases')} style={styles.leaseStrip}>
                <Photo uri={activeLease.landImage} style={{ width: 56, height: 56 }} rounded={radius.md} />
                <View style={{ flex: 1 }}>
                  <Text style={type.h3} numberOfLines={1}>{activeLease.landTitle}</Text>
                  <Text style={[type.small, { fontSize: 11.5, marginTop: 2 }]}>
                    {activeLease.area} acres · ends {shortDate(activeLease.endDate)}
                  </Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${leaseProgress(activeLease.startDate, activeLease.endDate)}%` }]} />
                  </View>
                </View>
                <ArrowRight size={17} color={colors.muted} />
              </Pressable>
            </View>
          </FadeIn>
        ) : null}

        {/* Featured lands */}
        <View style={{ marginTop: spacing.xxl }}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <SectionHeader title="Land ready to lease" action="See all" onAction={() => router.push('/(tabs)/lands')} />
          </View>
          {loading ? (
            <View style={{ paddingHorizontal: spacing.lg }}><ListSkeleton rows={2} /></View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
              {featured.map((l, i) => (
                <FadeIn key={l.id} delay={i * 70}><LandCard land={l} wide /></FadeIn>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Crop advisory */}
        <View style={{ marginTop: spacing.xxl }}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <SectionHeader title="What to sow now" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
            {CROP_ADVICE.map(c => (
              <View key={c.crop} style={styles.crop}>
                <Text style={{ fontSize: 22 }}>{c.emoji}</Text>
                <Text style={[type.h3, { marginTop: 8 }]}>{c.crop}</Text>
                <Badge label={c.season} tone="gold" />
                <FieldRule style={{ marginVertical: 10 }} />
                <Text style={[type.small, { fontSize: 11 }]}>Window {c.window}</Text>
                <Text style={[type.small, { fontSize: 11 }]}>Yield {c.yield}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Insurance */}
        <FadeIn delay={100}>
          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xxl }}>
            <Pressable onPress={() => router.push('/(tabs)/insurance')} style={styles.insurance}>
              <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ padding: spacing.lg, flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                <View style={styles.shield}><ShieldCheck size={22} color={colors.gold} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 15 }}>
                    {myPolicy ? myPolicy.planName : 'You are not covered yet'}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 3 }}>
                    {myPolicy ? `Cover ${inr(myPolicy.coverage)} · valid to ${shortDate(myPolicy.endDate)}` : 'Accident and crop loss cover from ₹1,450 a year'}
                  </Text>
                </View>
                <ArrowRight size={18} color="#FFF" />
              </LinearGradient>
            </Pressable>
          </View>
        </FadeIn>

        {/* Marketplace */}
        <View style={{ marginTop: spacing.xxl }}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <SectionHeader title="Inputs for this season" action="Shop all" onAction={() => router.push('/(tabs)/marketplace')} />
          </View>
          {loading ? (
            <View style={{ paddingHorizontal: spacing.lg }}><Skeleton h={150} r={16} /></View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
              {PRODUCTS.slice(0, 5).map(p => (
                <View key={p.id} style={{ width: 158 }}>
                  <ProductCard product={p} onAdd={() => { dispatch({ type: 'CART_ADD', productId: p.id, qty: 1 }); toast(`${p.name} added to cart`); }} />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Activity */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xxl }}>
          <SectionHeader title="Recent activity" action="View all" onAction={() => router.push('/notifications')} />
          <Card>
            {notifications.slice(0, 4).map((n, i, arr) => (
              <View key={n.id}>
                <Row style={{ gap: 11, paddingVertical: 10 }}>
                  <View style={styles.dot} />
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3} numberOfLines={1}>{n.title}</Text>
                    <Text style={[type.small, { fontSize: 11.5, marginTop: 2 }]} numberOfLines={1}>{n.body}</Text>
                  </View>
                  <Text style={[type.small, { fontSize: 10.5 }]}>{n.time}</Text>
                </Row>
                {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: colors.line }} /> : null}
              </View>
            ))}
          </Card>
        </View>

        {isLandlord ? (
          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
            <Button title="Open landlord dashboard" icon={FileText} variant="secondary" onPress={() => router.push('/landlord/dashboard')} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function leaseProgress(start: string, end: string) {
  const s = new Date(start).getTime(), e = new Date(end).getTime(), n = Date.now();
  return Math.max(4, Math.min(100, Math.round(((n - s) / (e - s)) * 100)));
}

const styles = StyleSheet.create({
  hero: { paddingBottom: 12 },
  greet: { color: 'rgba(255,255,255,0.65)', fontSize: 11.5, fontWeight: '600' },
  name: { color: '#FFF', fontSize: 16.5, fontWeight: '800', marginTop: 1 },
  bell: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  bellDotText: { fontSize: 10, fontWeight: '800', color: '#3B2A05' },
  weather: { borderRadius: radius.xl, overflow: 'hidden', ...shadow.raised },
  wPlace: { color: 'rgba(255,255,255,0.8)', fontSize: 11.5, fontWeight: '700' },
  wTemp: { color: '#FFF', fontSize: 40, fontWeight: '800', letterSpacing: -1.5 },
  wDeg: { color: '#FFF', fontSize: 17, fontWeight: '700', marginTop: 5 },
  wCond: { color: 'rgba(255,255,255,0.85)', fontSize: 12.5, fontWeight: '600' },
  wMeta: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },
  advisory: { backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: radius.md, padding: 10, marginTop: 14 },
  advisoryText: { color: '#FFF', fontSize: 12, lineHeight: 17, fontWeight: '600' },
  wDay: { color: 'rgba(255,255,255,0.7)', fontSize: 10.5, fontWeight: '700' },
  wDayTemp: { color: '#FFF', fontSize: 11.5, fontWeight: '700' },
  leaseStrip: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 12, ...shadow.card },
  progressTrack: { height: 4, borderRadius: 2, backgroundColor: colors.line, marginTop: 9, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2, backgroundColor: colors.leaf },
  crop: { width: 138, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, ...shadow.card },
  insurance: { borderRadius: radius.lg, overflow: 'hidden', ...shadow.card },
  shield: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.13)', alignItems: 'center', justifyContent: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.leaf, marginTop: 6 },
});
