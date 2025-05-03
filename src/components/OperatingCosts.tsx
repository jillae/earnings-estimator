
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { useFlatrateHandler } from '@/hooks/useFlatrateHandler';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';
import { AlertTriangle, Info } from 'lucide-react';

const OperatingCosts: React.FC = () => {
  const { 
    selectedMachine, 
    useFlatrateOption, 
    treatmentsPerDay, 
    creditPrice,
    leasingCost,
    flatrateThreshold,
    paymentOption,
    selectedDriftpaket,
    operatingCost,
    currentSliderStep
  } = useCalculator();

  const { handleFlatrateChange, canEnableFlatrate } = useFlatrateHandler();

  // Om ingen maskin är vald, visa inget
  if (!selectedMachine) {
    return null;
  }
  
  // Beräkna om flatrate är inkluderat för Silver/Guld
  const isLeasingFlatrateViable = currentSliderStep >= 1;
  const isFlatrateIncluded = 
    selectedMachine.usesCredits && 
    (selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') &&
    (paymentOption === 'cash' || (paymentOption === 'leasing' && isLeasingFlatrateViable));
  
  console.log(`OperatingCosts Rendering:
    Machine: ${selectedMachine.name}
    Driftpaket: ${selectedDriftpaket}
    Credit Price: ${creditPrice} (exakt värde)
    Uses Credits: ${selectedMachine.usesCredits}
    Flatrate Option: ${useFlatrateOption}
    Can Enable Flatrate: ${canEnableFlatrate}
    Is Flatrate Included (Silver/Guld): ${isFlatrateIncluded}
    Payment Option: ${paymentOption}
    Current Slider Step: ${currentSliderStep}
  `);

  // Om maskinen inte använder credits, visa endast SLA-kostnad om den finns
  if (!selectedMachine.usesCredits) {
    const hasOperatingCosts = operatingCost && operatingCost.totalCost > 0;

    if (!hasOperatingCosts) {
      return (
        <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-semibold mb-4">Detaljer Driftskostnad</h3>
          
          <div className="flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm text-gray-600">
              Inga driftskostnader för denna maskin.
            </p>
          </div>
        </div>
      );
    }
    
    // Visa bara SLA-information för icke-kredit-maskiner
    return (
      <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
        <h3 className="text-lg font-semibold mb-4">Detaljer Driftskostnad</h3>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">SLA-kostnad för {selectedDriftpaket}-paket</span>
          <span className="text-lg font-semibold">{formatCurrency(operatingCost.slaCost)}</span>
        </div>
        
        <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200">
          <span className="text-sm font-semibold">Total driftskostnad per månad</span>
          <span className="text-lg font-semibold text-blue-600">{formatCurrency(operatingCost.totalCost)}</span>
        </div>
      </div>
    );
  }

  // Om Silver eller Guld driftpaket är valt OCH flatrate är inkluderat
  if ((selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') && isFlatrateIncluded) {
    return (
      <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
        <h3 className="text-lg font-semibold mb-4">Detaljer Driftskostnad</h3>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-5 w-5 text-blue-600" />
            <p className="text-blue-700 font-medium">
              Flatrate Credits Ingår i ditt valda {selectedDriftpaket}-paket
            </p>
          </div>
          <p className="text-sm text-blue-600 pl-7">
            Du får obegränsad användning av credits utan extra kostnader.
          </p>
        </div>
        
        {/* Visa även SLA-kostnaden för Guld-paketet om det finns */}
        {selectedDriftpaket === 'Guld' && operatingCost.slaCost > 0 && (
          <div className="flex justify-between items-center mt-4 mb-2">
            <span className="text-sm">Extra SLA-kostnad för Guld-paket</span>
            <span className="text-lg font-semibold">{formatCurrency(operatingCost.slaCost)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200">
          <span className="text-sm font-semibold">Total driftskostnad per månad</span>
          <span className="text-lg font-semibold text-blue-600">{formatCurrency(operatingCost.totalCost)}</span>
        </div>
      </div>
    );
  }

  // Om Silver eller Guld driftpaket är valt men flatrate INTE är inkluderat (bara vid leasing + lågt slider-värde)
  if ((selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') && !isFlatrateIncluded) {
    const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
    const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
    const totalCreditsPerMonth = treatmentsPerMonth * creditsPerTreatment;
    const creditsCostPerMonth = totalCreditsPerMonth * (creditPrice || 0);
    
    return (
      <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
        <h3 className="text-lg font-semibold mb-4">Detaljer Driftskostnad</h3>
        
        <div className="p-4 mb-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-amber-700 font-medium">
              OBS! Flatrate ingår ej i {selectedDriftpaket}-paketet vid denna leasingnivå
            </p>
          </div>
          <p className="text-sm text-amber-600 pl-7">
            För att inkludera Flatrate (obegränsad användning) behöver du välja leasingpaket Standard eller högre.
            Styckepris för credits tillkommer därför nu utöver paketpriset.
          </p>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Pris per credit</span>
          <span className="text-lg font-semibold">{formatCurrency(creditPrice || 0, false)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Credits per månad</span>
          <span className="text-sm text-gray-600">{totalCreditsPerMonth} credits</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Credit-kostnad per månad</span>
          <span className="text-lg font-semibold">{formatCurrency(creditsCostPerMonth)}</span>
        </div>
        
        {/* Visa även SLA-kostnaden för Guld-paketet om det finns */}
        {selectedDriftpaket === 'Guld' && operatingCost.slaCost > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Extra SLA-kostnad för Guld-paket</span>
            <span className="text-lg font-semibold">{formatCurrency(operatingCost.slaCost)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200">
          <span className="text-sm font-semibold">Total driftskostnad per månad</span>
          <span className="text-lg font-semibold text-blue-600">{formatCurrency(operatingCost.totalCost)}</span>
        </div>
      </div>
    );
  }

  // För Bas-paketet med credits, visa detaljerad vy med kreditpris/flatrate
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const creditsPerTreatment = selectedMachine.creditsPerTreatment || 1;
  const totalCreditsPerMonth = treatmentsPerMonth * creditsPerTreatment;
  const creditsCostPerMonth = totalCreditsPerMonth * (creditPrice || 0);
  const flatrateAmount = selectedMachine.flatrateAmount || 0;

  // Beräkna vid vilken punkt flatrate blir mer kostnadseffektivt
  const calculateBreakEven = () => {
    if (!creditPrice || creditPrice <= 0) return 0;
    const breakEvenTreatmentsPerMonth = flatrateAmount / (creditPrice * creditsPerTreatment);
    return Math.ceil(breakEvenTreatmentsPerMonth / WORKING_DAYS_PER_MONTH);
  };

  return (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold mb-4">Detaljer Driftskostnad</h3>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="flatrate-switch"
            checked={useFlatrateOption === 'flatrate'}
            onCheckedChange={handleFlatrateChange}
            disabled={!canEnableFlatrate}
          />
          <Label htmlFor="flatrate-switch" className="text-sm font-medium">
            Använd Flatrate
          </Label>
        </div>
        <span className="text-sm text-gray-500">
          {useFlatrateOption === 'flatrate' ? 'Flatrate' : 'Per Credit'}
        </span>
      </div>

      {!canEnableFlatrate && useFlatrateOption !== 'flatrate' && paymentOption === 'leasing' && (
        <div className="flex items-center gap-2 p-2 mb-4 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>
            Leasingpaketet behöver vara Standard eller högre för att aktivera Flatrate
          </span>
        </div>
      )}

      {useFlatrateOption === 'perCredit' ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Pris per credit</span>
            <span className="text-lg font-semibold">{formatCurrency(creditPrice || 0, false)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Credits per månad</span>
            <span className="text-sm text-gray-600">{totalCreditsPerMonth} credits</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Credit-kostnad per månad</span>
            <span className="text-lg font-semibold">{formatCurrency(creditsCostPerMonth)}</span>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Flatrate kostnad per månad</span>
          <span className="text-lg font-semibold">{formatCurrency(flatrateAmount)}</span>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-2 pt-2 border-t border-gray-200">
        <span className="text-sm font-semibold">Total driftskostnad per månad</span>
        <span className="text-lg font-semibold text-blue-600">{formatCurrency(operatingCost.totalCost)}</span>
      </div>

      {flatrateAmount > 0 && useFlatrateOption === 'perCredit' && creditPrice > 0 && (
        <p className="text-xs text-blue-500 mt-2">
          Vid {calculateBreakEven()} eller fler behandlingar per dag kan flatrate vara mer kostnadseffektivt.
        </p>
      )}
    </div>
  );
};

export default OperatingCosts;
