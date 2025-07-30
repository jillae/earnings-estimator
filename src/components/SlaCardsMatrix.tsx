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
    const baseStyle = "p-6 text-center cursor-pointer transition-all duration-300 hover:bg-slate-50/80 border-r border-slate-100 last:border-r-0";
    
    if (isSelected) {
      switch (slaLevel) {
        case 'Bas':
          return `${baseStyle} bg-gradient-to-b from-blue-50 to-blue-100/50 ring-1 ring-blue-200 shadow-sm`;
        case 'Silver':
          return `${baseStyle} bg-gradient-to-b from-slate-50 to-slate-100/50 ring-1 ring-slate-200 shadow-sm`;
        case 'Guld':
          return `${baseStyle} bg-gradient-to-b from-yellow-50 to-yellow-100/50 ring-1 ring-yellow-200 shadow-sm`;
      }
    }
    
    return `${baseStyle} hover:shadow-sm`;
  };

  const getHeaderStyle = (slaLevel: DriftpaketType) => {
    const isSelected = selectedDriftpaket === slaLevel;
    const baseStyle = "p-6 text-center font-semibold cursor-pointer transition-all duration-300 hover:bg-slate-50/80 border-r border-slate-100 last:border-r-0";
    
    if (isSelected) {
      switch (slaLevel) {
        case 'Bas':
          return `${baseStyle} bg-gradient-to-b from-blue-100 to-blue-200/50 text-blue-900 ring-1 ring-blue-300 shadow-md`;
        case 'Silver':
          return `${baseStyle} bg-gradient-to-b from-slate-100 to-slate-200/50 text-slate-900 ring-1 ring-slate-300 shadow-md`;
        case 'Guld':
          return `${baseStyle} bg-gradient-to-b from-yellow-100 to-yellow-200/50 text-yellow-900 ring-1 ring-yellow-300 shadow-md`;
      }
    }
    
    return `${baseStyle} bg-gradient-to-b from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150`;
  };

  return (
    <div className="glass-card animate-slide-in" style={{ animationDelay: '300ms' }}>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-3">
          Välj Service & Driftpaket
        </h3>
        <p className="text-slate-600 leading-relaxed">
          Jämför alternativen och välj det som passar din klinik bäst. Klicka på en kolumn för att välja.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">{/* Remove border-collapse for better control */}
          {/* Header */}
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-6 text-left bg-gradient-to-r from-slate-50 to-slate-100 font-bold text-slate-800 border-r border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">📋</span>
                  <span>Vad ingår</span>
                </div>
              </th>
              <th 
                className={getHeaderStyle('Bas')}
                onClick={() => handleSlaSelect('Bas')}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🔵</span>
                    <span className="text-xl font-bold">Bas</span>
                  </div>
                  <div className="text-sm opacity-80">(Ingår)</div>
                  <div className="text-2xl font-bold">{formatCurrency(0)}</div>
                  <div className="text-sm opacity-70">/ mån</div>
                  {selectedDriftpaket === 'Bas' && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                      ✓ VALT
                    </div>
                  )}
                </div>
              </th>
              <th 
                className={getHeaderStyle('Silver')}
                onClick={() => handleSlaSelect('Silver')}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">⚪</span>
                    <span className="text-xl font-bold">Silver</span>
                  </div>
                  <div className="text-sm opacity-80">&nbsp;</div>
                  <div className="text-2xl font-bold">{formatCurrency(calculatedSlaCostSilver)}</div>
                  <div className="text-sm opacity-70">/ mån</div>
                  {selectedDriftpaket === 'Silver' && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-600 text-white text-xs font-bold rounded-full">
                      ✓ VALT
                    </div>
                  )}
                </div>
              </th>
              <th 
                className={getHeaderStyle('Guld')}
                onClick={() => handleSlaSelect('Guld')}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🟡</span>
                    <span className="text-xl font-bold">Guld</span>
                  </div>
                  <div className="text-sm opacity-80">&nbsp;</div>
                  <div className="text-2xl font-bold">{formatCurrency(calculatedSlaCostGuld)}</div>
                  <div className="text-sm opacity-70">/ mån</div>
                  {selectedDriftpaket === 'Guld' && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-600 text-white text-xs font-bold rounded-full">
                      ✓ VALT
                    </div>
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
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <td colSpan={4} className="p-4 font-bold text-slate-800 text-sm border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                      {section.category}
                    </div>
                  </td>
                </tr>
                
                {/* Section rows */}
                {section.features.map((feature, featureIndex) => (
                  <tr key={`${sectionIndex}-${featureIndex}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-700 bg-slate-50/50 border-r border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></span>
                        <span className="leading-tight">{feature.label}</span>
                      </div>
                    </td>
                    <td 
                      className={getColumnStyle('Bas')}
                      onClick={() => handleSlaSelect('Bas')}
                    >
                      <div className="font-medium text-slate-800 leading-tight">
                        {feature.bas}
                      </div>
                    </td>
                    <td 
                      className={getColumnStyle('Silver')}
                      onClick={() => handleSlaSelect('Silver')}
                    >
                      <div className="font-medium text-slate-800 leading-tight">
                        {feature.silver}
                      </div>
                    </td>
                    <td 
                      className={getColumnStyle('Guld')}
                      onClick={() => handleSlaSelect('Guld')}
                    >
                      <div className="font-medium text-slate-800 leading-tight">
                        {feature.guld}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}

            {/* Bäst för rad */}
            <tr className="border-t-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <td className="p-4 font-bold text-slate-800 bg-slate-100 border-r border-slate-100">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-slate-600" />
                  <span>Bäst för</span>
                </div>
              </td>
              <td 
                className={getColumnStyle('Bas')}
                onClick={() => handleSlaSelect('Bas')}
              >
                <div className="font-bold text-slate-900 py-2">Nya kliniker</div>
              </td>
              <td 
                className={getColumnStyle('Silver')}
                onClick={() => handleSlaSelect('Silver')}
              >
                <div className="font-bold text-slate-900 py-2">Växande kliniker</div>
              </td>
              <td 
                className={getColumnStyle('Guld')}
                onClick={() => handleSlaSelect('Guld')}
              >
                <div className="font-bold text-slate-900 py-2">Etablerade kliniker</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Avtalsinfo */}
      <div className="text-xs text-slate-500 text-center italic mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <span className="font-medium">📄 Avtalsvillkor:</span> Avtalet är obundet löpande 3 månader (kvartalsvis) och faktureras i förskott
    </div>
    </div>
  );
};