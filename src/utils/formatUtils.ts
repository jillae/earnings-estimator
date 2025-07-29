
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
  
  // För kreditpriser, visa alltid som heltal utan decimaler för konsistens
  if (!endWith6) {
    // Avrunda till heltal för alla icke-leasing värden
    const roundedAmount = Math.round(finalAmount);
    return roundedAmount.toLocaleString('sv-SE') + ' kr';
  }
  
  // För leasingkostnader, avrunda till heltal och säkerställ slutsiffra 6
  if (endWith6) {
    let roundedAmount = Math.round(finalAmount);
    const lastDigit = roundedAmount % 10;
    if (lastDigit !== 6) {
      roundedAmount = roundedAmount - lastDigit + 6;
    }
    return roundedAmount.toLocaleString('sv-SE') + ' kr';
  } else {
    // För andra belopp än leasingkostnader, avrunda till heltal för konsistens
    const roundedAmount = Math.round(finalAmount);
    return roundedAmount.toLocaleString('sv-SE') + ' kr';
  }
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
    return 0;
  }
  
  // Avrunda till närmaste hundratal först
  const roundedToHundred = Math.round(value / 100) * 100;
  
  // Lägg till 6 för att säkerställa att det slutar med 6
  return roundedToHundred - roundedToHundred % 10 + 6;
}
