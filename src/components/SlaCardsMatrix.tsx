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

  // Mappa SLA-nivåer till IDs för jämförelse
  const slaMap = {
    'Bas': 'brons',
    'Silver': 'silver', 
    'Guld': 'guld'
  };

  const activeTab = slaMap[selectedDriftpaket] || 'brons';

  const slaOptions = [
    {
      id: 'brons',
      driftpaket: 'Bas' as DriftpaketType,
      title: 'Bas',
      subtitle: '(Ingår)',
      price: 0,
      color: 'blue',
      features: [
        { icon: Clock, text: '12 månader garanti' },
        { icon: Shield, text: 'Grundsupport (vardagar)' },
        { icon: Shield, text: 'Servicetid vardagar' },
        { icon: Shield, text: 'Responstid 336h' },
        { icon: Shield, text: 'Max åtgärdstid: Inom rimlig tid' }
      ],
      additionalFeatures: selectedMachine.usesCredits ? [
        { 
          icon: CreditCard, 
          text: `Credits: ${useFlatrateOption === 'flatrate' ? 'Flatrate' : `${formatCurrency(creditPrice)} per credit`}`,
          highlight: false
        }
      ] : [],
      bestFor: 'Nya kliniker',
      description: 'Grundläggande support och service'
    },
    {
      id: 'silver',
      driftpaket: 'Silver' as DriftpaketType,
      title: 'Silver',
      subtitle: '',
      price: calculatedSlaCostSilver,
      color: 'slate',
      features: [
        { icon: Clock, text: '24 månader garanti' },
        { icon: ShieldCheck, text: 'Prioriterad Support (5 dagar/vecka)' },
        { icon: ShieldCheck, text: 'Servicetid vardagar 9-15' },
        { icon: ShieldCheck, text: 'Responstid 24h' },
        { icon: ShieldCheck, text: 'Max åtgärdstid 72h' },
        { icon: Check, text: 'Årlig service (resekostnad ingår)' },
        { icon: Check, text: 'Lånemaskin vid servicebehov' }
      ],
      additionalFeatures: selectedMachine.usesCredits ? [
        { 
          icon: CreditCard, 
          text: '50% rabatt på Flatrate Credits',
          highlight: true
        }
      ] : [],
      bestFor: 'Växande kliniker',
      description: 'Förbättrad support och snabbare service'
    },
    {
      id: 'guld',
      driftpaket: 'Guld' as DriftpaketType,
      title: 'Guld',
      subtitle: '',
      price: calculatedSlaCostGuld,
      color: 'yellow',
      features: [
        { icon: Clock, text: '24 månader garanti' },
        { icon: ShieldCheck, text: 'Högsta Prioritet Support (7 dagar/vecka)' },
        { icon: ShieldCheck, text: 'Servicetid alla dagar 00-24' },
        { icon: ShieldCheck, text: 'Responstid omgående' },
        { icon: ShieldCheck, text: 'Max åtgärdstid 48h' },
        { icon: Check, text: 'Årlig service (res och arbetskostnad ingår)' },
        { icon: Check, text: 'Lånemaskin vid servicebehov' }
      ],
      additionalFeatures: selectedMachine.usesCredits ? [
        { 
          icon: CreditCard, 
          text: 'Flatrate Credits Ingår (100%)',
          highlight: true
        }
      ] : [],
      bestFor: 'Etablerade kliniker',
      description: 'Premium support med högsta prioritet'
    }
  ];

  const activeOption = slaOptions.find(option => option.id === activeTab) || slaOptions[0];

  const handleTabChange = (optionId: string) => {
    const option = slaOptions.find(opt => opt.id === optionId);
    if (option) {
      setSelectedDriftpaket(option.driftpaket);
    }
  };

  const getTabStyle = (option: any, isActive: boolean) => {
    const baseStyle = "flex-1 p-4 text-center border-b-2 transition-all duration-300 cursor-pointer hover:bg-slate-50";
    
    if (isActive) {
      switch (option.color) {
        case 'blue':
          return `${baseStyle} border-blue-500 bg-blue-50 text-blue-700`;
        case 'slate':
          return `${baseStyle} border-slate-500 bg-slate-50 text-slate-700`;
        case 'yellow':
          return `${baseStyle} border-yellow-500 bg-yellow-50 text-yellow-700`;
        default:
          return `${baseStyle} border-slate-500 bg-slate-50`;
      }
    }
    
    return `${baseStyle} border-slate-200 text-slate-600 hover:border-slate-300`;
  };

  const getPanelStyle = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-white';
      case 'slate':
        return 'border-slate-200 bg-gradient-to-br from-slate-50/50 to-white';
      case 'yellow':
        return 'border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-white';
      default:
        return 'border-slate-200 bg-white';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'slate': return 'text-slate-600';
      case 'yellow': return 'text-yellow-600';
      default: return 'text-slate-600';
    }
  };

  const getRadioIcon = (color: string) => {
    switch (color) {
      case 'blue': return '🔵';
      case 'slate': return '⚪';
      case 'yellow': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="glass-card animate-slide-in" style={{ animationDelay: '300ms' }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Välj Service & Driftpaket
        </h3>
        <p className="text-sm text-slate-600">
          Service Level Agreement - jämför alternativen och välj det som passar din klinik
        </p>
      </div>

      {/* Alla tre kort visas samtidigt */}
      <div className="grid md:grid-cols-3 gap-4">
        {slaOptions.map((option) => {
          const isSelected = option.id === activeTab;
          
          return (
            <Card 
              key={option.id}
              onClick={() => handleTabChange(option.id)}
              className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                isSelected 
                  ? `ring-2 ${
                      option.color === 'blue' ? 'ring-blue-500 bg-blue-50/50' :
                      option.color === 'slate' ? 'ring-slate-500 bg-slate-50/50' :
                      'ring-yellow-500 bg-yellow-50/50'
                    }` 
                  : 'hover:shadow-sm border-slate-200'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getRadioIcon(option.color)}</span>
                    <div>
                      <h4 className={`font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                        {option.title} {option.subtitle}
                      </h4>
                      {isSelected && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            option.color === 'blue' ? 'bg-blue-500' :
                            option.color === 'slate' ? 'bg-slate-500' :
                            'bg-yellow-500'
                          }`} />
                          <span className="text-xs text-slate-600 font-medium">VALT</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                      {formatCurrency(option.price)}
                    </div>
                    <div className="text-xs text-slate-500">/ mån</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1">{option.description}</p>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Huvudfunktioner */}
                <div className="space-y-2">
                  {option.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <feature.icon className={`h-3 w-3 ${getIconColor(option.color)}`} />
                      <span className="text-xs text-slate-700">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Övriga funktioner */}
                {option.features.length > 3 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {option.features.slice(3).map((feature, index) => (
                      <div key={index + 3} className="flex items-center gap-2">
                        <feature.icon className={`h-3 w-3 ${getIconColor(option.color)}`} />
                        <span className="text-xs text-slate-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ytterligare funktioner (credits etc) */}
                {option.additionalFeatures && option.additionalFeatures.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {option.additionalFeatures.map((feature, index) => (
                      <div key={`additional-${index}`} className="flex items-center gap-2">
                        <feature.icon className={`h-3 w-3 ${feature.highlight ? 'text-green-600' : getIconColor(option.color)}`} />
                        <span className={`text-xs ${feature.highlight ? 'text-green-700 font-medium' : 'text-slate-700'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bäst för */}
                <div className={`p-2 rounded-md text-center ${
                  option.color === 'blue' ? 'bg-blue-50 border border-blue-200' :
                  option.color === 'slate' ? 'bg-slate-50 border border-slate-200' :
                  'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className={`h-3 w-3 ${getIconColor(option.color)}`} />
                    <span className="text-xs font-semibold text-slate-700">Bäst för:</span>
                  </div>
                  <div className="text-xs text-slate-600">{option.bestFor}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Avtalsinfo */}
      <div className="text-xs text-gray-500 text-center italic mt-4 pt-4 border-t border-slate-200">
        *Avtalet är obundet löpande 3 månader (kvartalsvis) och faktureras i förskott
      </div>
    </div>
  );
};