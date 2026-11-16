import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { AuthError } from '../../src/auth/types';
import { AuthShell } from '../../src/components/AuthShell';
import { Field, FormError, SubmitButton } from '../../src/components/forms';
import { Card } from '../../src/components/ui';
import { colors, space } from '../../src/theme';

export default function RecuperoPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null); setBusy(true);
    try { await resetPassword(email); setSent(true); }
    catch (e) { setError(e instanceof AuthError ? e.message : 'Richiesta non riuscita. Riprova tra poco.'); }
    finally { setBusy(false); }
  };

  return (
    <AuthShell title="Recupera la password" subtitle="Inserisci l’email con cui ti sei registrato: ti invieremo un link per sceglierne una nuova.">
      {sent ? (
        <Card style={{ padding: space.l }}>
          <Text style={{ color: colors.ink, fontSize: 15, lineHeight: 22 }}>Se l’indirizzo è registrato, riceverai a breve un’email con le istruzioni. Controlla anche la cartella spam.</Text>
        </Card>
      ) : (
        <>
          <FormError text={error} />
          <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <SubmitButton label="Invia il link" onPress={submit} busy={busy} />
        </>
      )}
      <Pressable onPress={() => router.back()} hitSlop={8} style={{ marginTop: space.xl, alignSelf: 'center' }}>
        <Text style={{ color: colors.lime, fontWeight: '800' }}>Torna all’accesso</Text>
      </Pressable>
    </AuthShell>
  );
}
