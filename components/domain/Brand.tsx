import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Sprout } from 'lucide-react-native';
import { colors } from '@/constants/theme';

export function Logo({ size = 34, tone = 'dark', showTag }: {
  size?: number; tone?: 'dark' | 'light'; showTag?: boolean;
}) {
  const fg = tone === 'light' ? '#FFFFFF' : colors.forest;
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Text style={[styles.word, { fontSize: size, color: fg }]}>KETHWAD</Text>
        <View>
          <Text style={[styles.word, { fontSize: size, color: fg }]}>I</Text>
          <Sprout
            size={size * 0.52}
            color={colors.leaf}
            style={{ position: 'absolute', top: -size * 0.34, left: -size * 0.06 }}
          />
        </View>
      </View>
      {showTag ? (
        <Text style={[styles.tag, { color: tone === 'light' ? 'rgba(255,255,255,0.75)' : colors.muted }]}>
          Cultivating Prosperity, Together.
        </Text>
      ) : null}
    </View>
  );
}

export function Avatar({ seed, size = 42, style }: { seed: string; size?: number; style?: ViewStyle }) {
  return (
    <View style={[{
      width: size, height: size, borderRadius: size / 2, backgroundColor: colors.leafSoft,
      alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#CFE6DA',
    }, style]}>
      <Text style={{ color: colors.green, fontWeight: '800', fontSize: size * 0.36 }}>{seed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  word: { fontWeight: '900', letterSpacing: -1.2 },
  tag: { fontSize: 11, letterSpacing: 0.4, marginTop: 4, fontStyle: 'italic' },
});
