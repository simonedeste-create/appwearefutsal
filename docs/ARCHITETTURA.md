# App #WeAreFutsal – Architettura, requisiti tecnici e fasi

Documento per gli sviluppatori. Le stime sono ordini di grandezza da far confermare dal team che realizza il progetto.

## 1. Scelte già fatte

- **App:** React Native con Expo (SDK 54), TypeScript, Expo Router. iOS e Android da un solo codice. Flutter è stato valutato e non è previsto.
- **Pubblico:** tifosi e giocatori. Nessuna area riservata alle società.
- **Navigazione:** Home, Partite, FUTSAL TV, Shop, Altro (profilo, comunicati, partner, ricerca, notifiche).
- **Nomi ufficiali:** "Divisione Calcio a 5", "Serie A", "Serie A Femminile", "Serie A2 Elite", "Under 19 Femminile", "#WeAreFutsal", "FUTSAL TV". Le sedi delle Finalissime Coppa Italia sono sempre Barletta, Bisceglie, Giovinazzo.
- **Dati:** le schermate leggono solo tramite `data` (`src/data/source.ts`). Per passare ai dati reali si sostituisce l'implementazione, non le schermate.

## 2. Architettura proposta

```
App (iOS/Android)
   │  REST/JSON (OpenAPI), HTTPS
   ▼
CDN + cache (classifiche, calendari, news: TTL brevi)
   ▼
API intermedia (Node.js + TypeScript)
   ├── PostgreSQL  (squadre, giocatori, gare, classifiche, utenti, preferenze)
   ├── Redis       (cache, code, stato delle gare live)
   ├── Servizio notifiche (code → Expo Push / FCM / APNs)
   ├── Import dati: TuttoCampo, sito della Divisione (news, comunicati), VEO
   └── Area staff (web): live, news, moduli evento, prodotti, notifiche
Servizi esterni: FUTSAL TV (video), Shop (catalogo e pagamento), Vivaticket (biglietti)
```

**Perché un'API intermedia e non il collegamento diretto alle fonti:** l'app non dipende dai tempi e dai limiti di TuttoCampo e del sito, i picchi del weekend sono assorbiti dalla cache, e i dati si possono correggere dallo staff.

**Alternativa per l'MVP:** Firebase (Firestore, Auth, Cloud Functions, FCM) è più rapido da avviare. Ha costi meno prevedibili con molte letture nei weekend e rende più scomodo importare dati da più fonti. La scelta va fatta con gli sviluppatori. In ogni caso i server vanno in area UE.

### Dati live

- Gli eventi (gol, falli, cartellini, tempi) entrano da TuttoCampo se offre un feed, altrimenti dall'area staff.
- L'app aggiorna il match center con polling ogni 10-15 secondi, o con SSE/WebSocket se il volume lo giustifica.
- Ogni evento genera notifiche in coda verso gli utenti che seguono la squadra o la partita. L'invio non passa mai dall'app.

### Funzionamento senza rete (palazzetti)

- Cache locale di classifiche, calendari, rose e ultime news (React Query con persistenza su disco).
- Ultimo aggiornamento sempre visibile ("Aggiornato alle 18:42"). Senza rete l'app mostra i dati salvati e lo dice.
- Video, shop e biglietti richiedono la rete: l'app lo segnala invece di restare bianca.

### Prestazioni nei weekend

- Risposte cacheabili sulla CDN con TTL di 10-30 secondi per i dati live e di alcuni minuti per classifiche e news.
- Notifiche in coda con invii a blocchi, mai in un'unica chiamata sincrona.
- Prova di carico prima del rilascio, con un obiettivo da concordare (utenti simultanei in una giornata di Serie A e nelle Finalissime).
- Avvio a freddo dell'app sotto i 2 secondi su un telefono di fascia media; liste virtualizzate; immagini ridimensionate dal server.

## 3. Grafica e temi

- Due temi, chiaro e scuro, dagli stessi token del design system "Divisione Calcio a 5". Oggi `src/theme.ts` contiene solo "Night Arena" (scuro). L'ipotesi 2 "Stadio Blu" è un tema chiaro: la scelta tra le due si fa prima di scrivere il secondo tema.
- Tema che segue le impostazioni del telefono, con possibilità di forzarlo dal profilo.
- Nessun colore scritto a mano nelle schermate: solo token.

## 4. Accessibilità (WCAG 2.1 AA)

- Contrasto del testo almeno 4,5:1 (3:1 sopra i 24 px). Il design system indica già dove l'oro e il rosa non si possono usare su bianco.
- Etichette per VoiceOver e TalkBack su icone, pulsanti e punteggi ("Pesaro 2, Verona 1, 12° minuto").
- Zone toccabili di almeno 44×44 px; testo che segue la dimensione scelta nel telefono.
- Il colore non è mai l'unico segnale (gol, cartellini, stato live).
- Video con sottotitoli se la piattaforma li fornisce.
- Test con lettore di schermo su un telefono reale prima della beta.

## 5. Privacy (GDPR)

- Titolare del trattamento, informativa e termini validati da un legale (i testi attuali sono segnaposto).
- Consensi separati per notifiche, comunicazioni commerciali e profilazione.
- Minori: sotto i 14 anni consenso del genitore; foto e dati di Under 15/17/19 solo con liberatoria.
- Cancellazione dell'account dall'app (richiesta anche da Apple) ed esportazione dei dati.
- Dati personali in area UE, contratti di nomina con i fornitori (hosting, notifiche, statistiche).
- Chiavi e token nell'archivio sicuro del telefono; nessun dato personale nei log.
- Rischio aperto: Apple 5.1.1(v) può contestare il login obbligatorio; in quel caso `authMode` passa a `video` (login solo per i contenuti che lo richiedono).

## 6. API e sicurezza

- REST con specifica OpenAPI, versione nel percorso (`/v1`), paginazione e `ETag` per le liste.
- Autenticazione con token a scadenza breve e rinnovo; ruoli per l'area staff.
- Limite di richieste per utente e per indirizzo; registro delle azioni dello staff.
- Ambienti separati: sviluppo, collaudo, produzione.

## 7. Fasi e stime

Ipotesi di squadra: 1 sviluppatore mobile, 1 sviluppatore backend, 0,5 grafico/UX, 0,5 collaudo. Le settimane sono di calendario.

| Fase | Contenuto | Durata |
|---|---|---|
| 0. Prerequisiti | Accessi a TuttoCampo e sito, indirizzi FUTSAL TV, accordo con lo Shop, account Apple e Google intestati a LND, testi legali | 2-4 settimane, in parallelo alle altre |
| 1. MVP | API e import dati, cache offline, login e profilo, classifiche, calendari, match center, news e comunicati, FUTSAL TV, notifiche di inizio e gol, due temi, area staff minima | 8-10 settimane |
| 2. Beta | TestFlight e test chiuso su Google Play con società e tifosi invitati; prova di carico; test di accessibilità; correzioni | 3-4 settimane |
| 3. Rilascio | Schede store, revisione Apple e Google, eventuali richieste di modifica, rilascio graduale | 2 settimane |
| 4. Dopo il rilascio | Shop con acquisto integrato, biglietti, statistiche e confronto, back-office completo | da pianificare |

Totale indicativo: 4-5 mesi dall'avvio. I tempi dipendono più dagli accessi ai dati (fase 0) che dallo sviluppo.

## 8. Cosa serve da altri

Vedi la tabella "Collegare i dati reali" nel `README.md` e il documento di progetto: TuttoCampo (dati, identificativi, feed live), sito (news, comunicati, privacy), FUTSAL TV (indirizzi, player), Shop (catalogo e API di pagamento), Vivaticket (biglietti), partner (loghi e offerte).
