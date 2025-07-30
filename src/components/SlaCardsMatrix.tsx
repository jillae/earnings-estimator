import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Shield, Headphones, Timer, Zap, CreditCard, Target } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';

export const SlaCardsMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState('brons');

  // Statiska värden för showcase
  const baseLeasingCost = 25835; // Exempel för Emerald
  const silverCost = Math.round(baseLeasingCost * 0.25); // 25% av leasing
  const guldCost = Math.round(baseLeasingCost * 0.50);   // 50% av leasing

  const slaOptions = [
    {
      id: 'brons',
      title: 'Bas',
      subtitle: '(Ingår)',
      price: 0,
      color: 'blue',
      features: [
        { icon: Clock, text: '12 månader garanti' },
        { icon: Headphones, text: 'Grundsupport (vardagar)' },
        { icon: Timer, text: 'Servicetid vardagar' },
        { icon: Shield, text: 'Responstid 336h' },
        { icon: Zap, text: 'Max åtgärdstid: Inom rimlig tid' }
      ],
      credits: 224,
      creditText: 'per credit',
      bestFor: 'Nya kliniker',
      description: 'Grundläggande support och service'
    },
    {
      id: 'silver',
      title: 'Silver',
      subtitle: '',
      price: silverCost,
      color: 'slate',
      features: [
        { icon: Clock, text: '24 månader garanti' },
        { icon: Headphones, text: 'Prioriterad support (5d/v, 9-15)' },
        { icon: Timer, text: '24h registrering' },
        { icon: Shield, text: '72h omfattande fel' },
        { icon: Zap, text: 'Lånemaskin vid service' }
      ],
      credits: 2998,
      creditText: '/ mån (50% rabatt)',
      bestFor: 'Växande kliniker',
      description: 'Förbättrad support och snabbare service'
    },
    {
      id: 'guld',
      title: 'Guld',
      subtitle: '',
      price: guldCost,
      color: 'yellow',
      features: [
        { icon: Clock, text: '24 månader garanti' },
        { icon: Headphones, text: '7d/v högsta prioritet support 00-24' },
        { icon: Timer, text: 'Omedelbar registrering' },
        { icon: Shield, text: '48h omfattande fel' },
        { icon: Zap, text: 'Årlig service + lånemaskin' }
      ],
      credits: 0,
      creditText: '(100% rabatt)',
      bestFor: 'Etablerade kliniker',
      description: 'Premium support med högsta prioritet'
    }
  ];

  const activeOption = slaOptions.find(option => option.id === activeTab) || slaOptions[0];

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
    <section className="container max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Välj din SLA-nivå
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Service Level Agreement - jämför alternativen och se hur de påverkar din totalkostnad
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Flikar */}
        <div className="flex border border-slate-200 rounded-t-lg overflow-hidden bg-white shadow-sm">
          {slaOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setActiveTab(option.id)}
              className={getTabStyle(option, activeTab === option.id)}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg">{getRadioIcon(option.color)}</span>
                <h3 className="font-bold text-lg">
                  {option.title} {option.subtitle}
                </h3>
              </div>
              <div className="text-sm font-semibold">
                {formatCurrency(option.price)} / mån
              </div>
            </div>
          ))}
        </div>

        {/* Aktiv panel */}
        <Card className={`border-t-0 rounded-t-none shadow-lg ${getPanelStyle(activeOption.color)}`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getRadioIcon(activeOption.color)}</span>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {activeOption.title} {activeOption.subtitle}
                  </h3>
                  <p className="text-slate-600">{activeOption.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(activeOption.price)}
                </div>
                <div className="text-sm text-slate-500">/ mån</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {activeOption.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <feature.icon className={`h-5 w-5 ${getIconColor(activeOption.color)}`} />
                    <span className="text-slate-700">{feature.text}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {activeOption.features.slice(3).map((feature, index) => (
                  <div key={index + 3} className="flex items-center gap-3">
                    <feature.icon className={`h-5 w-5 ${getIconColor(activeOption.color)}`} />
                    <span className="text-slate-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credits och Bäst för sektion */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div className={`p-4 rounded-lg border ${
                activeOption.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                activeOption.color === 'slate' ? 'bg-slate-50 border-slate-200' :
                'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className={`h-5 w-5 ${getIconColor(activeOption.color)}`} />
                  <span className="font-semibold text-slate-700">Credits:</span>
                </div>
                <div className="text-slate-600">
                  {activeOption.credits === 0 ? (
                    <span className="font-semibold text-green-600">
                      Kostnadsfria {activeOption.creditText}
                    </span>
                  ) : (
                    <span>
                      {formatCurrency(activeOption.credits)} {activeOption.creditText}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <Target className={`h-5 w-5 ${getIconColor(activeOption.color)}`} />
                  <span className="font-semibold text-slate-700">Bäst för:</span>
                </div>
                <div className="text-slate-600">{activeOption.bestFor}</div>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                💡 Justera SLA-nivån i kalkylatorn ovan för att se exakt påverkan på din totalkostnad
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};