import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './navigation/RootNavigator';
import { THEME } from './config/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: THEME.colors.primary,
            background: THEME.colors.background,
            card: THEME.colors.surface,
            text: THEME.colors.textPrimary,
            border: THEME.colors.surfaceBorder,
            notification: THEME.colors.secondary,
          },
        }}
      >
        <StatusBar style="light" backgroundColor={THEME.colors.background} />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

