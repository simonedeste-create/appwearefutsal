import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/auth/AuthContext';
import { config } from '../src/config';
import { colors } from '../src/theme';

function Navigator() {
  const { user, ready } = useAuth();
  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.lime} /></View>;
  }
  // Con authMode 'required' tutta l'app è dietro l'accesso; negli altri casi resta aperta
  // e le singole aree (FUTSAL TV, profilo) chiedono il login quando serve.
  const appOpen = !!user || config.authMode !== 'required';
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
      <Stack.Protected guard={appOpen}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="partita/[id]" />
        <Stack.Screen name="giocatore/[id]" />
        <Stack.Screen name="squadra/[id]" />
        <Stack.Screen name="evento/[slug]" />
        <Stack.Screen name="news/[id]" />
        <Stack.Screen name="profilo" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <Navigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
