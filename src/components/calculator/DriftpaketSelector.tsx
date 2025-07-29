
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { DriftpaketType } from '@/types/calculator';
import { Check, Shield, ShieldCheck, Clock, CreditCard } from 'lucide-react';

const DriftpaketSelector: React.FC = () => {
  const { 
    selectedMachine, 
    selectedDriftpaket, 
    setSelectedDriftpaket,
    calculatedSlaCostSilver,
    calculatedSlaCostGuld,
    creditPrice,
    useFlatrateOption
  } = useCalculator();

  const handleDriftpaketChange = (value: string) => {
    setSelectedDriftpaket(value as DriftpaketType);
  };

  if (!selectedMachine) {
    return null;
  }

  // Visa kreditmodelinformation för Bas-paketet om det är valt och maskinen använder credits
  const showCreditInfo = selectedDriftpaket === 'Bas' && selectedMachine.usesCredits;

  return (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold mb-4">Välj Service & Driftpaket</h3>
      
      {/* Bas-paket med integrerad kreditinformation */}
      <div className={`p-3 border rounded-md mb-4 ${selectedDriftpaket === 'Bas' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <input 
              type="radio" 
              id="driftpaket-bas" 
              checked={selectedDriftpaket === 'Bas'}
              onChange={() => setSelectedDriftpaket('Bas')}
              className="form-radio"
            />
            <label htmlFor="driftpaket-bas" className="font-medium cursor-pointer">
              Bas (Ingår)
            </label>
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {formatCurrency(0)} / mån
          </span>
        </div>
        <div className="pl-6 mt-2">
          <ul className="text-sm space-y-1">
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>12 mån Garanti</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Grundsupport (vardagar)</span>
            </li>
            {showCreditInfo && (
              <li className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Credits: {useFlatrateOption === 'flatrate' ? 'Flatrate' : `${formatCurrency(creditPrice)} per credit`}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      
      <RadioGroup 
        value={selectedDriftpaket === 'Bas' ? '' : selectedDriftpaket} 
        onValueChange={handleDriftpaketChange}
        className="space-y-4"
      >
        {/* Silver-paket */}
        <div className={`p-3 border rounded-md ${selectedDriftpaket === 'Silver' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Silver" id="driftpaket-silver" />
              <label htmlFor="driftpaket-silver" className="font-medium cursor-pointer">
                Silver
              </label>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {formatCurrency(calculatedSlaCostSilver, false, true)} / mån
            </span>
          </div>
          <div className="pl-6 mt-2">
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>24 mån Garanti</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Utökad Support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span>Lånemaskin</span>
              </li>
              {selectedMachine?.usesCredits && (
                <li className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-700">Flatrate Credits Ingår</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Guld-paket */}
        <div className={`p-3 border rounded-md ${selectedDriftpaket === 'Guld' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Guld" id="driftpaket-guld" />
              <label htmlFor="driftpaket-guld" className="font-medium cursor-pointer">
                Guld
              </label>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {formatCurrency(calculatedSlaCostGuld, false, true)} / mån
            </span>
          </div>
          <div className="pl-6 mt-2">
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>24 mån Garanti</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Premium Support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span>Lånemaskin</span>
              </li>
              {selectedMachine?.usesCredits && (
                <li className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-700">Flatrate Credits Ingår</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </RadioGroup>
      
      <div className="mt-4 text-center">
        <a 
          href="#" 
          target="_blank" 
          className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
        >
          Jämför paketen / Läs fullständiga villkor
        </a>
      </div>
    </div>
  );
};

export default DriftpaketSelector;
