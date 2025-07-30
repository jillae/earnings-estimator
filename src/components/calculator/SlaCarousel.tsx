import React, { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { Check, Phone, Headphones, Crown, ChevronLeft, ChevronRight } from 'lucide-react';

const SlaCarousel: React.FC = () => {
  const { 
    selectedSlaLevel, 
    setSlaLevel, 
    slaCosts,
    selectedMachine,
  } = useCalculator();

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    skipSnaps: false
  });

  const slaOptions = [
    {
      level: 'Brons' as const,
      icon: Phone,
      title: 'Brons',
      color: 'amber',
      features: [
        { name: 'Grundsupport', included: true },
        { name: 'E-post support', included: true },
        { name: 'Telefonsupport 8-17', included: true },
        { name: 'Fjärrdiagnostik', included: false },
        { name: 'Prioriterad support', included: false },
        { name: 'Credits inkluderade', included: false }
      ],
      cost: slaCosts.Brons || 0
    },
    {
      level: 'Silver' as const,
      icon: Headphones,
      title: 'Silver',
      color: 'slate',
      features: [
        { name: 'Grundsupport', included: true },
        { name: 'E-post support', included: true },
        { name: 'Telefonsupport 8-17', included: true },
        { name: 'Fjärrdiagnostik', included: true },
        { name: 'Prioriterad support', included: true },
        { name: 'Credits inkluderade', included: selectedMachine?.usesCredits || false }
      ],
      cost: slaCosts.Silver || 0
    },
    {
      level: 'Guld' as const,
      icon: Crown,
      title: 'Guld',
      color: 'yellow',
      features: [
        { name: 'Grundsupport', included: true },
        { name: 'E-post support', included: true },
        { name: 'Telefonsupport 8-17', included: true },
        { name: 'Fjärrdiagnostik', included: true },
        { name: 'Prioriterad support', included: true },
        { name: 'Credits inkluderade', included: selectedMachine?.usesCredits || false }
      ],
      cost: slaCosts.Guld || 0
    }
  ];

  const selectedIndex = slaOptions.findIndex(option => option.level === selectedSlaLevel);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const handleSlaSelect = (level: 'Brons' | 'Silver' | 'Guld') => {
    setSlaLevel(level);
    const targetIndex = slaOptions.findIndex(option => option.level === level);
    emblaApi && emblaApi.scrollTo(targetIndex);
  };

  return (
    <div className="glass-card mt-4 animate-slide-in bg-red-50/20 border-red-200 hover:bg-red-50/30 transition-colors" style={{ animationDelay: '350ms' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="w-2 h-2 bg-red-400 rounded-sm mr-2"></span>
          Serviceavtal (SLA)
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={scrollPrev} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollNext} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slaOptions.map((option, index) => {
            const IconComponent = option.icon;
            const isSelected = option.level === selectedSlaLevel;
            const isVisible = Math.abs(index - selectedIndex) <= 1; // Visa nuvarande + intilliggande

            return (
              <div 
                key={option.level} 
                className={`flex-[0_0_85%] min-w-0 px-2 transition-all duration-300 ${
                  isSelected ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
                }`}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-red-400 bg-red-50 shadow-lg' 
                      : 'border-slate-200 hover:border-red-300 hover:shadow-md'
                  }`}
                  onClick={() => handleSlaSelect(option.level)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-6 w-6 ${
                          option.color === 'amber' ? 'text-amber-600' :
                          option.color === 'slate' ? 'text-slate-600' :
                          'text-yellow-600'
                        }`} />
                        <div>
                          <h4 className="font-semibold text-slate-900">{option.title}</h4>
                          <p className="text-sm text-slate-600">{formatCurrency(option.cost)}/mån</p>
                        </div>
                      </div>
                      {isSelected && (
                        <Badge variant="default" className="bg-red-600">
                          <Check className="h-3 w-3 mr-1" />
                          VALD
                        </Badge>
                      )}
                    </div>

                    {/* Kompakt funktionslista */}
                    <div className="space-y-1">
                      {option.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{feature.name}</span>
                          <span className={feature.included ? 'text-emerald-600' : 'text-slate-400'}>
                            {feature.included ? '✓' : '✗'}
                          </span>
                        </div>
                      ))}
                      {option.features.length > 4 && (
                        <div className="text-xs text-slate-500 text-center pt-1">
                          +{option.features.length - 4} fler funktioner
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indikatorpunkter */}
      <div className="flex justify-center gap-2 mt-4">
        {slaOptions.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === selectedIndex ? 'bg-red-400' : 'bg-slate-300'
            }`}
            onClick={() => {
              handleSlaSelect(slaOptions[index].level);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SlaCarousel;