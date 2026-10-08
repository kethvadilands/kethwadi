import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  BadgeCheck, ChevronLeft, Droplets, FileText, Layers, MapPin, Share2, Sprout, Star, Zap, Navigation,
} from 'lucide-react-native';
import { Badge, Button, Card, FadeIn, FieldRule, Photo, Row, KeyValue, Divider } from '@/components/ui';
import { Avatar } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { inr } from '@/constants/format';
import { colors, gradients, radius, shadow, spacing, type } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function LandDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lands, user } = useApp();
  const toast = useToast();
  const [slide, setSlide] = useState(0);
  const land = lands.find(l => l.id === id);

  if (!land) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={type.h2}>This listing is no longer available</Text>
        <Button title="Back to search" onPress={() => router.replace('/(tabs)/lands')} full={false} style={{ marginTop: 16 }} compact />
      </SafeAreaView>
    );
  }

  const isOwner = land.ownerId === user?.id;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
          <ScrollView
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => setSlide(Math.round(e.nativeEvent.contentOffset.x / width))}
          >
            {land.gallery.map((g, i) => (
              <Photo key={i} uri={g} style={{ width, height: 292 }} rounded={0} />
            ))}
          </ScrollView>
          <LinearGradient colors={['rgba(6,37,28,0.6)', 'transparent']} style={styles.topFade} pointerEvents="none" />

          <SafeAreaView edges={['top']} style={styles.navWrap}>
            <Row style={{ justifyContent: 'space-between', paddingHorizontal: spacing.lg }}>
              <Pressable onPress={() => router.back()} style={styles.navBtn}><ChevronLeft size={20} color="#FFF" /></Pressable>
              <Pressable onPress={() => toast('Listing link copied', 'info')} style={styles.navBtn}><Share2 size={17} color="#FFF" /></Pressable>
            </Row>
          </SafeAreaView>

          <Row style={styles.dots}>
            {land.gallery.map((_, i) => <View key={i} style={[styles.dot, i === slide && styles.dotOn]} />)}
          </Row>
        </View>

        <View style={{ padding: spacing.lg, marginTop: -22 }}>
          <FadeIn>
            <Card>
              <Row style={{ justifyContent: 'space-between', gap: 10 }}>
                <Text style={[type.h1, { flex: 1 }]}>{land.title}</Text>
                <Row style={{ gap: 4 }}>
                  <Star size={14} color={colors.gold} fill={colors.gold} />
                  <Text style={{ fontWeight: '800', color: colors.ink }}>{land.rating}</Text>
                </Row>
              </Row>
              <Row style={{ gap: 5, marginTop: 7 }}>
                <MapPin size={13} color={colors.muted} />
                <Text style={type.small}>{land.village}, {land.district}, {land.state}</Text>
              </Row>

              <FieldRule />

              <Row style={{ justifyContent: 'space-between' }}>
                <View>
                  <Text style={type.micro}>Lease rate</Text>
                  <Row style={{ alignItems: 'flex-end', gap: 5, marginTop: 3 }}>
                    <Text style={{ fontSize: 25, fontWeight: '800', color: colors.forest, letterSpacing: -0.6 }}>
                      {inr(land.pricePerAcreYear)}
                    </Text>
                    <Text style={[type.small, { marginBottom: 4 }]}>/ acre / year</Text>
                  </Row>
                </View>
                <View style={styles.areaBox}>
                  <Text style={styles.areaVal}>{land.availableArea}</Text>
                  <Text style={styles.areaLbl}>ACRES FREE</Text>
                </View>
              </Row>
            </Card>
          </FadeIn>

          <FadeIn delay={80}>
            <Row style={{ gap: spacing.md, marginTop: spacing.lg }}>
              <Facet icon={Layers} label="Soil" value={land.soilType} />
              <Facet icon={Droplets} label="Water" value={land.waterAvailability} />
              <Facet icon={Zap} label="Power" value={land.electricity ? 'Available' : 'None'} />
            </Row>
          </FadeIn>

          <FadeIn delay={130}>
            <Card style={{ marginTop: spacing.lg }}>
              <Text style={type.h2}>About this land</Text>
              <Text style={[type.body, { marginTop: 8 }]}>{land.description}</Text>
              <Divider />
              <KeyValue k="Total area" v={`${land.totalArea} acres`} />
              <KeyValue k="Available to lease" v={`${land.availableArea} acres`} />
              <KeyValue k="Water source" v={land.waterSource} />
              <KeyValue k="Minimum lease" v={`${land.minLeaseMonths} months`} />
              <KeyValue k="Listed on" v={land.createdAt} />
            </Card>
          </FadeIn>

          <FadeIn delay={170}>
            <Card style={{ marginTop: spacing.lg }}>
              <Text style={type.h2}>Suitable crops</Text>
              <Row style={{ gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {land.crops.map(c => (
                  <Row key={c} style={styles.crop}>
                    <Sprout size={13} color={colors.green} />
                    <Text style={styles.cropText}>{c}</Text>
                  </Row>
                ))}
              </Row>
            </Card>
          </FadeIn>

          <FadeIn delay={210}>
            <Card style={{ marginTop: spacing.lg, padding: 0, overflow: 'hidden' }}>
              <LinearGradient colors={['#DCE9DE', '#EFF5F0']} style={styles.map}>
                <View style={styles.mapPin}><MapPin size={18} color="#FFF" /></View>
                <Text style={[type.small, { marginTop: 10, fontWeight: '700' }]}>{land.village}, {land.district}</Text>
                <Text style={[type.small, { fontSize: 11 }]}>Survey map opens in the field app</Text>
                <Button
                  title="Get directions" variant="secondary" icon={Navigation} compact full={false}
                  style={{ marginTop: 12, paddingHorizontal: 18 }}
                  onPress={() => toast('Directions open in the demo build only', 'info')}
                />
              </LinearGradient>
            </Card>
          </FadeIn>

          <FadeIn delay={250}>
            <Card style={{ marginTop: spacing.lg }}>
              <Text style={type.h2}>Owner</Text>
              <Row style={{ gap: 12, marginTop: 12 }}>
                <Avatar seed={land.ownerName.split(' ').map(w => w[0]).join('')} size={46} />
                <View style={{ flex: 1 }}>
                  <Row style={{ gap: 6 }}>
                    <Text style={type.h3}>{land.ownerName}</Text>
                    {land.ownerVerified ? <BadgeCheck size={15} color={colors.green} /> : null}
                  </Row>
                  <Text style={[type.small, { marginTop: 2 }]}>
                    {land.ownerVerified ? 'Aadhaar and land records verified' : 'Verification in progress'}
                  </Text>
                </View>
              </Row>
              <Divider />
              <Text style={type.micro}>Documents on file</Text>
              <View style={{ gap: 8, marginTop: 10 }}>
                {land.documents.map(d => (
                  <Row key={d} style={{ gap: 9 }}>
                    <FileText size={14} color={colors.muted} />
                    <Text style={[type.body, { fontSize: 13 }]}>{d}</Text>
                    <View style={{ flex: 1 }} />
                    <Badge label="Verified" tone="green" />
                  </Row>
                ))}
              </View>
            </Card>
          </FadeIn>
        </View>
      </ScrollView>

      <View style={styles.bar}>
        <View style={{ flex: 1 }}>
          <Text style={[type.micro, { fontSize: 9.5 }]}>From</Text>
          <Text style={{ fontSize: 17, fontWeight: '800', color: colors.forest }}>
            {inr(land.pricePerAcreYear)}<Text style={[type.small, { fontSize: 11 }]}> /ac/yr</Text>
          </Text>
        </View>
        <Button
          title={isOwner ? 'Manage this listing' : 'Request lease'}
          onPress={() => isOwner ? router.push('/landlord/my-lands') : router.push({ pathname: '/land/book', params: { id: land.id } })}
          full={false}
          style={{ paddingHorizontal: 26 }}
        />
      </View>
    </View>
  );
}

function Facet({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.facet}>
      <Icon size={17} color={colors.green} />
      <Text style={[type.micro, { fontSize: 9.5, marginTop: 8 }]}>{label}</Text>
      <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.ink, marginTop: 2 }} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topFade: { position: 'absolute', top: 0, left: 0, right: 0, height: 110 },
  navWrap: { position: 'absolute', top: 0, left: 0, right: 0 },
  navBtn: { width: 38, height: 38, borderRadius: 13, backgroundColor: 'rgba(6,37,28,0.45)', alignItems: 'center', justifyContent: 'center' },
  dots: { position: 'absolute', bottom: 38, alignSelf: 'center', gap: 5, left: 0, right: 0, justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotOn: { width: 18, backgroundColor: '#FFF' },
  areaBox: { backgroundColor: colors.goldSoft, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' },
  areaVal: { fontSize: 21, fontWeight: '800', color: colors.warn },
  areaLbl: { fontSize: 8.5, fontWeight: '800', letterSpacing: 0.8, color: colors.warn },
  facet: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 13, ...shadow.card },
  crop: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.leafSoft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  cropText: { fontSize: 12.5, fontWeight: '700', color: colors.green },
  map: { height: 172, alignItems: 'center', justifyContent: 'center' },
  mapPin: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  bar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingTop: 12, paddingBottom: 22,
    borderTopWidth: 1, borderTopColor: colors.line,
  },
});
