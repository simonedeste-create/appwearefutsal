import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Chips, Empty, Loading, PillButton, Screen, openInApp } from '../src/components/ui';
import { data } from '../src/data/source';
import type { CommuniqueKind } from '../src/data/types';
import { useData } from '../src/data/useData';
import { colors, space, type } from '../src/theme';

const KINDS: ('Tutti' | CommuniqueKind)[] = ['Tutti', 'Giudice sportivo', 'Comunicato ufficiale', 'Designazioni arbitrali', 'Calendari'];
const day = (iso: string) => new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Comunicati() {
  const [kind, setKind] = useState<'Tutti' | CommuniqueKind>('Tutti');
  const [open, setOpen] = useState<string | undefined>(undefined);
  const list = useData(() => data.communiques(kind === 'Tutti' ? {} : { kind }), [kind]);
  return (
    <Screen back title="Comunicati ufficiali">
      <Chips items={KINDS.map((k) => ({ id: k, label: k }))} value={kind} onChange={setKind} />
      {list.loading ? <Loading /> : null}
      {!list.loading && !list.value?.length ? <Empty text="Nessun comunicato." /> : null}
      <View style={{ gap: space.s, marginTop: space.s }}>
        {(list.value ?? []).map((c) => {
          const on = open === c.id;
          return (
            <Card key={c.id} style={{ padding: 14 }} onPress={() => setOpen(on ? undefined : c.id)}>
              <Text style={[type.label, { color: colors.oro }]}>{c.kind} · {day(c.date)}</Text>
              <Text style={st.title}>{c.title}</Text>
              {on ? (
                <>
                  <Text style={st.body}>{c.body}</Text>
                  <View style={{ marginTop: space.m }}>
                    {c.pdfUrl ? <PillButton label="Apri il comunicato (PDF)" icon="document-text-outline" variant="oro" onPress={() => openInApp(c.pdfUrl)} />
                      : <Text style={st.hint}>Il PDF ufficiale sarà collegato alla pubblicazione sul sito della Divisione.</Text>}
                  </View>
                </>
              ) : <Pressable accessibilityRole="button" onPress={() => setOpen(c.id)}><Text style={st.more}>Leggi ›</Text></Pressable>}
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  title: { color: colors.ink, fontSize: 15, fontWeight: '800', marginTop: 4 },
  body: { color: colors.ink, fontSize: 13.5, marginTop: space.s, lineHeight: 19 },
  more: { color: colors.oro, fontSize: 12, fontWeight: '800', marginTop: 6 },
  hint: { color: colors.muted, fontSize: 12 },
});
