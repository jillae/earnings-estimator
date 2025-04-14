import axios from 'axios';
import { DEFAULT_EXCHANGE_RATE } from '../utils/constants';
import { Machine } from '../data/machines/types';

export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    const response = await axios.get(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}`);
    
    if (response.data.success) {
      return response.data.result;
    } else {
      console.error('Error fetching exchange rate:', response.data.error);
      return DEFAULT_EXCHANGE_RATE;
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return DEFAULT_EXCHANGE_RATE;
  }
}
