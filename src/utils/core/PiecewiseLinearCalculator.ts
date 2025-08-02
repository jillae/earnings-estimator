/**
 * PiecewiseLinearCalculator - Hanterar styckvis linjär interpolering för strategisk prissättning
 * 
 * Denna klass implementerar en icke-linjär prissättningsmodell med tre brytpunkter:
 * - Position 0 (Min): leasingMin → creditMax
 * - Position 1 (Standard): leasingStandard → creditMin (149 kr)
 * - Position 2 (Max): leasingMax → 0 kr credit
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
  creditMin: number;
  creditMax: number;
}

export class PiecewiseLinearCalculator {
  private breakpoints: PricingBreakpoint[];

  constructor(pricingData: MachinePricingData) {
    this.breakpoints = [
      { position: 0, leasingCost: pricingData.leasingMin, creditPrice: pricingData.creditMax },
      { position: 1, leasingCost: pricingData.leasingStandard, creditPrice: pricingData.creditMin },
      { position: 2, leasingCost: pricingData.leasingMax, creditPrice: 0 }
    ];
  }

  /**
   * Beräknar interpolerade värden för en given position på slidern (0-2)
   */
  interpolate(position: number): { leasingCost: number; creditPrice: number } {
    // Begränsa positionen till giltigt intervall
    position = Math.max(0, Math.min(2, position));

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
      // Segment 1: 0 → 1 (Min → Standard)
      lowerBreakpoint = this.breakpoints[0]; // position 0
      upperBreakpoint = this.breakpoints[1]; // position 1
    } else {
      // Segment 2: 1 → 2 (Standard → Max)
      lowerBreakpoint = this.breakpoints[1]; // position 1
      upperBreakpoint = this.breakpoints[2]; // position 2
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

    // Kontrollera att brytpunkterna är i rätt ordning
    if (this.breakpoints[0].leasingCost >= this.breakpoints[1].leasingCost) {
      errors.push('leasingMin måste vara mindre än leasingStandard');
    }
    if (this.breakpoints[1].leasingCost >= this.breakpoints[2].leasingCost) {
      errors.push('leasingStandard måste vara mindre än leasingMax');
    }

    // Kontrollera kreditpriser (ska minska från max till 0)
    if (this.breakpoints[0].creditPrice <= this.breakpoints[1].creditPrice) {
      errors.push('creditMax måste vara större än creditMin');
    }
    if (this.breakpoints[1].creditPrice <= this.breakpoints[2].creditPrice) {
      errors.push('creditMin måste vara större än 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}