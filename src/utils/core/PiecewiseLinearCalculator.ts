/**
 * PiecewiseLinearCalculator - Hanterar styckvis linjär interpolering för strategisk prissättning
 * 
 * Denna klass implementerar en icke-linjär prissättningsmodell med fem brytpunkter:
 * - Position 0 (Min): leasingMin → creditMax
 * - Position 1 (Låg): interpolerat → creditMid1
 * - Position 2 (Standard): leasingStandard → creditMid2
 * - Position 3 (Hög): interpolerat → creditMid3  
 * - Position 4 (Max): leasingMax → 0 kr credit
 */

export interface PricingBreakpoint {
  position: number;
  leasingCost: number;
  creditPrice: number;
}

export interface MachinePricingData {
  leasingMin: number;
  leasingStandard: number;
  leasingMax: number;
  creditMax: number;      // Position 0
  creditMid1: number;     // Position 1  
  creditMid2: number;     // Position 2 (Standard)
  creditMid3: number;     // Position 3
  // Position 4 är alltid 0
}

export class PiecewiseLinearCalculator {
  private breakpoints: PricingBreakpoint[];

  constructor(pricingData: MachinePricingData) {
    // Beräkna interpolerad leasing för position 1 och 3
    const leasingMid1 = pricingData.leasingMin + (pricingData.leasingStandard - pricingData.leasingMin) * 0.5;
    const leasingMid3 = pricingData.leasingStandard + (pricingData.leasingMax - pricingData.leasingStandard) * 0.5;
    
    this.breakpoints = [
      { position: 0, leasingCost: pricingData.leasingMin, creditPrice: pricingData.creditMax },
      { position: 1, leasingCost: leasingMid1, creditPrice: pricingData.creditMid1 },
      { position: 2, leasingCost: pricingData.leasingStandard, creditPrice: pricingData.creditMid2 },
      { position: 3, leasingCost: leasingMid3, creditPrice: pricingData.creditMid3 },
      { position: 4, leasingCost: pricingData.leasingMax, creditPrice: 0 }
    ];
  }

  /**
   * Beräknar interpolerade värden för en given position på slidern (0-4)
   */
  interpolate(position: number): { leasingCost: number; creditPrice: number } {
    // Begränsa positionen till giltigt intervall
    position = Math.max(0, Math.min(4, position));

    // Om positionen är exakt på en brytpunkt, returnera det exakta värdet
    const exactBreakpoint = this.breakpoints.find(bp => bp.position === position);
    if (exactBreakpoint) {
      return {
        leasingCost: exactBreakpoint.leasingCost,
        creditPrice: exactBreakpoint.creditPrice
      };
    }

    // Hitta vilket segment vi är i
    let lowerBreakpoint: PricingBreakpoint;
    let upperBreakpoint: PricingBreakpoint;

    if (position < 1) {
      // Segment 1: 0 → 1 (Min → Låg)
      lowerBreakpoint = this.breakpoints[0];
      upperBreakpoint = this.breakpoints[1];
    } else if (position < 2) {
      // Segment 2: 1 → 2 (Låg → Standard)
      lowerBreakpoint = this.breakpoints[1];
      upperBreakpoint = this.breakpoints[2];
    } else if (position < 3) {
      // Segment 3: 2 → 3 (Standard → Hög)
      lowerBreakpoint = this.breakpoints[2];
      upperBreakpoint = this.breakpoints[3];
    } else {
      // Segment 4: 3 → 4 (Hög → Max)
      lowerBreakpoint = this.breakpoints[3];
      upperBreakpoint = this.breakpoints[4];
    }

    // Beräkna interpolationsfaktor inom segmentet
    const segmentProgress = (position - lowerBreakpoint.position) / 
                           (upperBreakpoint.position - lowerBreakpoint.position);

    // Linjär interpolering inom segmentet
    const leasingCost = lowerBreakpoint.leasingCost + 
                       (upperBreakpoint.leasingCost - lowerBreakpoint.leasingCost) * segmentProgress;
    
    const creditPrice = lowerBreakpoint.creditPrice + 
                       (upperBreakpoint.creditPrice - lowerBreakpoint.creditPrice) * segmentProgress;

    return {
      leasingCost: Math.round(leasingCost),
      creditPrice: Math.round(creditPrice)
    };
  }

  /**
   * Hämtar alla brytpunkter för debugging och validering
   */
  getBreakpoints(): PricingBreakpoint[] {
    return [...this.breakpoints];
  }

  /**
   * Validerar att prissättningsmodellen är korrekt konfigurerad
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Kontrollera att leasingkostnaderna är i rätt ordning
    if (this.breakpoints[0].leasingCost >= this.breakpoints[2].leasingCost) {
      errors.push('leasingMin måste vara mindre än leasingStandard');
    }
    if (this.breakpoints[2].leasingCost >= this.breakpoints[4].leasingCost) {
      errors.push('leasingStandard måste vara mindre än leasingMax');
    }

    // Kontrollera kreditpriser (ska minska från max till 0)
    for (let i = 0; i < this.breakpoints.length - 1; i++) {
      if (this.breakpoints[i].creditPrice <= this.breakpoints[i + 1].creditPrice) {
        errors.push(`Kreditpris måste minska mellan position ${i} och ${i + 1}`);
      }
    }

    if (this.breakpoints[4].creditPrice !== 0) {
      errors.push('Position 4 måste ha 0 kr/credit');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}