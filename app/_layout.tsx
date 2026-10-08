import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/store/AppStore';
import { ToastProvider } from '@/hooks/useToast';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ToastProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bone },
              animation: 'slide_from_right',
            }}
          />
        </ToastProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
