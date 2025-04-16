
import React, { useState } from 'react';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import { useCalculator } from '@/context/CalculatorContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CalculatorLayout: React.FC = () => {
  const { netResults } = useCalculator();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (sectionNumber: number) => {
    setExpandedSection(prev => prev === sectionNumber ? null : sectionNumber);
  };
  
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Vänster kolumn */}
          <section 
            className={`glass-card cursor-pointer hover:bg-gray-50 transition-colors ${
              expandedSection === 1 ? 'expanded' : ''
            }`}
            onClick={() => toggleSection(1)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">1. Välj Maskin</h2>
              {expandedSection === 1 ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 1 && (
              <div className="mb-4">
                {/* Maskinval-komponenten renderas här av CalculatorInputs */}
              </div>
            )}
          </section>

          <section 
            className={`glass-card cursor-pointer hover:bg-gray-50 transition-colors ${
              expandedSection === 2 ? 'expanded' : ''
            }`}
            onClick={() => toggleSection(2)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">2. Investeringsalternativ</h2>
              {expandedSection === 2 ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 2 && (
              <div className="mb-4">
                {/* Leasing/Kontant och relaterade kontroller renderas här av CalculatorInputs */}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {/* Höger kolumn */}
          <section 
            className={`glass-card cursor-pointer hover:bg-gray-50 transition-colors ${
              expandedSection === 3 ? 'expanded' : ''
            }`}
            onClick={() => toggleSection(3)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">3. Driftsförutsättningar</h2>
              {expandedSection === 3 ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 3 && (
              <div className="mb-4">
                {/* Klinikstorlek, behandlingar etc renderas här av CalculatorInputs */}
              </div>
            )}
          </section>

          <section 
            className={`glass-card cursor-pointer hover:bg-gray-50 transition-colors ${
              expandedSection === 4 ? 'expanded' : ''
            }`}
            onClick={() => toggleSection(4)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">4. Service & Driftskostnad</h2>
              {expandedSection === 4 ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 4 && (
              <div className="mb-4">
                {/* SLA och driftskostnader renderas här av CalculatorInputs */}
              </div>
            )}
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
