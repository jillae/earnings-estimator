
import { VAT_RATE } from './constants';

/**
 * Formaterar ett numeriskt värde till en valutasträng med tusentalsavgränsare
 * och två decimaler. Om addVAT är true, läggs moms till.
 * 
 * @param amount - Beloppet som ska formateras
 * @param addVAT - Om moms ska läggas till (default: false)
 * @param endWith6 - Om beloppet ska avrundas till att sluta med 6 (default: false)
 * @returns Formaterad valutasträng
 */
export function formatCurrency(amount: number | undefined, addVAT: boolean = false, endWith6: boolean = false): string {
  // Kontrollera att amount är ett giltigt värde
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 kr';
  }
  
  // Lägg till moms om det behövs
  const finalAmount = addVAT ? amount * (1 + VAT_RATE) : amount;
  
  // KONSEKVENT AVRUNDNING TILL HELTAL för alla pengavärden
  let roundedAmount = Math.round(finalAmount);
  
  // För leasingkostnader, säkerställ slutsiffra 6 endast om endWith6 är true
  if (endWith6) {
    const lastDigit = roundedAmount % 10;
    if (lastDigit !== 6) {
      roundedAmount = roundedAmount - lastDigit + 6;
    }
  }
  
  return roundedAmount.toLocaleString('sv-SE') + ' kr';
}

/**
 * Avrundar ett tal till närmaste hundratal som slutar på 6.
 * Ex: 1234 -> 1206, 1256 -> 1306
 * 
 * @param value - Värdet som ska avrundas
 * @returns Avrundat värde till närmaste hundratal som slutar på 6
 */
export function roundToHundredEndingSix(value: number): number {
  // Kontrollera att value är ett giltigt värde
  if (value === undefined || value === null || isNaN(value)) {
    console.log('⚠️ roundToHundredEndingSix: Ogiltigt värde:', value);
    return 0;
  }
  
  console.log('🔢 roundToHundredEndingSix input:', value);
  
  // Avrunda till närmaste hundratal
  const roundedToHundred = Math.round(value / 100) * 100;
  console.log('🔢 Avrundat till hundratal:', roundedToHundred);
  
  // Säkerställ att det slutar med 06 (inte bara 6)
  const lastTwoDigits = roundedToHundred % 100;
  let result: number;
  
  if (lastTwoDigits === 6) {
    // Redan slutar med 06
    result = roundedToHundred;
  } else {
    // Lägg till eller ändra till 06
    result = roundedToHundred - lastTwoDigits + 6;
  }
  
  console.log('🔢 roundToHundredEndingSix result:', result);
  return result;
}
