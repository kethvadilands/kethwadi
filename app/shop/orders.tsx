import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { PackageOpen } from 'lucide-react-native';
import { BottomSheet, Button, Divider, EmptyState, FadeIn, KeyValue, Row, TopBar } from '@/components/ui';
import { OrderCard } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { useToast } from '@/hooks/useToast';
import { inr, shortDate } from '@/constants/format';
import { colors, spacing, type } from '@/constants/theme';
import { Order, OrderStatus } from '@/types';

const FLOW: OrderStatus[] = ['placed', 'packed', 'shipped', 'delivered'];
const LABEL: Record<OrderStatus, string> = {
  placed: 'Order placed', packed: 'Packed at warehouse', shipped: 'Out for delivery', delivered: 'Delivered',
};

export default function Orders() {
  const { orders } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState<Order | null>(null);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="My orders" subtitle={`${orders.length} order${orders.length === 1 ? '' : 's'}`} />
      <FlatList
        data={orders}
        keyExtractor={o => o.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeIn delay={Math.min(index * 60, 200)}><OrderCard order={item} onPress={() => setOpen(item)} /></FadeIn>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={PackageOpen}
            title="No orders yet"
            body="Inputs you order will be tracked here from warehouse to farm gate."
            action="Shop inputs"
            onAction={() => router.replace('/(tabs)/marketplace')}
          />
        }
      />

      <BottomSheet visible={!!open} onClose={() => setOpen(null)} title={open ? `Order #${open.id.toUpperCase()}` : ''}>
        {open ? (
          <View>
            <View style={{ marginBottom: spacing.lg }}>
              {FLOW.map((s, i) => {
                const reached = FLOW.indexOf(open.status) >= i;
                return (
                  <Row key={s} style={{ gap: 12, alignItems: 'flex-start' }}>
                    <View style={{ alignItems: 'center' }}>
                      <View style={[styles.node, reached && { backgroundColor: colors.green, borderColor: colors.green }]} />
                      {i < FLOW.length - 1 ? <View style={[styles.line, reached && { backgroundColor: colors.green }]} /> : null}
                    </View>
                    <View style={{ paddingBottom: 20 }}>
                      <Text style={[type.h3, !reached && { color: colors.muted }]}>{LABEL[s]}</Text>
                      <Text style={[type.small, { fontSize: 11.5, marginTop: 2 }]}>
                        {reached ? shortDate(open.placedAt) : 'Pending'}
                      </Text>
                    </View>
                  </Row>
                );
              })}
            </View>
            <Divider />
            {open.items.map(i => <KeyValue key={i.productId} k={`${i.name} × ${i.qty}`} v={inr(i.price * i.qty)} />)}
            <Divider />
            <KeyValue k="Paid via" v={open.paymentMode} />
            <KeyValue k="Deliver to" v={open.address} />
            <Row style={{ justifyContent: 'space-between', marginTop: 8, marginBottom: 16 }}>
              <Text style={type.h3}>Total</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.forest }}>{inr(open.total)}</Text>
            </Row>
            <Button title="Download invoice" variant="secondary" compact onPress={() => { setOpen(null); toast('Invoice saved to documents'); }} />
          </View>
        ) : null}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  node: { width: 15, height: 15, borderRadius: 8, borderWidth: 2, borderColor: colors.line, backgroundColor: '#FFF' },
  line: { width: 2, height: 36, backgroundColor: colors.line },
});
