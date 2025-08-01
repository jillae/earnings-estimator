
import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { useFlatrateHandler } from '@/hooks/useFlatrateHandler';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';

// Importera underkomponenterna
import NoMachineSelected from './operating-costs/NoMachineSelected';
import NoDriftCosts from './operating-costs/NoDriftCosts';
import NonCreditMachineDetails from './operating-costs/NonCreditMachineDetails';
import FlatrateIncluded from './operating-costs/FlatrateIncluded';
import FlatrateNotIncluded from './operating-costs/FlatrateNotIncluded';
import BaseDriftpaketDetails from './operating-costs/BaseDriftpaketDetails';

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
    currentSliderStep,
  } = useCalculator();

  const { handleFlatrateChange, canEnableFlatrate } = useFlatrateHandler();

  // Renderar omslutande kortstruktur
  const renderOperatingCostCard = (content: React.ReactNode) => (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold mb-4">Detaljer Driftskostnad</h3>
      {content}
    </div>
  );

  // Om ingen maskin är vald, visa NoMachineSelected-komponenten
  if (!selectedMachine) {
    return <NoMachineSelected />;
  }
  
  // Om användaren är på maxposition (steg 2), visa specialfall för 0kr credit
  if (selectedMachine.usesCredits && currentSliderStep === 2) {
    return renderOperatingCostCard(
      <div className="space-y-4">
        <div className="flex items-center justify-center p-6 bg-primary/5 rounded-lg border border-primary/20">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-primary mb-2">
              Strategimodell - Credits Ingår
            </h4>
            <p className="text-sm text-slate-600">
              Alla credits ingår i ditt månatliga leasingpris. Inga extra kostnader för behandlingar.
            </p>
          </div>
        </div>
      </div>
    );
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
      return renderOperatingCostCard(<NoDriftCosts />);
    }
    
    // Visa bara SLA-information för icke-kredit-maskiner
    return renderOperatingCostCard(
      <NonCreditMachineDetails 
        selectedDriftpaket={selectedDriftpaket} 
        operatingCost={operatingCost} 
      />
    );
  }

  // Om Silver eller Guld driftpaket är valt OCH flatrate är inkluderat
  if ((selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') && isFlatrateIncluded) {
    return renderOperatingCostCard(
      <FlatrateIncluded 
        selectedDriftpaket={selectedDriftpaket} 
        operatingCost={operatingCost} 
      />
    );
  }

  // Om Silver eller Guld driftpaket är valt men flatrate INTE är inkluderat (bara vid leasing + lågt slider-värde)
  if ((selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') && !isFlatrateIncluded) {
    return renderOperatingCostCard(
      <FlatrateNotIncluded 
        selectedDriftpaket={selectedDriftpaket} 
        operatingCost={operatingCost}
        treatmentsPerDay={treatmentsPerDay}
        creditPrice={creditPrice || 0}
        selectedMachine={selectedMachine}
      />
    );
  }

  // För Bas-paketet med credits, visa detaljerad vy med kreditpris/flatrate
  return renderOperatingCostCard(
    <BaseDriftpaketDetails 
      useFlatrateOption={useFlatrateOption}
      creditPrice={creditPrice || 0}
      treatmentsPerDay={treatmentsPerDay}
      selectedMachine={selectedMachine}
      operatingCost={operatingCost}
      selectedDriftpaket={selectedDriftpaket}
    />
  );
};

export default OperatingCosts;
