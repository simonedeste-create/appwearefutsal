import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, space } from '../theme';

export function Field({ label, error, secure, ...props }: TextInputProps & { label: string; error?: string | null; secure?: boolean }) {
  const [hidden, setHidden] = useState(true);
  return (
    <View style={st.field}>
      <Text style={st.label}>{label}</Text>
      <View style={[st.inputWrap, error ? { borderColor: colors.live } : null]}>
        <TextInput
          placeholderTextColor={colors.muted}
          style={st.input}
          secureTextEntry={secure && hidden}
          autoCorrect={false}
          accessibilityLabel={label}
          {...props}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} accessibilityLabel={hidden ? 'Mostra password' : 'Nascondi password'}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={18} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={st.error}>{error}</Text> : null}
    </View>
  );
}

export function Check({ value, onChange, children }: { value: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <Pressable style={st.check} onPress={() => onChange(!value)} accessibilityRole="checkbox" accessibilityState={{ checked: value }}>
      <View style={[st.box, value && st.boxOn]}>{value ? <Ionicons name="checkmark" size={14} color={colors.onLime} /> : null}</View>
      <Text style={st.checkText}>{children}</Text>
    </Pressable>
  );
}

export function SubmitButton({ label, onPress, busy, disabled }: { label: string; onPress: () => void; busy?: boolean; disabled?: boolean }) {
  const off = disabled || busy;
  return (
    <Pressable onPress={onPress} disabled={off} style={[st.submit, off && { opacity: 0.5 }]} accessibilityRole="button" accessibilityState={{ disabled: off, busy }}>
      {busy ? <ActivityIndicator color={colors.onLime} /> : <Text style={st.submitText}>{label}</Text>}
    </Pressable>
  );
}

export function FormError({ text }: { text?: string | null }) {
  if (!text) return null;
  return <View style={st.formError} accessibilityRole="alert"><Ionicons name="alert-circle" size={16} color={colors.white} /><Text style={st.formErrorText}>{text}</Text></View>;
}

const st = StyleSheet.create({
  field: { marginBottom: space.m },
  label: { color: colors.muted, fontSize: 12, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.m, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14 },
  input: { flex: 1, color: colors.ink, fontSize: 16, paddingVertical: 13 },
  error: { color: colors.live, fontSize: 12, marginTop: 4 },
  check: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: space.m },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  checkText: { flex: 1, color: colors.ink, fontSize: 13, lineHeight: 19 },
  submit: { backgroundColor: colors.lime, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center', marginTop: space.s },
  submitText: { color: colors.onLime, fontSize: 15, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  formError: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.error, borderRadius: radius.m, padding: 12, marginBottom: space.m },
  formErrorText: { color: colors.white, fontSize: 13, flex: 1 },
});
