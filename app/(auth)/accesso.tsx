import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { AuthError } from '../../src/auth/types';
import { isEmail } from '../../src/auth/validation';
import { AuthShell } from '../../src/components/AuthShell';
import { Field, FormError, SubmitButton } from '../../src/components/forms';
import { colors, space } from '../../src/theme';

export default function Accesso() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!isEmail(email)) { setError('Inserisci un indirizzo email valido.'); return; }
    if (!password) { setError('Inserisci la password.'); return; }
    setBusy(true);
    try { await signIn(email, password); }
    catch (e) { setError(e instanceof AuthError ? e.message : 'Accesso non riuscito. Riprova tra poco.'); }
    finally { setBusy(false); }
  };

  return (
    <AuthShell title="Accedi" subtitle="Entra nella community della Divisione Calcio a 5: risultati live, FUTSAL TV, eventi e la tua fan card.">
      <FormError text={error} />
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" placeholder="nome@esempio.it" />
      <Field label="Password" value={password} onChangeText={setPassword} secure autoComplete="password" textContentType="password" onSubmitEditing={submit} returnKeyType="go" />
      <Pressable onPress={() => router.push('/password')} hitSlop={8}>
        <Text style={{ color: colors.lime, fontWeight: '700', fontSize: 13, textAlign: 'right', marginBottom: space.m }}>Password dimenticata?</Text>
      </Pressable>
      <SubmitButton label="Accedi" onPress={submit} busy={busy} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: space.xl }}>
        <Text style={{ color: colors.muted, fontSize: 14 }}>Non hai un account?</Text>
        <Pressable onPress={() => router.push('/registrazione')} hitSlop={8}><Text style={{ color: colors.lime, fontWeight: '800', fontSize: 14 }}>Registrati</Text></Pressable>
      </View>
    </AuthShell>
  );
}
