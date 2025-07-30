import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, Shield, Headphones, Timer, Zap, CreditCard, Target, ShieldCheck, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { useCalculator } from '@/context/CalculatorContext';
import { DriftpaketType } from '@/types/calculator';

export const SlaCardsMatrix: React.FC = () => {
  const { 
    selectedMachine, 
    selectedDriftpaket, 
    setSelectedDriftpaket,
    calculatedSlaCostSilver,
    calculatedSlaCostGuld,
    creditPrice,
    useFlatrateOption
  } = useCalculator();

  if (!selectedMachine) {
    return (
      <div className="glass-card animate-slide-in" style={{ animationDelay: '300ms' }}>
        <div className="text-center py-8">
          <p className="text-slate-500">Välj en maskin för att se SLA-alternativ</p>
        </div>
      </div>
    );
  }

  const handleSlaSelect = (slaLevel: DriftpaketType) => {
    setSelectedDriftpaket(slaLevel);
  };

  // Definiera alla rader i tabellen
  const tableRows = [
    {
      category: 'Garanti & Support',
      features: [
        {
          label: 'Garanti',
          bas: '12 månader',
          silver: '24 månader',
          guld: '24 månader'
        },
        {
          label: 'Support',
          bas: 'Grundsupport (vardagar)',
          silver: 'Prioriterad (5d/v, 9-15)',
          guld: 'Högsta prioritet (7d/v, 00-24)'
        },
        {
          label: 'Responstid',
          bas: '336h',
          silver: '24h',
          guld: 'Omgående'
        }
      ]
    },
    {
      category: 'Service & Underhåll',
      features: [
        {
          label: 'Servicetid',
          bas: 'Vardagar',
          silver: 'Vardagar 9-15',
          guld: 'Alla dagar 00-24'
        },
        {
          label: 'Max åtgärdstid',
          bas: 'Inom rimlig tid',
          silver: '72h',
          guld: '48h'
        },
        {
          label: 'Årlig service',
          bas: '❌',
          silver: '✅ (resekostnad ingår)',
          guld: '✅ (res + arbetskostnad ingår)'
        },
        {
          label: 'Lånemaskin vid service',
          bas: '❌',
          silver: '✅',
          guld: '✅'
        }
      ]
    }
  ];

  // Lägg till credits-rad om maskinen använder credits
  if (selectedMachine.usesCredits) {
    tableRows.push({
      category: 'Credits',
      features: [
        {
          label: 'Credit-kostnad',
          bas: useFlatrateOption === 'flatrate' ? 'Flatrate' : `${formatCurrency(creditPrice)} per credit`,
          silver: '50% rabatt på Flatrate',
          guld: 'Flatrate Credits Ingår (100%)'
        }
      ]
    });
  }

  const getColumnStyle = (slaLevel: DriftpaketType) => {
    const isSelected = selectedDriftpaket === slaLevel;
    const baseStyle = "p-4 text-center border cursor-pointer transition-all duration-200 hover:bg-slate-50";
    
    if (isSelected) {
      switch (slaLevel) {
        case 'Bas':
          return `${baseStyle} bg-blue-50 border-blue-300 ring-2 ring-blue-400`;
        case 'Silver':
          return `${baseStyle} bg-slate-50 border-slate-300 ring-2 ring-slate-400`;
        case 'Guld':
          return `${baseStyle} bg-yellow-50 border-yellow-300 ring-2 ring-yellow-400`;
      }
    }
    
    return `${baseStyle} border-slate-200`;
  };

  const getHeaderStyle = (slaLevel: DriftpaketType) => {
    const isSelected = selectedDriftpaket === slaLevel;
    const baseStyle = "p-4 text-center border font-semibold cursor-pointer transition-all duration-200 hover:bg-slate-50";
    
    if (isSelected) {
      switch (slaLevel) {
        case 'Bas':
          return `${baseStyle} bg-blue-100 border-blue-300 text-blue-900 ring-2 ring-blue-400`;
        case 'Silver':
          return `${baseStyle} bg-slate-100 border-slate-300 text-slate-900 ring-2 ring-slate-400`;
        case 'Guld':
          return `${baseStyle} bg-yellow-100 border-yellow-300 text-yellow-900 ring-2 ring-yellow-400`;
      }
    }
    
    return `${baseStyle} border-slate-200 bg-slate-50`;
  };

  return (
    <div className="glass-card animate-slide-in" style={{ animationDelay: '300ms' }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Välj Service & Driftpaket
        </h3>
        <p className="text-sm text-slate-600">
          Jämför alternativen och välj det som passar din klinik bäst
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          {/* Header */}
          <thead>
            <tr>
              <th className="p-4 text-left border bg-slate-100 border-slate-200 font-semibold text-slate-700">
                Vad ingår
              </th>
              <th 
                className={getHeaderStyle('Bas')}
                onClick={() => handleSlaSelect('Bas')}
              >
                <div>
                  <div className="text-lg font-bold">🔵 Bas</div>
                  <div className="text-sm">(Ingår)</div>
                  <div className="text-lg font-bold mt-1">{formatCurrency(0)}</div>
                  <div className="text-xs">/ mån</div>
                  {selectedDriftpaket === 'Bas' && (
                    <div className="text-xs font-bold text-blue-700 mt-1">✓ VALT</div>
                  )}
                </div>
              </th>
              <th 
                className={getHeaderStyle('Silver')}
                onClick={() => handleSlaSelect('Silver')}
              >
                <div>
                  <div className="text-lg font-bold">⚪ Silver</div>
                  <div className="text-sm">&nbsp;</div>
                  <div className="text-lg font-bold mt-1">{formatCurrency(calculatedSlaCostSilver)}</div>
                  <div className="text-xs">/ mån</div>
                  {selectedDriftpaket === 'Silver' && (
                    <div className="text-xs font-bold text-slate-700 mt-1">✓ VALT</div>
                  )}
                </div>
              </th>
              <th 
                className={getHeaderStyle('Guld')}
                onClick={() => handleSlaSelect('Guld')}
              >
                <div>
                  <div className="text-lg font-bold">🟡 Guld</div>
                  <div className="text-sm">&nbsp;</div>
                  <div className="text-lg font-bold mt-1">{formatCurrency(calculatedSlaCostGuld)}</div>
                  <div className="text-xs">/ mån</div>
                  {selectedDriftpaket === 'Guld' && (
                    <div className="text-xs font-bold text-yellow-700 mt-1">✓ VALT</div>
                  )}
                </div>
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {tableRows.map((section, sectionIndex) => (
              <React.Fragment key={sectionIndex}>
                {/* Section header */}
                <tr>
                  <td colSpan={4} className="p-3 bg-slate-100 border border-slate-200 font-semibold text-slate-700 text-sm">
                    {section.category}
                  </td>
                </tr>
                
                {/* Section rows */}
                {section.features.map((feature, featureIndex) => (
                  <tr key={`${sectionIndex}-${featureIndex}`}>
                    <td className="p-3 border border-slate-200 font-medium text-slate-700 text-sm">
                      {feature.label}
                    </td>
                    <td 
                      className={getColumnStyle('Bas')}
                      onClick={() => handleSlaSelect('Bas')}
                    >
                      <span className="text-sm">{feature.bas}</span>
                    </td>
                    <td 
                      className={getColumnStyle('Silver')}
                      onClick={() => handleSlaSelect('Silver')}
                    >
                      <span className="text-sm">{feature.silver}</span>
                    </td>
                    <td 
                      className={getColumnStyle('Guld')}
                      onClick={() => handleSlaSelect('Guld')}
                    >
                      <span className="text-sm">{feature.guld}</span>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}

            {/* Bäst för rad */}
            <tr>
              <td className="p-3 border border-slate-200 font-medium text-slate-700 text-sm bg-slate-50">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Bäst för
                </div>
              </td>
              <td 
                className={getColumnStyle('Bas')}
                onClick={() => handleSlaSelect('Bas')}
              >
                <span className="text-sm font-medium">Nya kliniker</span>
              </td>
              <td 
                className={getColumnStyle('Silver')}
                onClick={() => handleSlaSelect('Silver')}
              >
                <span className="text-sm font-medium">Växande kliniker</span>
              </td>
              <td 
                className={getColumnStyle('Guld')}
                onClick={() => handleSlaSelect('Guld')}
              >
                <span className="text-sm font-medium">Etablerade kliniker</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Avtalsinfo */}
      <div className="text-xs text-gray-500 text-center italic mt-4 pt-4 border-t border-slate-200">
        *Avtalet är obundet löpande 3 månader (kvartalsvis) och faktureras i förskott
      </div>
    </div>
  );
};