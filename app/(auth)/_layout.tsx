import { Stack } from 'expo-router';
import React from 'react';
import { colors } from '../../src/theme';

export const unstable_settings = { initialRouteName: 'accesso' };

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'fade' }} />;
}
