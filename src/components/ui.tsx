import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { config } from '../config';
import { colors, radius, space, type } from '../theme';

export const openUrl = (url?: string) => { if (url) Linking.openURL(url).catch(() => undefined); };

export function Screen({ children, title, back, right, scroll = true }: {
  children: React.ReactNode; title?: string; back?: boolean; right?: React.ReactNode; scroll?: boolean;
}) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        {back ? (
          <IconButton name="chevron-back" onPress={() => router.back()} label="Indietro" />
        ) : (
          <Image source={require('../../assets/logo-lnd-calcio-a-5-bianco.png')} style={s.logo} resizeMode="contain" accessibilityLabel="LND Calcio a 5" />
        )}
        {title ? <Text style={s.title} numberOfLines={1}>{title}</Text> : (
          <Text style={s.title}>We are <Text style={{ color: colors.lime }}>futsal</Text></Text>
        )}
        {right}
      </View>
      <Body style={{ flex: 1 }} contentContainerStyle={scroll ? s.body : undefined}>
        {children}
        {scroll && config.demoData ? <Text style={s.demo}>Dati di esempio · versione di sviluppo</Text> : null}
      </Body>
    </SafeAreaView>
  );
}

export function IconButton({ name, onPress, label }: { name: keyof typeof Ionicons.glyphMap; onPress?: () => void; label: string }) {
  return (
    <Pressable onPress={onPress} style={s.iconBtn} accessibilityRole="button" accessibilityLabel={label} hitSlop={8}>
      <Ionicons name={name} size={18} color={colors.ink} />
    </Pressable>
  );
}

export function Section({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={s.section}>
      <Text style={[type.title, { color: colors.ink }]}>{title}</Text>
      {action ? <Pressable onPress={onAction} hitSlop={8}><Text style={s.sectionAction}>{action} ›</Text></Pressable> : null}
    </View>
  );
}

export function Card({ children, style, onPress }: { children: React.ReactNode; style?: ViewStyle; onPress?: () => void }) {
  if (onPress) return <Pressable onPress={onPress} style={({ pressed }: { pressed: boolean }) => [s.card, style, pressed && { opacity: 0.8 }]}>{children}</Pressable>;
  return <View style={[s.card, style]}>{children}</View>;
}

export function Chips<T extends string>({ items, value, onChange }: { items: { id: T; label: string; color?: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.s, paddingVertical: space.xs }}>
      {items.map((it) => {
        const on = it.id === value;
        return (
          <Pressable key={it.id} onPress={() => onChange(it.id)} style={[s.chip, on && s.chipOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
            <Text style={[s.chipText, it.color && !on ? { color: it.color } : null, on && { color: colors.onLime }]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function Crest({ short, color, size = 30 }: { short: string; color: string; size?: number }) {
  return (
    <View style={[s.crest, { width: size, height: size, borderRadius: size * 0.3, backgroundColor: color }]}>
      <Text style={[s.crestText, { fontSize: size * 0.33 }]}>{short}</Text>
    </View>
  );
}

export function LiveBadge({ clock }: { clock?: string }) {
  return (
    <View style={s.live}><View style={s.liveDot} /><Text style={s.liveText}>LIVE{clock ? ` ${clock}` : ''}</Text></View>
  );
}

export function FutsalTvButton({ url, label }: { url?: string; label?: 'LIVE' | 'REPLAY' }) {
  return (
    <Pressable onPress={() => openUrl(url ?? config.futsalTvUrl)} style={s.ftv} accessibilityRole="link" accessibilityLabel="Guarda su FUTSAL TV">
      <View style={s.ftvPlay}><Ionicons name="play" size={9} color={colors.white} /></View>
      <Text style={s.ftvText}>FUTSAL<Text style={{ color: colors.live }}>TV</Text></Text>
      {label ? <View style={s.ftvLabel}><Text style={s.ftvLabelText}>{label}</Text></View> : null}
    </Pressable>
  );
}

export function PillButton({ label, icon, onPress, variant = 'lime' }: {
  label: string; icon?: keyof typeof Ionicons.glyphMap; onPress?: () => void; variant?: 'lime' | 'live' | 'ghost' | 'oro';
}) {
  const bg = { lime: colors.lime, live: colors.live, ghost: 'rgba(255,255,255,0.14)', oro: 'transparent' }[variant];
  const fg = variant === 'lime' ? colors.onLime : variant === 'oro' ? colors.oro : colors.white;
  return (
    <Pressable onPress={onPress} style={[s.pill, { backgroundColor: bg }, variant === 'oro' && { borderWidth: 1.5, borderColor: colors.oro }]} accessibilityRole="button">
      {icon ? <Ionicons name={icon} size={15} color={fg} /> : null}
      <Text style={[s.pillText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Loading() {
  return <View style={{ padding: space.xxl }}><ActivityIndicator color={colors.lime} /></View>;
}

export function Empty({ text }: { text: string }) {
  return <Card style={{ padding: space.xl, alignItems: 'center' }}><Text style={{ color: colors.muted, textAlign: 'center' }}>{text}</Text></Card>;
}

export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.m - 2, paddingHorizontal: space.l + 2, paddingVertical: space.s },
  logo: { width: 44, height: 30 },
  title: { flex: 1, color: colors.ink, fontSize: 20, fontWeight: '900', letterSpacing: 0.5, textTransform: 'uppercase' },
  body: { paddingHorizontal: space.l, paddingBottom: space.xxl },
  demo: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: space.xl, opacity: 0.7 },
  iconBtn: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.l + 2, marginBottom: space.s + 1, marginHorizontal: 2 },
  sectionAction: { color: colors.lime, fontSize: 12, fontWeight: '600' },
  card: { backgroundColor: colors.card, borderRadius: radius.l },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.lime },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  crest: { alignItems: 'center', justifyContent: 'center' },
  crestText: { color: colors.white, fontWeight: '800' },
  live: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.live, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  liveText: { color: colors.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  ftv: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#000', borderColor: '#333', borderWidth: 1, borderRadius: 7, paddingVertical: 3, paddingLeft: 3, paddingRight: 7 },
  ftvPlay: { width: 15, height: 15, borderRadius: 4, backgroundColor: colors.live, alignItems: 'center', justifyContent: 'center' },
  ftvText: { color: colors.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  ftvLabel: { backgroundColor: colors.live, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1 },
  ftvLabelText: { color: colors.white, fontSize: 9, fontWeight: '800' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start' },
  pillText: { fontSize: 12, fontWeight: '800' },
});
