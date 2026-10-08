import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Check, Headphones, Upload } from 'lucide-react-native';
import { Badge, Button, Card, Divider, FadeIn, KeyValue, Row, TopBar } from '@/components/ui';
import { CLAIM_TONE } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { inr, shortDate } from '@/constants/format';
import { colors, radius, spacing, type } from '@/constants/theme';

export default function ClaimTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { claims } = useApp();
  const toast = useToast();
  const claim = claims.find(c => c.id === id);
  if (!claim) return null;

  const doneCount = claim.timeline.filter(t => t.done).length;
  const pct = Math.round((doneCount / claim.timeline.length) * 100);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Claim tracking" subtitle={claim.claimNo} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <FadeIn>
          <Card>
            <Row style={{ justifyContent: 'space-between', gap: 10 }}>
              <Text style={[type.h2, { flex: 1 }]}>{claim.type}</Text>
              <Badge label={claim.status.replace('_', ' ')} tone={CLAIM_TONE[claim.status]} />
            </Row>
            <Row style={{ alignItems: 'flex-end', gap: 8, marginTop: 14 }}>
              <Text style={{ fontSize: 26, fontWeight: '800', color: colors.forest, letterSpacing: -0.7 }}>{inr(claim.amount)}</Text>
              <Text style={[type.small, { marginBottom: 5 }]}>claimed</Text>
            </Row>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${pct}%` }]} />
            </View>
            <Text style={[type.small, { fontSize: 11.5, marginTop: 8 }]}>
              {doneCount} of {claim.timeline.length} steps complete
            </Text>
          </Card>
        </FadeIn>

        <FadeIn delay={80}>
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={type.h2}>Progress</Text>
            <View style={{ marginTop: 16 }}>
              {claim.timeline.map((t, i) => (
                <Row key={t.label} style={{ gap: 13, alignItems: 'flex-start' }}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={[styles.node, t.done && { backgroundColor: colors.green, borderColor: colors.green }]}>
                      {t.done ? <Check size={10} color="#FFF" strokeWidth={3.5} /> : null}
                    </View>
                    {i < claim.timeline.length - 1 ? (
                      <View style={[styles.line, t.done && { backgroundColor: colors.green }]} />
                    ) : null}
                  </View>
                  <View style={{ paddingBottom: 22, flex: 1 }}>
                    <Text style={[type.h3, !t.done && { color: colors.muted }]}>{t.label}</Text>
                    <Text style={[type.small, { fontSize: 11.5, marginTop: 2 }]}>{t.date}</Text>
                  </View>
                </Row>
              ))}
            </View>
          </Card>
        </FadeIn>

        <FadeIn delay={130}>
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={type.h2}>Claim details</Text>
            <Divider />
            <KeyValue k="Policy" v={claim.policyNo} />
            <KeyValue k="Incident date" v={shortDate(claim.incidentDate)} />
            <KeyValue k="Filed on" v={shortDate(claim.createdAt)} />
            <Divider />
            <Text style={type.micro}>What the farmer reported</Text>
            <Text style={[type.body, { marginTop: 7 }]}>{claim.description}</Text>
          </Card>
        </FadeIn>

        <View style={{ gap: 10, marginTop: spacing.xl }}>
          <Button title="Upload more evidence" icon={Upload} variant="secondary" compact onPress={() => toast('Evidence added to the claim file')} />
          <Button title="Talk to the claims team" icon={Headphones} variant="ghost" compact onPress={() => toast('A claims officer will call within 4 hours', 'info')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: 3, backgroundColor: colors.line, marginTop: 16, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.leaf },
  node: { width: 19, height: 19, borderRadius: 10, borderWidth: 2, borderColor: colors.line, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  line: { width: 2, height: 40, backgroundColor: colors.line },
});
