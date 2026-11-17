// Conclusione dell'acquisto. L'app costruisce il carrello; il pagamento e l'ordine li gestisce lo shop ufficiale
// (shop.divisionecalcioa5.it). Per l'acquisto senza uscire dall'app serve che lo shop metta a disposizione le sue API
// (catalogo, carrello, pagamento): in quel caso basta un'altra implementazione di ShopBackend.
import { config } from './config';
import type { CartLine } from './data/types';

export interface ShopBackend {
  /** Avvia l'ordine e restituisce dove completare il pagamento. */
  checkout(lines: CartLine[]): Promise<{ url: string }>;
}

/** Versione attuale: il pagamento si completa sullo shop ufficiale, aperto dentro l'app. */
export const shopBackend: ShopBackend = {
  checkout: () => Promise.resolve({ url: config.shopUrl }),
};
