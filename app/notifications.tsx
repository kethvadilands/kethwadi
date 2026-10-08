import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BellOff, Landmark, Package, ShieldCheck, Settings } from 'lucide-react-native';
import { Button, EmptyState, FadeIn, Row, TopBar } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { colors, radius, shadow, spacing, type } from '@/constants/theme';
import { AppNotification } from '@/types';

const ICON = { lease: Landmark, order: Package, insurance: ShieldCheck, system: Settings };

export default function Notifications() {
  const { notifications, dispatch, unread } = useApp();
  const toast = useToast();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar
        title="Notifications"
        subtitle={unread ? `${unread} unread` : 'All caught up'}
        right={unread ? (
          <Button title="Mark read" variant="ghost" compact full={false} style={{ paddingHorizontal: 12 }}
            onPress={() => { dispatch({ type: 'READ_ALL' }); toast('All notifications marked read', 'info'); }} />
        ) : undefined}
      />
      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <FadeIn delay={Math.min(index * 50, 200)}><Item n={item} /></FadeIn>}
        ListEmptyComponent={<EmptyState icon={BellOff} title="Nothing new" body="Lease updates, deliveries and claim progress show up here." />}
      />
    </SafeAreaView>
  );
}

function Item({ n }: { n: AppNotification }) {
  const Icon = ICON[n.kind];
  return (
    <View style={[styles.card, !n.read && styles.unread]}>
      <Row style={{ gap: 12, alignItems: 'flex-start' }}>
        <View style={styles.icon}><Icon size={17} color={colors.green} /></View>
        <View style={{ flex: 1 }}>
          <Row style={{ justifyContent: 'space-between', gap: 8 }}>
            <Text style={[type.h3, { flex: 1 }]} numberOfLines={1}>{n.title}</Text>
            {!n.read ? <View style={styles.dot} /> : null}
          </Row>
          <Text style={[type.body, { fontSize: 13, marginTop: 3 }]}>{n.body}</Text>
          <Text style={[type.small, { fontSize: 11, marginTop: 6 }]}>{n.time}</Text>
        </View>
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, ...shadow.card },
  unread: { borderLeftWidth: 3, borderLeftColor: colors.leaf },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold, marginTop: 5 },
});
