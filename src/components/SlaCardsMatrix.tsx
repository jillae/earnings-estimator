import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Shield, Headphones, Timer, Zap, CreditCard, Target, ShieldCheck, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { useCalculator } from '@/context/CalculatorContext';
import { DriftpaketType } from '@/types/calculator';

interface SlaCardsMatrixProps {
  hoveredInput?: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null;
  onHoveredInputChange?: (input: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null) => void;
}

export const SlaCardsMatrix: React.FC<SlaCardsMatrixProps> = ({ 
  hoveredInput, 
  onHoveredInputChange 
}) => {
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
      <div className="glass-card animate-slide-in bg-red-50/20 border-red-200" style={{ animationDelay: '300ms' }}>
        <div className="text-center py-8">
          <p className="text-slate-500">Välj en maskin för att se SLA-alternativ</p>
        </div>
      </div>
    );
  }

  const handleSlaSelect = (slaLevel: DriftpaketType) => {
    setSelectedDriftpaket(slaLevel);
  };

  // Definiera alla rader i tabellen med fasta positioner
  const tableRows = [
    {
      category: 'Garanti & Support',
      features: [
        {
          label: 'Garanti',
          brons: '12 månader',
          silver: '24 månader',
          guld: '24 månader'
        },
        {
          label: 'Support',
          brons: 'Grundsupport',
          silver: 'Prioriterad support',
          guld: 'Premium support'
        },
        {
          label: 'Responstid',
          brons: '336h',
          silver: '24h',
          guld: 'Omgående'
        }
      ]
    },
    {
      category: 'Service',
      features: [
        {
          label: 'Servicetid',
          brons: 'Vardagar',
          silver: '5d/v, 9-15h',
          guld: '7d/v, 00-24h'
        },
        {
          label: 'Max åtgärdstid',
          brons: 'Rimlig tid',
          silver: '72h',
          guld: '48h'
        },
        {
          label: 'Årlig service',
          brons: 'Ej ingår',
          silver: 'Ingår (res)',
          guld: 'Ingår (res+arbete)'
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
          brons: useFlatrateOption === 'flatrate' ? 'Ja' : `${formatCurrency(creditPrice)}/credit`,
          silver: 'Med SLA Silver: 50% rabatt',
          guld: '0 kr' // Visa 0 kr istället för text för Guld-paketet
        }
      ]
    });
  }

  const getSlaLevel = (level: string): 'Bas' | 'Silver' | 'Guld' => {
    switch(level) {
      case 'brons': return 'Bas';
      case 'silver': return 'Silver'; 
      case 'guld': return 'Guld';
      default: return 'Bas';
    }
  };

  const getSelectedIndex = () => {
    switch(selectedDriftpaket) {
      case 'Bas': return 0;
      case 'Silver': return 1;
      case 'Guld': return 2;
      default: return 0;
    }
  };

  const selectedIndex = getSelectedIndex();

  const getColumnStyle = (index: number, value: string) => {
    const isSelected = index === selectedIndex;
    const isPreviousSelection = index < selectedIndex;
    
    const baseClasses = "p-3 text-center border-r border-slate-200 last:border-r-0 transition-all duration-200";
    
    if (isSelected) {
      return `${baseClasses} bg-red-100 border-red-300 font-semibold text-slate-900`;
    } else if (isPreviousSelection) {
      return `${baseClasses} bg-slate-50 text-slate-500 opacity-70`; // Mindre gråat så text syns bättre
    } else {
      return `${baseClasses} bg-white text-slate-600`;
    }
  };

  const getHeaderStyle = (index: number, slaLevel: string) => {
    const isSelected = index === selectedIndex;
    const isPreviousSelection = index < selectedIndex;
    
    const baseClasses = "p-4 text-center font-bold cursor-pointer border-r border-slate-200 last:border-r-0 transition-all duration-200 hover:bg-slate-50";
    
    // Olika kulörer för de olika SLA-nivåerna
    if (isSelected) {
      if (index === 0) {
        return `${baseClasses} bg-emerald-200 border-emerald-300 text-emerald-900 ring-2 ring-emerald-300`;
      } else if (index === 1) {
        return `${baseClasses} bg-blue-200 border-blue-300 text-blue-900 ring-2 ring-blue-300`;
      } else {
        return `${baseClasses} bg-purple-200 border-purple-300 text-purple-900 ring-2 ring-purple-300`;
      }
    } else if (isPreviousSelection) {
      return `${baseClasses} bg-slate-100 text-slate-500 opacity-70`;
    } else {
      return `${baseClasses} bg-slate-50 text-slate-700 hover:bg-slate-100`;
    }
  };

  const getHeaderText = (index: number, slaLevel: string, cost: number) => {
    const isPreviousSelection = index < selectedIndex;
    const levelText = slaLevel.charAt(0).toUpperCase() + slaLevel.slice(1);
    
    if (isPreviousSelection) {
      return (
        <div>
          <div className="opacity-70">{levelText}</div>
          <div className="text-xs opacity-70">{formatCurrency(cost)}/mån</div>
          <Badge variant="secondary" className="text-xs mt-1 opacity-70">
            Ingår
          </Badge>
        </div>
      ); // Mindre opacity så text syns bättre
    }
    
    return (
      <div>
        <div>{levelText}</div>
        <div className="text-sm font-medium">{formatCurrency(cost)}/mån</div>
        {index === selectedIndex && (
          <Badge variant="default" className={`text-xs mt-1 ${
            index === 0 ? 'bg-emerald-600' : 
            index === 1 ? 'bg-blue-600' : 
            'bg-purple-600'
          }`}>
            <Check className="h-3 w-3 mr-1" />
            VALD
          </Badge>
        )}
      </div>
    );
  };

  const costs = [0, calculatedSlaCostSilver, calculatedSlaCostGuld];
  const levels = ['brons', 'silver', 'guld'];

  return (
    <div 
      className="glass-card animate-slide-in bg-red-50/20 border-red-200 hover:bg-red-50/30 hover:shadow-lg transition-all duration-200" 
      style={{ animationDelay: '300ms' }}
      onMouseEnter={() => onHoveredInputChange?.('sla')}
      onMouseLeave={() => onHoveredInputChange?.(null)}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Välj Service & Driftpaket
        </h3>
        <p className="text-slate-600 text-sm">
          Jämför paketen och välj det som passar din klinik bäst.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full bg-white rounded-lg border border-slate-200 shadow-sm">
          
          {/* Header Row */}
          <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
            <div className="p-4 font-semibold text-slate-700 border-r border-slate-200 text-base">Funktioner</div>
            {levels.map((level, index) => (
              <div 
                key={level}
                className={getHeaderStyle(index, level)}
                onClick={() => handleSlaSelect(getSlaLevel(level))}
              >
                {getHeaderText(index, level, costs[index])}
              </div>
            ))}
          </div>

          {/* Feature Rows */}
          {tableRows.map((category, categoryIndex) => (
            <React.Fragment key={categoryIndex}>
              {/* Category Header */}
              <div className="grid grid-cols-4 bg-slate-25 border-b border-slate-100">
                <div className="p-3 font-medium text-slate-800 text-sm border-r border-slate-200 col-span-4">
                  {category.category}
                </div>
              </div>
              
              {/* Features */}
              {category.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="grid grid-cols-4 border-b border-slate-100 last:border-b-0">
                  <div className="p-3 text-left text-slate-700 font-medium text-base border-r border-slate-200 bg-slate-25">
                    {feature.label}
                  </div>
                  <div className={getColumnStyle(0, feature.brons)}>
                    <div className="text-base leading-tight">{feature.brons}</div>
                  </div>
                  <div className={getColumnStyle(1, feature.silver)}>
                    <div className="text-base leading-tight">{feature.silver}</div>
                  </div>
                  <div className={getColumnStyle(2, feature.guld)}>
                    <div className="text-base leading-tight">{feature.guld}</div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};