import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { THEME } from '../config/theme';
import TabNavigator from './TabNavigator';
import {
  WelcomeScreen,
  ResultScreen,
  ReportScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: THEME.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          headerShown: true,
          title: 'Analysis Result',
          headerStyle: { backgroundColor: THEME.colors.surface },
          headerTintColor: THEME.colors.textPrimary,
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
        }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          headerShown: true,
          title: 'Full Audit Report',
          headerStyle: { backgroundColor: THEME.colors.surface },
          headerTintColor: THEME.colors.textPrimary,
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
        }}
      />
    </Stack.Navigator>
  );
}

