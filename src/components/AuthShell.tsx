import React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, space } from '../theme';

/** Cornice comune delle schermate di accesso: logo, titolo, sottotitolo e modulo. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={st.body} keyboardShouldPersistTaps="handled">
          <View style={st.brand}>
            <Image source={require('../../assets/logo-lnd-calcio-a-5-bianco.png')} style={st.logo} resizeMode="contain" accessibilityLabel="LND Calcio a 5" />
            <Text style={st.app}>We are <Text style={{ color: colors.lime }}>futsal</Text></Text>
          </View>
          <View style={st.tri}><View style={{ flex: 1, backgroundColor: colors.tricoloreVerde }} /><View style={{ flex: 1, backgroundColor: colors.white }} /><View style={{ flex: 1, backgroundColor: colors.tricoloreRosso }} /></View>
          <Text style={st.title}>{title}</Text>
          {subtitle ? <Text style={st.sub}>{subtitle}</Text> : null}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  body: { padding: space.xl, paddingTop: space.xxl, flexGrow: 1 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 64, height: 44 },
  app: { color: colors.white, fontSize: 24, fontWeight: '900', textTransform: 'uppercase' },
  tri: { flexDirection: 'row', width: 90, height: 5, marginTop: space.l, marginBottom: space.xl },
  title: { color: colors.white, fontSize: 30, fontWeight: '900', textTransform: 'uppercase', lineHeight: 32 },
  sub: { color: colors.muted, fontSize: 15, lineHeight: 21, marginTop: space.s, marginBottom: space.xl },
});
