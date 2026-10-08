import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

/** Entrance animation built on RN Animated so no native reanimated setup is required. */
export function FadeIn({
  children, delay = 0, from = 14, duration = 380, style,
}: { children: React.ReactNode; delay?: number; from?: number; duration?: number; style?: ViewStyle }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration, delay, useNativeDriver: true }).start();
  }, [v, delay, duration]);
  return (
    <Animated.View
      style={[
        style,
        { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function Press({
  children, onPress, style, disabled,
}: { children: React.ReactNode; onPress?: () => void; style?: ViewStyle; disabled?: boolean }) {
  const s = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[style, { transform: [{ scale: s }] }]}>
      <Animated.View
        onTouchStart={() => Animated.spring(s, { toValue: 0.97, useNativeDriver: true, speed: 40 }).start()}
        onTouchEnd={() => Animated.spring(s, { toValue: 1, useNativeDriver: true, speed: 40 }).start()}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}
