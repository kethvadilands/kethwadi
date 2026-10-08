import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Landmark, ShieldCheck, ShoppingBasket, User } from 'lucide-react-native';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: Platform.OS === 'android' ? 62 : 84,
          paddingBottom: Platform.OS === 'android' ? 9 : 26,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.2 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Home size={21} color={color} /> }} />
      <Tabs.Screen name="lands" options={{ title: 'Lands', tabBarIcon: ({ color }) => <Landmark size={21} color={color} /> }} />
      <Tabs.Screen name="marketplace" options={{ title: 'Market', tabBarIcon: ({ color }) => <ShoppingBasket size={21} color={color} /> }} />
      <Tabs.Screen name="insurance" options={{ title: 'Insurance', tabBarIcon: ({ color }) => <ShieldCheck size={21} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <User size={21} color={color} /> }} />
    </Tabs>
  );
}
