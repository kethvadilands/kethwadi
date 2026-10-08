import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera, Check, FileUp, Zap } from 'lucide-react-native';
import {
  Button, Card, Chip, Field, Input, Label, Row, SuccessModal, TopBar, Photo, Divider,
} from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { CROPS, DISTRICTS, LAND_IMAGES, SOILS, STATES, WATER_SOURCES } from '@/data';
import { uid } from '@/constants/format';
import { colors, radius, spacing, type } from '@/constants/theme';
import { Land, SoilType, WaterLevel } from '@/types';

const STEPS = ['Basics', 'Land profile', 'Terms', 'Documents'];
const WATER_LEVELS: WaterLevel[] = ['Abundant', 'Moderate', 'Limited'];

export default function AddLand() {
  const { user, dispatch } = useApp();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [title, setTitle] = useState('');
  const [village, setVillage] = useState('');
  const [state, setState] = useState('Telangana');
  const [district, setDistrict] = useState('Warangal');
  const [totalArea, setTotalArea] = useState('');
  const [availableArea, setAvailableArea] = useState('');
  const [soil, setSoil] = useState<SoilType>('Black Cotton');
  const [waterSource, setWaterSource] = useState('Borewell');
  const [water, setWater] = useState<WaterLevel>('Moderate');
  const [power, setPower] = useState(true);
  const [crops, setCrops] = useState<string[]>(['Paddy']);
  const [months, setMonths] = useState('12');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [docs, setDocs] = useState<string[]>([]);

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setPhotos(p => [...p, LAND_IMAGES[p.length % LAND_IMAGES.length]]);
      return toast('Gallery access denied. Added a sample photo instead.', 'info');
    }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, allowsMultipleSelection: false });
    if (!res.canceled && res.assets?.[0]) {
      setPhotos(p => [...p, res.assets[0].uri]);
      toast('Photo added');
    }
  };

  const pickDoc = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: false });
    if (!res.canceled && res.assets?.[0]) {
      setDocs(d => [...d, res.assets[0].name]);
      toast('Document attached');
    }
  };

  const validate = () => {
    if (step === 0) {
      if (title.trim().length < 4) return toast('Give the plot a name buyers will recognise', 'error'), false;
      if (!village.trim()) return toast('Enter the village', 'error'), false;
    }
    if (step === 1) {
      if (!totalArea || Number(totalArea) <= 0) return toast('Enter the total area in acres', 'error'), false;
      if (!availableArea || Number(availableArea) > Number(totalArea)) return toast('Available area cannot exceed total area', 'error'), false;
    }
    if (step === 2) {
      if (!price || Number(price) < 1000) return toast('Enter a realistic yearly rate per acre', 'error'), false;
    }
    return true;
  };

  const next = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) return setStep(s => s + 1);
    publish();
  };

  const publish = () => {
    const land: Land = {
      id: uid('ld'),
      title, ownerId: user?.id ?? 'u-ll-1', ownerName: user?.name ?? 'Ramesh Reddy',
      ownerVerified: user?.kycStatus === 'verified',
      village, district, state,
      totalArea: Number(totalArea), availableArea: Number(availableArea),
      soilType: soil, waterSource, waterAvailability: water, electricity: power,
      crops, minLeaseMonths: Number(months) || 12, pricePerAcreYear: Number(price),
      image: photos[0] ?? LAND_IMAGES[2],
      gallery: photos.length ? photos : [LAND_IMAGES[2], LAND_IMAGES[5]],
      documents: docs.length ? docs : ['Pattadar Passbook'],
      status: 'pending', rating: 4.5,
      description: desc || 'Listed on KETHWADI. Contact the owner through the app for a field visit.',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    dispatch({ type: 'ADD_LAND', land });
    dispatch({ type: 'NOTIFY', item: { id: uid('n'), title: 'Land submitted for verification', body: `${title} is under review. Usually cleared in 24 hours.`, kind: 'system', time: 'Just now', read: false } });
    setDone(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="List your land" subtitle={`Step ${step + 1} of ${STEPS.length} · ${STEPS[step]}`} />

      <Row style={{ paddingHorizontal: spacing.lg, paddingVertical: 14, gap: 6 }}>
        {STEPS.map((s, i) => (
          <View key={s} style={[styles.bar, i <= step && { backgroundColor: colors.green }]} />
        ))}
      </Row>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 4, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <Card>
            {step === 0 ? (
              <>
                <Field label="Land title">
                  <Input value={title} onChangeText={setTitle} placeholder="e.g. Godavari Canal Farm" />
                </Field>
                <Field label="Village">
                  <Input value={village} onChangeText={setVillage} placeholder="e.g. Parkal" />
                </Field>
                <Field label="State">
                  <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                    {STATES.map(s => (
                      <Chip key={s} label={s} active={state === s} onPress={() => { setState(s); setDistrict(DISTRICTS[s][0]); }} />
                    ))}
                  </Row>
                </Field>
                <Field label="District">
                  <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                    {DISTRICTS[state].map(d => <Chip key={d} label={d} active={district === d} onPress={() => setDistrict(d)} />)}
                  </Row>
                </Field>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Row style={{ gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Field label="Total area (acres)">
                      <Input value={totalArea} onChangeText={setTotalArea} keyboardType="decimal-pad" placeholder="18" />
                    </Field>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field label="Available to lease">
                      <Input value={availableArea} onChangeText={setAvailableArea} keyboardType="decimal-pad" placeholder="12" />
                    </Field>
                  </View>
                </Row>
                <Field label="Soil type">
                  <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                    {SOILS.map(s => <Chip key={s} label={s} active={soil === s} onPress={() => setSoil(s as SoilType)} />)}
                  </Row>
                </Field>
                <Field label="Water source">
                  <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                    {WATER_SOURCES.map(w => <Chip key={w} label={w} active={waterSource === w} onPress={() => setWaterSource(w)} />)}
                  </Row>
                </Field>
                <Field label="Water availability">
                  <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                    {WATER_LEVELS.map(w => <Chip key={w} label={w} active={water === w} onPress={() => setWater(w)} />)}
                  </Row>
                </Field>
                <Pressable onPress={() => setPower(p => !p)} style={styles.toggleRow}>
                  <Row style={{ gap: 10, flex: 1 }}>
                    <Zap size={17} color={colors.gold} />
                    <View>
                      <Text style={type.h3}>Electricity connection</Text>
                      <Text style={[type.small, { fontSize: 11.5 }]}>Agricultural feeder on the plot</Text>
                    </View>
                  </Row>
                  <View style={[styles.toggle, power && { backgroundColor: colors.green, alignItems: 'flex-end' }]}>
                    <View style={styles.knob} />
                  </View>
                </Pressable>
                <Field label="Suitable crops">
                  <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                    {CROPS.map(c => (
                      <Chip key={c} label={c} active={crops.includes(c)}
                        onPress={() => setCrops(v => v.includes(c) ? v.filter(x => x !== c) : [...v, c])} />
                    ))}
                  </Row>
                </Field>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Field label="Minimum lease duration (months)">
                  <Row style={{ gap: 8 }}>
                    {['12', '24', '36'].map(m => <Chip key={m} label={`${m} months`} active={months === m} onPress={() => setMonths(m)} />)}
                  </Row>
                </Field>
                <Field label="Expected lease amount (per acre / year)" hint="Comparable plots in this district list between ₹17,000 and ₹55,000">
                  <Input value={price} onChangeText={setPrice} keyboardType="number-pad" placeholder="32000" />
                </Field>
                <Field label="Description">
                  <Input
                    value={desc} onChangeText={setDesc} multiline
                    placeholder="Soil condition, access road, storage, labour availability..."
                    style={{ height: 106, textAlignVertical: 'top' }}
                  />
                </Field>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <Label style={{ marginBottom: 9 }}>Land photos</Label>
                <Row style={{ gap: 10, flexWrap: 'wrap' }}>
                  {photos.map((p, i) => <Photo key={i} uri={p} style={{ width: 78, height: 78 }} rounded={radius.md} />)}
                  <Pressable onPress={pickPhoto} style={styles.upload}>
                    <Camera size={19} color={colors.green} />
                    <Text style={styles.uploadText}>Add</Text>
                  </Pressable>
                </Row>
                <Divider />
                <Label style={{ marginBottom: 9 }}>Land documents</Label>
                <View style={{ gap: 9 }}>
                  {docs.map(d => (
                    <Row key={d} style={styles.doc}>
                      <Check size={14} color={colors.green} />
                      <Text style={[type.body, { fontSize: 13, flex: 1 }]} numberOfLines={1}>{d}</Text>
                    </Row>
                  ))}
                  <Button title="Upload pattadar passbook / 7-12 / RTC" variant="secondary" icon={FileUp} compact onPress={pickDoc} />
                </View>
                <Text style={[type.small, { fontSize: 11.5, marginTop: 14 }]}>
                  Documents are checked against state land records before your listing goes live.
                </Text>
              </>
            ) : null}
          </Card>

          <Row style={{ gap: 10, marginTop: spacing.xl }}>
            {step > 0 ? <Button title="Back" variant="ghost" onPress={() => setStep(s => s - 1)} style={{ flex: 1 }} compact /> : null}
            <Button title={step === STEPS.length - 1 ? 'Publish land' : 'Continue'} onPress={next} style={{ flex: 1.6 }} />
          </Row>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={done}
        title="Land submitted"
        body="Our team verifies documents against state land records. You will be notified once it goes live."
        meta={[{ k: 'Plot', v: title }, { k: 'Area listed', v: `${availableArea} acres` }, { k: 'Status', v: 'Pending verification' }]}
        primaryLabel="View my lands"
        onPrimary={() => { setDone(false); router.replace('/landlord/my-lands'); }}
        secondaryLabel="List another plot"
        onSecondary={() => { setDone(false); setStep(0); setTitle(''); setVillage(''); setTotalArea(''); setAvailableArea(''); setPrice(''); setPhotos([]); setDocs([]); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginBottom: spacing.lg },
  toggle: { width: 46, height: 27, borderRadius: 14, backgroundColor: colors.line, padding: 3, justifyContent: 'center' },
  knob: { width: 21, height: 21, borderRadius: 11, backgroundColor: '#FFF' },
  upload: { width: 78, height: 78, borderRadius: radius.md, borderWidth: 1.4, borderStyle: 'dashed', borderColor: '#BBD3C4', alignItems: 'center', justifyContent: 'center', gap: 3, backgroundColor: colors.leafSoft },
  uploadText: { fontSize: 10.5, fontWeight: '800', color: colors.green },
  doc: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.leafSoft, padding: 11, borderRadius: radius.md },
});
