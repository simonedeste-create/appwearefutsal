import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { colors } from '../../src/theme';

type IconName = keyof typeof Ionicons.glyphMap;
const icon = (name: IconName) => ({ color, size }: { color: string; size: number }) => <Ionicons name={name} color={color} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: '#6F7BB3',
        tabBarStyle: { backgroundColor: colors.bgTab, borderTopColor: colors.line },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home-outline') }} />
      <Tabs.Screen name="partite" options={{ title: 'Partite', tabBarIcon: icon('football-outline') }} />
      <Tabs.Screen name="tv" options={{ title: 'FUTSAL TV', tabBarIcon: icon('tv-outline') }} />
      <Tabs.Screen name="eventi" options={{ title: 'Eventi', tabBarIcon: icon('star-outline') }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop', tabBarIcon: icon('bag-handle-outline') }} />
    </Tabs>
  );
}
