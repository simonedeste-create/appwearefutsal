import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { AuthError } from '../../src/auth/types';
import { isEmail, needsParentalConsent, parseItalianDate, passwordProblem } from '../../src/auth/validation';
import { AuthShell } from '../../src/components/AuthShell';
import { Check, Field, FormError, SubmitButton } from '../../src/components/forms';
import { openUrl } from '../../src/components/ui';
import { config } from '../../src/config';
import { colors, space } from '../../src/theme';

export default function Registrazione() {
  const { signUp } = useAuth();
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', birth: '', password: '' });
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [partners, setPartners] = useState(false);
  const [parental, setParental] = useState(false);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (v: string) => setF((x) => ({ ...x, [k]: v }));

  const birthIso = parseItalianDate(f.birth);
  const minor = birthIso ? needsParentalConsent(birthIso) : false;
  const errors = {
    firstName: !f.firstName.trim() ? 'Campo obbligatorio' : null,
    lastName: !f.lastName.trim() ? 'Campo obbligatorio' : null,
    email: !isEmail(f.email) ? 'Email non valida' : null,
    birth: !birthIso ? 'Scrivi la data come GG/MM/AAAA' : null,
    password: passwordProblem(f.password),
  };
  const show = (k: keyof typeof errors) => (touched ? errors[k] : null);

  const submit = async () => {
    setTouched(true); setError(null);
    if (Object.values(errors).some(Boolean)) return;
    if (!privacy) { setError('Per registrarti devi accettare termini d’uso e informativa privacy.'); return; }
    if (minor && !parental) { setError('Per chi ha meno di 14 anni serve il consenso di un genitore.'); return; }
    setBusy(true);
    try {
      await signUp({ firstName: f.firstName, lastName: f.lastName, email: f.email, password: f.password, birthDate: birthIso!, marketing, partners, parental });
    } catch (e) { setError(e instanceof AuthError ? e.message : 'Registrazione non riuscita. Riprova tra poco.'); }
    finally { setBusy(false); }
  };

  return (
    <AuthShell title="Crea il tuo account" subtitle="Bastano pochi dati. Potrai scegliere le tue squadre e le notifiche subito dopo.">
      <FormError text={error} />
      <View style={{ flexDirection: 'row', gap: space.m }}>
        <View style={{ flex: 1 }}><Field label="Nome" value={f.firstName} onChangeText={set('firstName')} autoComplete="given-name" textContentType="givenName" error={show('firstName')} /></View>
        <View style={{ flex: 1 }}><Field label="Cognome" value={f.lastName} onChangeText={set('lastName')} autoComplete="family-name" textContentType="familyName" error={show('lastName')} /></View>
      </View>
      <Field label="Email" value={f.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" error={show('email')} />
      <Field label="Data di nascita" value={f.birth} onChangeText={set('birth')} placeholder="GG/MM/AAAA" keyboardType="numbers-and-punctuation" error={show('birth')} />
      <Field label="Password" value={f.password} onChangeText={set('password')} secure autoComplete="new-password" textContentType="newPassword" placeholder="Almeno 8 caratteri, lettere e numeri" error={show('password')} />

      <Check value={privacy} onChange={setPrivacy}>
        Accetto i <Text style={{ color: colors.lime }} onPress={() => openUrl(config.termsUrl)}>termini d’uso</Text> e ho letto l’<Text style={{ color: colors.lime }} onPress={() => openUrl(config.privacyUrl)}>informativa privacy</Text> (obbligatorio)
      </Check>
      {minor ? (
        <Check value={parental} onChange={setParental}>Ho meno di 14 anni e un genitore o tutore ha dato il consenso alla registrazione (obbligatorio)</Check>
      ) : null}
      <Check value={marketing} onChange={setMarketing}>Voglio ricevere news, offerte dello Shop e inviti agli eventi della Divisione (facoltativo)</Check>
      <Check value={partners} onChange={setPartners}>Acconsento alle comunicazioni dei partner della Divisione (facoltativo)</Check>

      <SubmitButton label="Registrati" onPress={submit} busy={busy} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: space.xl }}>
        <Text style={{ color: colors.muted, fontSize: 14 }}>Hai già un account?</Text>
        <Pressable onPress={() => router.back()} hitSlop={8}><Text style={{ color: colors.lime, fontWeight: '800', fontSize: 14 }}>Accedi</Text></Pressable>
      </View>
    </AuthShell>
  );
}
