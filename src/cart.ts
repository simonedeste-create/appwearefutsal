// Carrello dello Shop. Resta sul dispositivo; l'ordine si conclude sullo shop ufficiale (vedi src/shop.ts).
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import type { CartLine } from './data/types';

const KEY = 'waf_cart_v1';
let lines: CartLine[] = [];
let loaded = false;
const listeners = new Set<(l: CartLine[]) => void>();

function commit(next: CartLine[]) {
  lines = next;
  SecureStore.setItemAsync(KEY, JSON.stringify(next)).catch(() => undefined);
  listeners.forEach((f) => f(lines));
}
const same = (a: CartLine, b: CartLine) => a.productId === b.productId && a.size === b.size;

export const cart = {
  add(line: CartLine) {
    const hit = lines.find((l) => same(l, line));
    commit(hit ? lines.map((l) => (same(l, line) ? { ...l, qty: l.qty + line.qty } : l)) : [...lines, line]);
  },
  setQty(line: CartLine, qty: number) {
    commit(qty <= 0 ? lines.filter((l) => !same(l, line)) : lines.map((l) => (same(l, line) ? { ...l, qty } : l)));
  },
  clear() { commit([]); },
};

export function useCart() {
  const [state, setState] = useState<CartLine[]>(lines);
  useEffect(() => {
    listeners.add(setState);
    if (!loaded) {
      loaded = true;
      SecureStore.getItemAsync(KEY).then((v) => { if (v) { lines = JSON.parse(v) as CartLine[]; listeners.forEach((f) => f(lines)); } }).catch(() => undefined);
    } else setState(lines);
    return () => { listeners.delete(setState); };
  }, []);
  return { lines: state, count: state.reduce((n, l) => n + l.qty, 0) };
}

export const euro = (cents: number) => `${(cents / 100).toFixed(2).replace('.', ',')} €`;
