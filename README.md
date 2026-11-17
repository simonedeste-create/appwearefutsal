# We are futsal – App ufficiale della Divisione Calcio a 5

App per iOS e Android della Divisione Calcio a 5 (LND – FIGC): campionati, match center, squadre e giocatori, FUTSAL TV, Shop e i grandi eventi della Divisione come moduli dedicati ("app nell'app": Finalissime Coppa Italia Puglia 2027, Torneo delle Regioni Marche 2027, Nazionale).

> **Stato: versione 0.1 di sviluppo.** Navigazione e schermate complete, con **dati di esempio** (squadre indicate con nomi di città, risultati e giocatori inventati). Le fonti reali vanno collegate come descritto più sotto.

## Tecnologia

- [Expo](https://expo.dev) (React Native) + TypeScript: un solo codice per iOS, Android e web.
- [Expo Router](https://docs.expo.dev/router/introduction/): navigazione basata sui file della cartella `app/`.
- Nessuna libreria esterna oltre a quelle di Expo.

## Avvio in locale

Servono Node.js 20+ e l'app **Expo Go** sul telefono (per le prove).

```bash
npm install
npx expo install --fix   # allinea le versioni dei pacchetti all'SDK Expo installato
npx expo start           # poi inquadra il QR code con Expo Go (Android) o con la Fotocamera (iPhone)
```

`npm run typecheck` controlla i tipi TypeScript.

> Le versioni in `package.json` puntano a Expo SDK 54. Se al momento dell'installazione è uscito un SDK più recente, aggiornare con `npx expo install expo@latest && npx expo install --fix`.

## Struttura

```
app/                      schermate (una per file, Expo Router)
  _layout.tsx             contenitore generale
  (tabs)/                 le 5 tab: index (Home), partite, tv, eventi, shop
  partita/[id].tsx        match center: punteggio, cronaca, formazioni, FUTSAL TV
  giocatore/[id].tsx      scheda giocatore con statistiche e dati VEO
  squadra/[id].tsx        scheda squadra: prossime gare, risultati, rosa
  evento/[slug].tsx       modulo evento (app nell'app)
  news/[id].tsx           articolo
  profilo.tsx             "Il mio futsal": fan card, squadre seguite, notifiche
src/
  theme.ts                colori e tipografia (stile Night Arena + colori Divisione)
  config.ts               indirizzi esterni: FUTSAL TV, Shop, sito, Vivaticket
  components/             componenti grafici condivisi (card, chip, badge LIVE, bottone FUTSAL TV…)
  data/types.ts           modello dati
  data/source.ts          interfaccia DataSource e sorgente attiva
  data/mock.ts            dati di esempio
assets/                   icona, splash, logo LND Calcio a 5
```

## Account, FUTSAL TV e social

**Registrazione e accesso.** Il comportamento si sceglie in `src/config.ts` con `authMode`:

| Valore | Cosa succede |
|---|---|
| `required` (attuale) | Tutta l'app è dietro registrazione/accesso. |
| `video` | Risultati, classifiche e news liberi; servono l'accesso per FUTSAL TV e per l'area personale. |
| `optional` | Accesso richiesto solo per l'area personale. |

Attenzione: la linea guida App Store 5.1.1(v) consente di rifiutare app che chiedono l'account per contenuti che non lo richiedono (risultati, news). Se Apple obietta, basta passare a `video`. La cancellazione dell'account dall'app ("Elimina account" nel profilo), obbligatoria per Apple, è già presente.

- Schermate: `app/(auth)/accesso.tsx`, `registrazione.tsx`, `password.tsx`. Il blocco è in `app/_layout.tsx` (`Stack.Protected`).
- Registrazione: nome, cognome, email, data di nascita, password (8+ caratteri, lettere e numeri), accettazione termini e privacy (obbligatoria), consensi marketing e partner separati e facoltativi. Sotto i 14 anni (età del consenso digitale in Italia) serve la conferma del consenso del genitore.
- `src/auth/localBackend.ts` salva gli account **solo sul dispositivo**, per sviluppo. In produzione va sostituito con un servizio vero (es. Firebase Authentication o il sistema di identità della LND) che implementi `AuthBackend` in `src/auth/types.ts`: email di conferma, recupero password, cancellazione lato server.
- Testi di informativa privacy e termini d'uso: bozze in `docs/legale/` (informativa, termini, testi brevi per consensi e notifiche), da validare con l'ufficio legale (URL in `config.privacyUrl` e `config.termsUrl`).

**FUTSAL TV.** Nuova schermata con: diretta in corso (con collegamento al match center), "Prossime dirette" con promemoria, video on demand filtrabili per tipo (highlights, gare integrali, rubriche) e campionato, collegamenti a futsaltv.it e al canale YouTube della Divisione. Ogni partita ha l'indicazione di dove si vede (`broadcast`: FUTSAL TV, YouTube della Divisione o Sky Sport). I video si aprono nel browser integrato (`expo-web-browser`, `config.futsalTv.openInApp`). Con le API della piattaforma FUTSAL TV si potrà passare al player nativo.

**Social.** Componente `SocialLinks` in Home, FUTSAL TV e profilo, alimentato da `config.social`. Profili ufficiali: Instagram @divisionecalcio5 e Facebook /DivisioneCalcioacinque; per aggiungere TikTok o altri canali basta una riga in `config.social`.

## Funzioni per i tifosi (da benchmark)

- **Voto all'MVP** a fine gara (idea da myPremierLeague e dal "man of the match" richiesto dai fan della Bundesliga).
- **Aggiungi al calendario** e **Condividi** la partita.
- Il voto resta sul dispositivo (`src/fan.ts`); con il backend diventerà un voto unico per utente.

## Ricerca, comunicati, partner e notifiche

- **Ricerca** (icona in Home): squadre, giocatori, news e comunicati (`data.search`).
- **Comunicati ufficiali**: giudice sportivo, designazioni arbitrali, calendari, con link al PDF ufficiale; fonte prevista il sito della Divisione.
- **Partner**: elenco 2026/27 principali e secondari; loghi, link e offerte da confermare con l'ufficio marketing.
- **Notifiche live score** (`src/notifications.ts`, `src/push.ts`, schermata Notifiche): scelta per le squadre seguite o per tutte le partite, eventi (inizio, gol, intervallo, rossi, finale) e campanella per singola partita. L'app chiede il permesso e registra il token con `pushBackend`; **l'invio a ogni gol lo fa il backend**, che deve ricevere gli eventi live (TuttoCampo o l'area staff). Le push non funzionano in Expo Go su Android né sul web: servono una build di sviluppo e un progetto EAS. Aggiunto `expo-notifications`: eseguire `npm install` e `npx expo install --fix`.

## Shop

Catalogo, scheda prodotto e carrello sono nell'app; il pagamento si completa sullo shop ufficiale (`config.shopUrl`, https://shop.divisionecalcioa5.it) aperto dentro l'app. Per acquistare senza uscire dall'app serve che lo shop metta a disposizione le sue API: basta un'altra implementazione di `ShopBackend` in `src/shop.ts`. Catalogo e prezzi in `mock.ts` sono di esempio.

## Collegare i dati reali

Le schermate leggono i dati **solo** tramite `data` in `src/data/source.ts`, che implementa l'interfaccia `DataSource`. Per passare ai dati reali si scrive una nuova implementazione e la si assegna a `data`, senza toccare le schermate.

| Dato | Fonte prevista |
|---|---|
| Calendari, risultati, classifiche | TuttoCampo (accesso richiesto) |
| News e comunicati | sito divisionecalcioa5.it |
| Punteggi live, cronaca, statistiche | backend dell'app (area staff), import VEO |
| Video | FUTSAL TV (link per gara, eventuale feed) |
| Prodotti | Shop della Divisione |
| Biglietti | Vivaticket |

## Architettura, requisiti tecnici e fasi

Vedi [`docs/ARCHITETTURA.md`](docs/ARCHITETTURA.md): API intermedia, cache offline, prestazioni, temi chiaro/scuro, accessibilità, privacy e stima delle fasi (MVP, beta, store).

## Prossime fasi

1. **Backend** (consigliato Firebase): database in tempo reale, accesso staff con ruoli, archivio immagini, notifiche push (Expo Notifications + FCM/APNs).
2. **Area staff**: inserimento live dei risultati e import delle statistiche VEO, come nel prototipo web del Torneo delle Regioni.
3. **Account utente e fan card**: squadre seguite e preferenze salvate, punti e biglietti.
4. **Modulo Torneo delle Regioni** completo (programma, classifiche, schede giocatore) e modulo Finalissime con il tabellone.
5. **Pubblicazione** con EAS Build/Submit (`eas.json` già presente) sugli account Apple Developer e Google Play intestati a LND.

## Da completare prima della pubblicazione

- `bundleIdentifier` / `package` in `app.json` (oggi `it.lnd.wearefutsal`, da confermare).
- Indirizzo dello Shop in `src/config.ts`.
- Nomi ufficiali degli impianti delle Finalissime in `src/data/mock.ts` (da verificare).
- Icona e splash definitivi dal grafico della Divisione; logo #WeAreFutsal ufficiale.
- Informativa privacy e termini; liberatorie per foto e dati dei minorenni.

## Grafica

Riferimento: design system "Divisione Calcio a 5" (Reflex Blue `#001489`, blu elettrico, oro per lo Shop, rosa per i campionati femminili) con lo stile "Night Arena" scelto per l'app (navy `#050B2E`, lime `#C6FF3D`). I token sono in `src/theme.ts`.
