import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, X } from 'lucide-react-native';
import { colors, radius, spacing, type } from '@/constants/theme';
import { Button, FieldRule } from './Base';

export function BottomSheet({ visible, onClose, title, children }: {
  visible: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.sheetHead}>
          <Text style={type.h2}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
            <X size={18} color={colors.body} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

export function ConfirmDialog({ visible, title, body, confirmLabel = 'Confirm', onConfirm, onCancel, danger }: {
  visible: boolean; title: string; body: string; confirmLabel?: string;
  onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.centerWrap}>
        <View style={styles.dialog}>
          <Text style={type.h2}>{title}</Text>
          <Text style={[type.body, { marginTop: 8, marginBottom: 20 }]}>{body}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="Cancel" variant="ghost" onPress={onCancel} style={{ flex: 1 }} compact />
            <Button
              title={confirmLabel}
              variant={danger ? 'danger' : 'primary'}
              onPress={onConfirm}
              style={{ flex: 1 }}
              compact
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function SuccessModal({ visible, title, body, primaryLabel, onPrimary, secondaryLabel, onSecondary, meta }: {
  visible: boolean; title: string; body: string; primaryLabel: string; onPrimary: () => void;
  secondaryLabel?: string; onSecondary?: () => void; meta?: { k: string; v: string }[];
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.centerWrap}>
        <View style={styles.dialog}>
          <View style={styles.tick}><CheckCircle2 size={34} color={colors.green} /></View>
          <Text style={[type.h1, { textAlign: 'center' }]}>{title}</Text>
          <Text style={[type.body, { textAlign: 'center', marginTop: 8 }]}>{body}</Text>
          {meta?.length ? (
            <>
              <FieldRule />
              {meta.map(m => (
                <View key={m.k} style={styles.metaRow}>
                  <Text style={type.small}>{m.k}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink }}>{m.v}</Text>
                </View>
              ))}
              <View style={{ height: 14 }} />
            </>
          ) : <View style={{ height: 20 }} />}
          <Button title={primaryLabel} onPress={onPrimary} />
          {secondaryLabel ? (
            <Button title={secondaryLabel} variant="ghost" onPress={onSecondary} style={{ marginTop: 9 }} compact />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.bone, borderTopLeftRadius: 26, borderTopRightRadius: 26,
    paddingHorizontal: spacing.lg, paddingTop: 10, maxHeight: '82%',
  },
  grabber: { width: 42, height: 4, borderRadius: 2, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 12 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EAF0EC', alignItems: 'center', justifyContent: 'center' },
  centerWrap: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  dialog: { width: '100%', backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xl },
  tick: { alignSelf: 'center', width: 66, height: 66, borderRadius: 33, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
});
