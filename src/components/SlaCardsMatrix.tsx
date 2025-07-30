import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Shield, Headphones, Timer, Zap, CreditCard, Target } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';

export const SlaCardsMatrix: React.FC = () => {
  // Statiska värden för showcase (inte beroende av Calculator context)
  const baseLeasingCost = 25835; // Exempel för Emerald
  const silverCost = Math.round(baseLeasingCost * 0.25); // 25% av leasing
  const guldCost = Math.round(baseLeasingCost * 0.50);   // 50% av leasing

  const slaOptions = [
    {
      id: 'brons',
      title: 'Bas (Ingår)',
      price: 0,
      color: 'blue',
      radioSelected: true,
      features: [
        { icon: Clock, text: '12 månader garanti' },
        { icon: Headphones, text: 'Grundsupport (vardagar)' },
        { icon: Timer, text: 'Servicetid vardagar' },
        { icon: Shield, text: 'Responstid 336h' },
        { icon: Zap, text: 'Max åtgärdstid: Inom rimlig tid' }
      ],
      credits: 224, // Standard credit-kostnad
      bestFor: 'Nya kliniker',
      description: 'Grundläggande support och service'
    },
    {
      id: 'silver',
      title: 'Silver',
      price: silverCost,
      color: 'slate',
      radioSelected: false,
      features: [
        { icon: Clock, text: '24 månader garanti' },
        { icon: Headphones, text: 'Prioriterad support (5d/v, 9-15)' },
        { icon: Timer, text: '24h registrering' },
        { icon: Shield, text: '72h omfattande fel' },
        { icon: Zap, text: 'Lånemaskin vid service' }
      ],
      credits: 2998, // 50% rabatt på flatrate
      bestFor: 'Växande kliniker',
      description: 'Förbättrad support och snabbare service'
    },
    {
      id: 'guld',
      title: 'Guld',
      price: guldCost,
      color: 'yellow',
      radioSelected: false,
      features: [
        { icon: Clock, text: '24 månader garanti' },
        { icon: Headphones, text: '7d/v högsta prioritet support 00-24' },
        { icon: Timer, text: 'Omedelbar registrering' },
        { icon: Shield, text: '48h omfattande fel' },
        { icon: Zap, text: 'Årlig service + lånemaskin' }
      ],
      credits: 0, // 100% rabatt på credits
      bestFor: 'Etablerade kliniker',
      description: 'Premium support med högsta prioritet'
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = 'border-2 transition-all duration-300 hover:shadow-lg';
    
    switch (color) {
      case 'blue':
        return `${baseClasses} ${isSelected ? 'border-blue-500 shadow-blue-100' : 'border-blue-200 hover:border-blue-300'}`;
      case 'slate':
        return `${baseClasses} ${isSelected ? 'border-slate-500 shadow-slate-100' : 'border-slate-200 hover:border-slate-300'}`;
      case 'yellow':
        return `${baseClasses} ${isSelected ? 'border-yellow-500 shadow-yellow-100' : 'border-yellow-200 hover:border-yellow-300'}`;
      default:
        return `${baseClasses} border-slate-200 hover:border-slate-300`;
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

  const getPriceColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-700';
      case 'slate': return 'text-slate-700';
      case 'yellow': return 'text-yellow-700';
      default: return 'text-slate-700';
    }
  };

  return (
    <section className="container max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Välj din SLA-nivå
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Service Level Agreement - välj den supportnivå som passar din klinik bäst
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {slaOptions.map((option) => (
          <Card 
            key={option.id} 
            className={getColorClasses(option.color, option.radioSelected)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    option.radioSelected 
                      ? `border-${option.color}-500 bg-${option.color}-500` 
                      : `border-${option.color}-300`
                  }`}>
                    {option.radioSelected && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {option.title}
                  </h3>
                </div>
                <div className={`text-right ${getPriceColor(option.color)}`}>
                  <div className="text-2xl font-bold">
                    {formatCurrency(option.price)}
                  </div>
                  <div className="text-sm text-slate-500">/ mån</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Features lista */}
              <div className="space-y-3">
                {option.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <feature.icon className={`h-4 w-4 ${getIconColor(option.color)}`} />
                    <span className="text-sm text-slate-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Credits sektion */}
              <div className={`p-3 rounded-lg border ${
                option.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                option.color === 'slate' ? 'bg-slate-50 border-slate-200' :
                'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className={`h-4 w-4 ${getIconColor(option.color)}`} />
                  <span className="text-sm font-medium text-slate-700">Credits:</span>
                </div>
                <div className="text-sm text-slate-600">
                  {option.credits === 0 ? (
                    <span className="font-semibold text-green-600">
                      Kostnadsfria (100% rabatt)
                    </span>
                  ) : (
                    <span>
                      {formatCurrency(option.credits)} {option.id === 'silver' ? '/ mån (50% rabatt)' : 'per credit'}
                    </span>
                  )}
                </div>
              </div>

              {/* Bäst för sektion */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className={`h-4 w-4 ${getIconColor(option.color)}`} />
                  <span className="text-sm font-medium text-slate-700">
                    Bäst för: {option.bestFor}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {option.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          💡 SLA-nivån kan justeras i kalkylatorn ovan för att se exakt påverkan på din månadskostnad
        </p>
      </div>
    </section>
  );
};