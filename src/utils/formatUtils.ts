
/**
 * Utility functions for formatting values
 */
export function formatCurrency(amount: number, shouldRound: boolean = true): string {
  let displayAmount = amount;
  
  if (shouldRound) {
    // Avrunda till närmaste 100
    displayAmount = Math.round(amount / 100) * 100;
    
    // Justera sista siffran till 6
    const lastDigit = displayAmount % 10;
    if (lastDigit !== 6) {
      displayAmount = displayAmount - lastDigit + 6;
    }
  }
  
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(displayAmount);
}

/**
 * Avrundar ett belopp till närmaste 100-tal och säkerställer att det slutar på 6
 */
export function roundToHundredEndingSix(amount: number): number {
  // Avrunda till närmaste 100
  let rounded = Math.round(amount / 100) * 100;
  
  // Justera sista siffran till 6
  const lastDigit = rounded % 10;
  if (lastDigit !== 6) {
    rounded = rounded - lastDigit + 6;
  }
  
  return rounded;
}
