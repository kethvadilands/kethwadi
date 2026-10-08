import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, EmptyState, FadeIn, Row, Tone, TopBar, Chip } from '@/components/ui';
import { colors, radius, shadow, spacing, type } from '@/constants/theme';
import { Inbox } from 'lucide-react-native';

export interface AdminRow {
  id: string;
  title: string;
  sub: string;
  meta?: string;
  badge?: { label: string; tone: Tone };
  actions?: React.ReactNode;
}

export function AdminScreen({
  title, subtitle, rows, tabs, tab, onTab,
}: {
  title: string; subtitle: string; rows: AdminRow[];
  tabs?: string[]; tab?: string; onTab?: (t: string) => void;
}) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title={title} subtitle={subtitle} />
      {tabs?.length ? (
        <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 12 }}>
          <Row style={{ gap: 8, flexWrap: 'wrap' }}>
            {tabs.map(t => <Chip key={t} label={t} active={tab === t} onPress={() => onTab?.(t)} />)}
          </Row>
        </View>
      ) : null}
      <FlatList
        data={rows}
        keyExtractor={r => r.id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: tabs ? 4 : spacing.lg, gap: spacing.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeIn delay={Math.min(index * 45, 200)}>
            <View style={styles.card}>
              <Row style={{ justifyContent: 'space-between', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={type.h3} numberOfLines={1}>{item.title}</Text>
                  <Text style={[type.small, { marginTop: 3 }]} numberOfLines={2}>{item.sub}</Text>
                </View>
                {item.badge ? <Badge label={item.badge.label} tone={item.badge.tone} /> : null}
              </Row>
              {item.meta ? (
                <>
                  <View style={styles.hair} />
                  <Text style={[type.small, { fontSize: 11.5 }]}>{item.meta}</Text>
                </>
              ) : null}
              {item.actions ? <View style={{ marginTop: 13 }}>{item.actions}</View> : null}
            </View>
          </FadeIn>
        )}
        ListEmptyComponent={<EmptyState icon={Inbox} title="Nothing to review" body="Records matching this filter will appear here." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, ...shadow.card },
  hair: { height: 1, backgroundColor: colors.line, marginVertical: 11 },
});
