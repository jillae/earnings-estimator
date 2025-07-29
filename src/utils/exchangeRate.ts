
/**
 * @deprecated Use ExchangeRateEngine.getRate() instead
 * This maintains the Riksbank API functionality for backward compatibility
 */

import { ExchangeRateEngine } from './core/ExchangeRateEngine';

export async function getExchangeRate(
  fromCurrency: string = 'EUR',
  toCurrency: string = 'SEK'
): Promise<number> {
  // För nu använder vi den centraliserade motorn
  // I framtiden kan vi flytta Riksbank API-logiken till ExchangeRateEngine
  return ExchangeRateEngine.getRate();
}
