import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Logo } from '@/components/domain';
import { useApp } from '@/store/AppStore';
import { colors, gradients } from '@/constants/theme';

export default function Splash() {
  const { hydrated, onboarded, user } = useApp();
  const grow = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(grow, { toValue: 1, duration: 1100, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, [fade, grow]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      if (!onboarded) router.replace('/onboarding');
      else if (!user) router.replace('/(auth)/login');
      else router.replace('/(tabs)');
    }, 1500);
    return () => clearTimeout(t);
  }, [hydrated, onboarded, user]);

  return (
    <LinearGradient colors={gradients.hero} style={styles.wrap}>
      <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
        <Logo size={40} tone="light" showTag />
      </Animated.View>

      {/* Signature: a seed line that grows into a field row as the app loads */}
      <View style={styles.growWrap}>
        <Animated.View
          style={[styles.growBar, { width: grow.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
        />
      </View>
      <Text style={styles.foot}>Smart Agriculture & Land Leasing</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  growWrap: { width: 168, height: 3, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 2, marginTop: 40, overflow: 'hidden' },
  growBar: { height: 3, backgroundColor: colors.gold, borderRadius: 2 },
  foot: { position: 'absolute', bottom: 44, color: 'rgba(255,255,255,0.55)', fontSize: 11, letterSpacing: 1.6, fontWeight: '700', textTransform: 'uppercase' },
});
