import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { useAlternativesComparison } from '@/hooks/useAlternativesComparison';

const ComparisonTable: React.FC = () => {
  const { alternatives, selectedMachine } = useAlternativesComparison();

  const StatusIcon: React.FC<{ status: boolean }> = ({ status }) => {
    return status ? (
      <Check className="h-4 w-4 text-emerald-600" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    );
  };

  const getSlaColor = (slaLevel: 'Brons' | 'Silver' | 'Guld') => {
    switch (slaLevel) {
      case 'Guld':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Silver':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Brons':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!selectedMachine || alternatives.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-slate-500">
            Välj en maskin för att se jämförelsetabellen
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">
          Detaljerad Jämförelse av Kundalternativ - {selectedMachine.name}
        </CardTitle>
        <p className="text-sm text-slate-600">
          Alla priser är månadskostnader för 60 månader, exkl. moms. Rangordnade efter totalkostnad.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <style dangerouslySetInnerHTML={{
            __html: `
              .comparison-table .currency-cell {
                font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
                font-variant-numeric: tabular-nums;
                letter-spacing: -0.025em;
                font-feature-settings: "tnum";
              }
            `
          }} />
          <Table className="comparison-table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rang</TableHead>
                <TableHead className="min-w-48">Alternativ</TableHead>
                <TableHead className="text-right">Månadskostnad (SEK)</TableHead>
                <TableHead className="text-center">Fastpris (Obegränsad)</TableHead>
                <TableHead className="text-center">Kostnadsfria Credits</TableHead>
                <TableHead className="text-center">SLA-nivå</TableHead>
                <TableHead className="text-center">Årlig Service</TableHead>
                <TableHead className="text-center">Lånemaskin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alternatives.map((alternative, index) => (
                <TableRow key={alternative.name} className="hover:bg-slate-50">
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-900">{alternative.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{alternative.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold currency-cell">
                    {formatCurrency(alternative.monthlyCost)}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIcon status={alternative.hasUnlimitedCredits} />
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIcon status={alternative.hasFreeCredits} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getSlaColor(alternative.slaLevel)} variant="outline">
                      {alternative.slaLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIcon status={alternative.hasAnnualService} />
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIcon status={alternative.hasLoanMachine} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-slate-800">Förklaring:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
            <div><strong>Fastpris (Obegränsad):</strong> Obegränsade behandlingar utan extra kostnad per credit</div>
            <div><strong>Kostnadsfria Credits:</strong> Credits ingår utan extra månadsavgift (0 kr/mån för credits)</div>
            <div><strong>SLA-nivå:</strong> Service Level Agreement - support och garantinivå</div>
            <div><strong>Årlig Service:</strong> Inkluderar årlig service med resa och arbete</div>
            <div><strong>Lånemaskin:</strong> Tillgång till lånemaskin vid service/reparation</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tips:</strong> Rangordningen baseras på totalkostnad per månad. 
            Högre kostnad ger vanligtvis fler inkluderade tjänster och bättre support.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;