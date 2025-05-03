
/**
 * Utility module för centrala beräkningsfunktioner
 * 
 * Detta är en wrapper för att förenkla övergången från det gamla systemet
 * där olika filer innehöll separata beräkningsfunktioner till det nya systemet
 */

// Re-exportera metoder från calculations.ts för bakåtkompatibilitet
export { calculateLeasingCost } from './calculations';
