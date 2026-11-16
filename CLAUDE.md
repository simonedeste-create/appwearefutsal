# Note per chi lavora su questo repository

- App Expo (React Native) + TypeScript, Expo Router. Testi dell'interfaccia in italiano.
- Colori e tipografia solo da `src/theme.ts`; niente colori scritti a mano nelle schermate, salvo quelli dei moduli evento (`theme` dell'evento).
- Le schermate leggono i dati solo tramite `data` (`src/data/source.ts`), mai importando `mock.ts`.
- Nomi ufficiali: "Divisione Calcio a 5", "Serie A", "Serie A Femminile", "Serie A2 Elite", "Under 19 Femminile", "#WeAreFutsal", "FUTSAL TV".
- Sedi delle Finalissime sempre nell'ordine Barletta, Bisceglie, Giovinazzo.
- Dati di minorenni (Under 15/17/19): foto e dati personali solo con liberatoria; non pubblicare nulla di reale senza conferma.
- Prima di consegnare: `npm run typecheck`.
