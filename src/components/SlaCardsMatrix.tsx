import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    const baseStyle = "p-3 text-center cursor-pointer transition-all duration-300 hover:bg-slate-50/80 border-r border-slate-100 last:border-r-0";
    
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
    const baseStyle = "p-4 text-center font-semibold cursor-pointer transition-all duration-300 hover:bg-slate-50/80 border-r border-slate-100 last:border-r-0";
    
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
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3">
          Välj Service & Driftpaket
        </h3>
        <p className="text-slate-600 leading-relaxed">
          Jämför alternativen och välj det som passar din klinik bäst.
        </p>
      </div>

      <Tabs value={selectedDriftpaket} onValueChange={(value) => handleSlaSelect(value as DriftpaketType)} className="w-full">
        {/* Tab Headers */}
        <TabsList className="grid w-full grid-cols-3 h-auto bg-muted/30 p-1 rounded-lg">
          <TabsTrigger 
            value="Bas" 
            className="flex-col h-auto py-4 px-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 data-[state=active]:shadow-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🔵</span>
              <span className="font-bold text-base">Bas</span>
            </div>
            <div className="text-xs opacity-80">(Ingår)</div>
            <div className="font-bold text-lg">{formatCurrency(0)}</div>
            <div className="text-xs opacity-70">/ mån</div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="Silver" 
            className="flex-col h-auto py-4 px-3 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚪</span>
              <span className="font-bold text-base">Silver</span>
            </div>
            <div className="text-xs opacity-80">&nbsp;</div>
            <div className="font-bold text-lg">{formatCurrency(calculatedSlaCostSilver)}</div>
            <div className="text-xs opacity-70">/ mån</div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="Guld" 
            className="flex-col h-auto py-4 px-3 data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900 data-[state=active]:shadow-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🟡</span>
              <span className="font-bold text-base">Guld</span>
            </div>
            <div className="text-xs opacity-80">&nbsp;</div>
            <div className="font-bold text-lg">{formatCurrency(calculatedSlaCostGuld)}</div>
            <div className="text-xs opacity-70">/ mån</div>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content - Compact Feature Lists */}
        <div className="mt-6">
          <TabsContent value="Bas" className="mt-0">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔵</span>
                  <div>
                    <h4 className="text-lg font-bold text-blue-900">Bas-paket</h4>
                    <p className="text-sm text-blue-700">Grundläggande skydd för nya kliniker</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium text-slate-800">🛡️ Garanti & Support</div>
                    <ul className="space-y-1 pl-4 text-slate-700">
                      <li>• 12 månaders garanti</li>
                      <li>• Grundsupport (vardagar)</li>
                      <li>• Responstid: 336h</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-slate-800">🔧 Service & Underhåll</div>
                    <ul className="space-y-1 pl-4 text-slate-700">
                      <li>• Service vardagar</li>
                      <li>• Åtgärd inom rimlig tid</li>
                      <li>• Ingen årlig service</li>
                      <li>• Ingen lånemaskin</li>
                    </ul>
                  </div>
                </div>
                {selectedMachine.usesCredits && (
                  <div className="pt-2 border-t border-blue-200">
                    <div className="font-medium text-slate-800 mb-1">💳 Credits</div>
                    <p className="text-slate-700 text-sm">
                      {useFlatrateOption === 'flatrate' ? 'Flatrate' : `${formatCurrency(creditPrice)} per credit`}
                    </p>
                  </div>
                )}
                <div className="pt-2 border-t border-blue-200">
                  <div className="font-medium text-blue-800">🎯 Bäst för: Nya kliniker</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Silver" className="mt-0">
            <Card className="border-slate-300 bg-slate-50/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚪</span>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Silver-paket</h4>
                    <p className="text-sm text-slate-700">Utökad service för växande verksamheter</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium text-slate-800">🛡️ Garanti & Support</div>
                    <ul className="space-y-1 pl-4 text-slate-700">
                      <li>• 24 månaders garanti</li>
                      <li>• Prioriterad support (5d/v, 9-15)</li>
                      <li>• Responstid: 24h</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-slate-800">🔧 Service & Underhåll</div>
                    <ul className="space-y-1 pl-4 text-slate-700">
                      <li>• Service vardagar 9-15</li>
                      <li>• Max åtgärdstid: 72h</li>
                      <li>• ✅ Årlig service (resekostnad ingår)</li>
                      <li>• ✅ Lånemaskin vid service</li>
                    </ul>
                  </div>
                </div>
                {selectedMachine.usesCredits && (
                  <div className="pt-2 border-t border-slate-300">
                    <div className="font-medium text-slate-800 mb-1">💳 Credits</div>
                    <p className="text-slate-700 text-sm">50% rabatt på Flatrate</p>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-300">
                  <div className="font-medium text-slate-800">🎯 Bäst för: Växande kliniker</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Guld" className="mt-0">
            <Card className="border-yellow-300 bg-yellow-50/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🟡</span>
                  <div>
                    <h4 className="text-lg font-bold text-yellow-900">Guld-paket</h4>
                    <p className="text-sm text-yellow-700">Premium-service för etablerade kliniker</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium text-slate-800">🛡️ Garanti & Support</div>
                    <ul className="space-y-1 pl-4 text-slate-700">
                      <li>• 24 månaders garanti</li>
                      <li>• Högsta prioritet (7d/v, 00-24)</li>
                      <li>• Responstid: Omgående</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-slate-800">🔧 Service & Underhåll</div>
                    <ul className="space-y-1 pl-4 text-slate-700">
                      <li>• Service alla dagar 00-24</li>
                      <li>• Max åtgärdstid: 48h</li>
                      <li>• ✅ Årlig service (res + arbete ingår)</li>
                      <li>• ✅ Lånemaskin vid service</li>
                    </ul>
                  </div>
                </div>
                {selectedMachine.usesCredits && (
                  <div className="pt-2 border-t border-yellow-300">
                    <div className="font-medium text-slate-800 mb-1">💳 Credits</div>
                    <p className="text-slate-700 text-sm">Flatrate Credits Ingår (100%)</p>
                  </div>
                )}
                <div className="pt-2 border-t border-yellow-300">
                  <div className="font-medium text-yellow-800">🎯 Bäst för: Etablerade kliniker</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Avtalsinfo */}
      <div className="text-xs text-slate-500 text-center italic mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <span className="font-medium">📄 Avtalsvillkor:</span> Avtalet är obundet löpande 3 månader (kvartalsvis) och faktureras i förskott
      </div>
    </div>
  );
};