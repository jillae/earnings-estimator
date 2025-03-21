
/**
 * Utility functions for formatting values
 */
export function formatCurrency(amount: number, shouldRound: boolean = true): string {
  // Kontrollera om amount är ett giltigt nummer
  if (isNaN(amount) || amount === null || amount === undefined) {
    console.warn(`Försökte formatera ett ogiltigt belopp: ${amount}`);
    amount = 0;
  }
  
  let displayAmount = amount;
  
  if (shouldRound) {
    displayAmount = Math.round(amount / 500) * 500;
  }
  
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(displayAmount);
}
