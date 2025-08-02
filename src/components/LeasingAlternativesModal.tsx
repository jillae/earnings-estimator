import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, ExternalLink } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

interface LeasingAlternative {
  rank: number;
  name: string;
  monthlyCost: number;
  description: string;
  fastPrice: boolean;
  creditFree: boolean;
  slaLevel: 'Guld' | 'Silver' | 'Brons';
  yearlyService: boolean;
  loanMachine: boolean;
}

const LeasingAlternativesModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { selectedMachine } = useCalculator();

  // Simulerad data baserat på bilden
  const alternatives: LeasingAlternative[] = [
    {
      rank: 1,
      name: 'Standard + SLA Guld',
      monthlyCost: 38753,
      description: '25 835 kr (leasing) + 12 918 kr (SLA Guld)',
      fastPrice: true,
      creditFree: true,
      slaLevel: 'Guld',
      yearlyService: true,
      loanMachine: true
    },
    {
      rank: 2,
      name: 'Standard + SLA Silver',
      monthlyCost: 35292,
      description: '25 835 kr (leasing) + 6 459 kr (SLA Silver) + 2 998 kr (Flatrate)',
      fastPrice: true,
      creditFree: false,
      slaLevel: 'Silver',
      yearlyService: false,
      loanMachine: true
    },
    {
      rank: 3,
      name: 'Allt-inkluderat',
      monthlyCost: 33863,
      description: '33 863 kr (leasing med inkluderade credits)',
      fastPrice: true,
      creditFree: true,
      slaLevel: 'Brons',
      yearlyService: false,
      loanMachine: false
    },
    {
      rank: 4,
      name: 'Standard + Flatrate',
      monthlyCost: 31831,
      description: '25 835 kr (leasing) + 5 996 kr (Flatrate)',
      fastPrice: true,
      creditFree: false,
      slaLevel: 'Brons',
      yearlyService: false,
      loanMachine: false
    },
    {
      rank: 5,
      name: 'Standard + SLA Brons',
      monthlyCost: 25835,
      description: '25 835 kr (endast leasing)',
      fastPrice: false,
      creditFree: false,
      slaLevel: 'Brons',
      yearlyService: false,
      loanMachine: false
    }
  ];

  const getSlaColor = (level: string) => {
    switch (level) {
      case 'Guld': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Brons': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="p-4 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">📋 Se alla kundalternativ</h4>
              <p className="text-sm text-blue-700">
                Detaljerad jämförelse av månadskostnader för {selectedMachine?.name || 'vald maskin'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white">
                5 alternativ
              </Badge>
              <ExternalLink className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📊 Detaljerad Jämförelse av Kundalternativ - {selectedMachine?.name || 'Emerald'}
            <Badge variant="outline" className="ml-2">60 månader</Badge>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Alla priser är månadskostnader för 60 månader, exkl. moms. Rangordnade efter totalkostnad.
          </p>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {alternatives.map((alt) => (
              <Card key={alt.rank} className={`p-4 ${alt.rank === 1 ? 'border-green-200 bg-green-50' : ''}`}>
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Rang */}
                  <div className="col-span-1 text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      alt.rank === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {alt.rank}
                    </div>
                  </div>

                  {/* Alternativ */}
                  <div className="col-span-3">
                    <h4 className="font-semibold text-sm">{alt.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{alt.description}</p>
                  </div>

                  {/* Månadskostnad */}
                  <div className="col-span-2 text-right">
                    <p className="text-lg font-bold">{formatCurrency(alt.monthlyCost)}</p>
                    <p className="text-xs text-muted-foreground">(SEK)</p>
                  </div>

                  {/* Fastpris */}
                  <div className="col-span-1 text-center">
                    {alt.fastPrice ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 mx-auto" />
                    )}
                  </div>

                  {/* Kostnadsfria Credits */}
                  <div className="col-span-1 text-center">
                    {alt.creditFree ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 mx-auto" />
                    )}
                  </div>

                  {/* SLA-nivå */}
                  <div className="col-span-1 text-center">
                    <Badge className={`text-xs ${getSlaColor(alt.slaLevel)}`}>
                      {alt.slaLevel}
                    </Badge>
                  </div>

                  {/* Årlig Service */}
                  <div className="col-span-1 text-center">
                    {alt.yearlyService ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 mx-auto" />
                    )}
                  </div>

                  {/* Lånemaskin */}
                  <div className="col-span-2 text-center">
                    {alt.loanMachine ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 mx-auto" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Förklaringar */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Förklaring:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Fastpris (Obegränsad):</strong> Obegränsade behandlingar utan extra kostnad per credit</p>
                <p><strong>SLA-nivå:</strong> Service Level Agreement - support och garantinivå</p>
              </div>
              <div>
                <p><strong>Kostnadsfria Credits:</strong> Credits ingår utan extra månadsavgift (0 kr/mån för credits)</p>
                <p><strong>Årlig Service:</strong> Inkluderar årlig service med resa och arbete</p>
                <p><strong>Lånemaskin:</strong> Tillgång till lånemaskin vid service/reparation</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tips:</strong> Rangordningen baseras på totalkostnad per månad. Högre kostnad ger vanligtvis fler inkluderade tjänster och bättre support.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Stäng
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            För leasingoffert, ansök här
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeasingAlternativesModal;