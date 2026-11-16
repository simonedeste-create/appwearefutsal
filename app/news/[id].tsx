import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { Card, Empty, Loading, Screen } from '../../src/components/ui';
import { data } from '../../src/data/source';
import { useData } from '../../src/data/useData';
import { colors, space, type } from '../../src/theme';

export default function News() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useData(() => data.newsItem(String(id)), [id]);
  if (item.loading) return <Screen back title="News"><Loading /></Screen>;
  const n = item.value;
  if (!n) return <Screen back title="News"><Empty text="News non trovata" /></Screen>;
  return (
    <Screen back title="News">
      <View style={{ backgroundColor: colors.reflexBlue, borderRadius: 20, padding: space.l, minHeight: 120, justifyContent: 'flex-end' }}>
        <Text style={[type.label, { color: colors.lime }]}>{n.tag}</Text>
      </View>
      <Text style={{ color: colors.white, fontSize: 24, fontWeight: '800', marginTop: space.l }}>{n.title}</Text>
      <Text style={{ color: colors.muted, fontSize: 12, marginVertical: space.s }}>
        {new Date(n.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
      </Text>
      <Card style={{ padding: space.l }}><Text style={{ color: colors.ink, fontSize: 16, lineHeight: 24 }}>{n.body}</Text></Card>
    </Screen>
  );
}
