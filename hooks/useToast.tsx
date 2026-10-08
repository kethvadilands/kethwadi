import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Info, XCircle } from 'lucide-react-native';
import { colors, radius, shadow, spacing } from '@/constants/theme';

type Kind = 'success' | 'error' | 'info';
interface Toast { msg: string; kind: Kind }

const ToastCtx = createContext<(msg: string, kind?: Kind) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const y = useRef(new Animated.Value(-80)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg: string, kind: Kind = 'success') => {
    setToast({ msg, kind });
    if (timer.current) clearTimeout(timer.current);
    Animated.spring(y, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
    timer.current = setTimeout(() => {
      Animated.timing(y, { toValue: -80, duration: 220, useNativeDriver: true }).start(() => setToast(null));
    }, 2600);
  }, [y]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const Icon = toast?.kind === 'error' ? XCircle : toast?.kind === 'info' ? Info : CheckCircle2;
  const tint = toast?.kind === 'error' ? colors.danger : toast?.kind === 'info' ? colors.info : colors.green;

  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && (
        <Animated.View pointerEvents="none" style={[styles.wrap, { transform: [{ translateY: y }] }]}>
          <View style={[styles.toast, { borderLeftColor: tint }]}>
            <Icon size={18} color={tint} />
            <Text style={styles.text} numberOfLines={2}>{toast.msg}</Text>
          </View>
        </Animated.View>
      )}
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 52, left: spacing.lg, right: spacing.lg, zIndex: 999 },
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface,
    borderRadius: radius.md, paddingVertical: 13, paddingHorizontal: 14, borderLeftWidth: 4, ...shadow.raised,
  },
  text: { flex: 1, color: colors.ink, fontSize: 13.5, fontWeight: '600' },
});
