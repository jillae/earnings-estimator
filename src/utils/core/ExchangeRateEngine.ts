/**
 * Centraliserad valutakurs-hantering
 */

import { DEFAULT_EXCHANGE_RATE } from '../constants';

export class ExchangeRateEngine {
  private static cachedRate: number | null = null;
  private static lastFetchTime: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minuter

  /**
   * Hämtar aktuell valutakurs med cache
   */
  static async getRate(): Promise<number> {
    const now = Date.now();
    
    // Använd cache om den är färsk
    if (this.cachedRate && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      return this.cachedRate;
    }

    try {
      // Försök hämta från API (platshållare för framtida implementation)
      const rate = await this.fetchFromAPI();
      
      this.cachedRate = rate;
      this.lastFetchTime = now;
      
      return rate;
    } catch (error) {
      console.warn('Failed to fetch exchange rate, using default:', error);
      
      // Fallback till default
      this.cachedRate = DEFAULT_EXCHANGE_RATE;
      this.lastFetchTime = now;
      
      return DEFAULT_EXCHANGE_RATE;
    }
  }

  /**
   * Tvingar uppdatering av valutakurs
   */
  static async forceRefresh(): Promise<number> {
    this.cachedRate = null;
    this.lastFetchTime = 0;
    return this.getRate();
  }

  /**
   * Hämtar valutakurs från API
   */
  private static async fetchFromAPI(): Promise<number> {
    // TODO: Implementera riktig API-anrop
    // För nu returnerar vi bara default-värdet
    return DEFAULT_EXCHANGE_RATE;
  }

  /**
   * Konverterar EUR till SEK
   */
  static async convertEurToSek(eurAmount: number): Promise<number> {
    const rate = await this.getRate();
    return eurAmount * rate;
  }

  /**
   * Konverterar SEK till EUR
   */
  static async convertSekToEur(sekAmount: number): Promise<number> {
    const rate = await this.getRate();
    return sekAmount / rate;
  }
}