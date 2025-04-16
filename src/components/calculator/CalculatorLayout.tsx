
import React from 'react';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import { useCalculator } from '@/context/CalculatorContext';

const CalculatorLayout: React.FC = () => {
  const { netResults } = useCalculator();
  
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Vänster kolumn */}
          <section className="glass-card">
            <h2 className="text-xl font-semibold mb-4">1. Välj Maskin</h2>
            <div className="mb-4">
              {/* Maskinval-komponenten renderas här av CalculatorInputs */}
            </div>
          </section>

          <section className="glass-card">
            <h2 className="text-xl font-semibold mb-4">2. Investeringsalternativ</h2>
            <div className="mb-4">
              {/* Leasing/Kontant och relaterade kontroller renderas här av CalculatorInputs */}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Höger kolumn */}
          <section className="glass-card">
            <h2 className="text-xl font-semibold mb-4">3. Driftsförutsättningar</h2>
            <div className="mb-4">
              {/* Klinikstorlek, behandlingar etc renderas här av CalculatorInputs */}
            </div>
          </section>

          <section className="glass-card">
            <h2 className="text-xl font-semibold mb-4">4. Service & Driftskostnad</h2>
            <div className="mb-4">
              {/* SLA och driftskostnader renderas här av CalculatorInputs */}
            </div>
          </section>
        </div>
      </div>

      {/* Resultatsektion - full bredd */}
      <div className="mt-8">
        <CalculatorResults />
      </div>
    </div>
  );
};

export default CalculatorLayout;
