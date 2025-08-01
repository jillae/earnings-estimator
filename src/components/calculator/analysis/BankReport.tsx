import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Building, AlertTriangle, TrendingUp, DollarSign, Target } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { useModalCalculations } from '@/hooks/useModalCalculations';

const BankReport: React.FC = () => {
  const { 
    selectedMachine,
    leasingCost,
    operatingCost,
    clinicSize,
    paymentOption,
    selectedLeasingPeriodId,
    selectedSlaLevel,
    selectedDriftpaket,
    treatmentsPerDay,
    customerPrice,
    machinePriceSEK,
    cashPriceSEK
  } = useCalculator();

  const {
    modalRevenue,
    modalNetPerMonthExVat,
    modalNetPerYearExVat,
    totalMonthlyCost,
    monthlyData
  } = useModalCalculations();

  // Professionella finansiella nyckeltal
  const roi = modalRevenue.monthlyRevenueExVat > 0 ? (modalNetPerMonthExVat / modalRevenue.monthlyRevenueExVat) * 100 : 0;
  const paybackPeriodMonths = totalMonthlyCost > 0 ? (machinePriceSEK || 0) / modalNetPerMonthExVat : 0;
  const irr = modalNetPerMonthExVat > 0 ? ((modalNetPerMonthExVat * 12) / (machinePriceSEK || 1)) * 100 : 0;
  
  // Kassaflödesprojektioner för 3 år
  const cashFlowProjections = Array.from({ length: 36 }, (_, index) => {
    const month = index + 1;
    const year = Math.ceil(month / 12);
    const monthInYear = ((month - 1) % 12) + 1;
    
    // Konservativ tillväxt: 3% per år
    const growthFactor = Math.pow(1.03, year - 1);
    const monthlyRevenue = modalRevenue.monthlyRevenueExVat * growthFactor;
    const monthlyProfit = modalNetPerMonthExVat * growthFactor;
    const cumulativeProfit = monthlyProfit * month;
    
    return {
      month,
      year,
      monthInYear,
      monthlyRevenue,
      monthlyCosts: totalMonthlyCost,
      monthlyProfit,
      cumulativeProfit
    };
  });

  // Riskanalys
  const riskFactors = [
    {
      category: "Marknadsrisk",
      level: treatmentsPerDay >= 15 ? "Låg" : treatmentsPerDay >= 10 ? "Medel" : "Hög",
      description: `${treatmentsPerDay} behandlingar/dag indikerar ${treatmentsPerDay >= 15 ? 'stark' : treatmentsPerDay >= 10 ? 'stabil' : 'begränsad'} marknadstäckning`
    },
    {
      category: "Prissättningsrisk", 
      level: customerPrice >= 1200 ? "Låg" : customerPrice >= 800 ? "Medel" : "Hög",
      description: `Prissättning på ${formatCurrency(customerPrice, false)} är ${customerPrice >= 1200 ? 'konkurrenskraftig' : customerPrice >= 800 ? 'marknadsstandard' : 'under marknadsnivå'}`
    },
    {
      category: "Operationell risk",
      level: selectedSlaLevel === 'Guld' ? "Låg" : selectedSlaLevel === 'Silver' ? "Medel" : "Hög", 
      description: `${selectedSlaLevel} SLA-nivå ger ${selectedSlaLevel === 'Guld' ? 'maximal' : selectedSlaLevel === 'Silver' ? 'god' : 'grundläggande'} driftsäkerhet`
    }
  ];

  const handlePrintReport = () => {
    window.print();
  };

  const handleEmailReport = () => {
    // Implementera email-funktionalitet
    console.log('Email report functionality to be implemented');
  };

  return (
    <div className="space-y-8 print:space-y-6">
      {/* Professionell header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-8 border border-slate-200 print:bg-white print:border-0">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Finansiell Investeringsanalys
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-slate-600" />
              <span className="text-lg text-slate-700">
                {selectedMachine?.name || 'Maskin ej vald'}
              </span>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <div>Rapport genererad: {new Date().toLocaleDateString('sv-SE')}</div>
              <div>Klinikstorlek: {clinicSize === 'small' ? 'Liten' : clinicSize === 'medium' ? 'Medel' : 'Stor'} klinik</div>
              <div>Finansieringsform: {paymentOption === 'leasing' ? 'Leasing' : 'Kontant'}</div>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              Konfidentiell
            </Badge>
            <div className="text-sm text-slate-600">
              Detta dokument innehåller<br />
              känslig affärsinformation
            </div>
          </div>
        </div>

        {/* Verkställande sammanfattning */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Verkställande Sammanfattning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {Math.round(roi)}%
              </div>
              <div className="text-sm font-medium text-slate-700">ROI Marginal</div>
              <div className="text-xs text-slate-500">Månatlig avkastning</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">
                {paybackPeriodMonths.toFixed(1)}
              </div>
              <div className="text-sm font-medium text-slate-700">Månader</div>
              <div className="text-xs text-slate-500">Återbetalningstid</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {Math.round(irr)}%
              </div>
              <div className="text-sm font-medium text-slate-700">IRR</div>
              <div className="text-xs text-slate-500">Internränta (årlig)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detaljerad finansiell analys */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Finansiella Nyckeltal
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investeringsdata */}
          <div>
            <h3 className="text-lg font-medium mb-4">Investeringsdata</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Maskinpris (SEK)</TableCell>
                  <TableCell className="text-right">{formatCurrency(machinePriceSEK || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Kontantpris (SEK)</TableCell>
                  <TableCell className="text-right">{formatCurrency(cashPriceSEK || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Leasingkostnad/månad</TableCell>
                  <TableCell className="text-right">{formatCurrency(leasingCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Driftskostnad/månad</TableCell>
                  <TableCell className="text-right">{formatCurrency(operatingCost.totalCost)}</TableCell>
                </TableRow>
                <TableRow className="bg-slate-50">
                  <TableCell className="font-bold">Total månadskostnad</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totalMonthlyCost)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Intäktsdata */}
          <div>
            <h3 className="text-lg font-medium mb-4">Intäktsanalys</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Behandlingar/dag</TableCell>
                  <TableCell className="text-right">{treatmentsPerDay}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pris/behandling</TableCell>
                  <TableCell className="text-right">{formatCurrency(customerPrice, false)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Månadsintäkt (ex moms)</TableCell>
                  <TableCell className="text-right">{formatCurrency(modalRevenue.monthlyRevenueExVat)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Årsintäkt (ex moms)</TableCell>
                  <TableCell className="text-right">{formatCurrency(modalRevenue.yearlyRevenueExVat)}</TableCell>
                </TableRow>
                <TableRow className="bg-emerald-50">
                  <TableCell className="font-bold">Netto/månad</TableCell>
                  <TableCell className="text-right font-bold text-emerald-700">{formatCurrency(modalNetPerMonthExVat)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* 3-års kassaflödesprojektioner */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          3-års Kassaflödesprojektioner (Konservativ 3% tillväxt)
        </h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>År</TableHead>
                <TableHead className="text-right">Intäkt/år</TableHead>
                <TableHead className="text-right">Kostnader/år</TableHead>
                <TableHead className="text-right">Netto/år</TableHead>
                <TableHead className="text-right">Ackumulerat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((year) => {
                const yearData = cashFlowProjections.filter(item => item.year === year);
                const yearRevenue = yearData.reduce((sum, month) => sum + month.monthlyRevenue, 0);
                const yearCosts = yearData.reduce((sum, month) => sum + month.monthlyCosts, 0);
                const yearProfit = yearRevenue - yearCosts;
                const cumulativeProfit = cashFlowProjections.filter(item => item.year <= year)
                  .reduce((sum, month) => sum + month.monthlyProfit, 0);
                
                return (
                  <TableRow key={year}>
                    <TableCell className="font-medium">År {year}</TableCell>
                    <TableCell className="text-right">{formatCurrency(yearRevenue)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(yearCosts)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(yearProfit)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(cumulativeProfit)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Riskanalys */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Riskanalys
        </h2>
        
        <div className="space-y-4">
          {riskFactors.map((risk, index) => (
            <div key={index} className="flex items-start justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-slate-900 mb-1">{risk.category}</div>
                <div className="text-sm text-slate-600">{risk.description}</div>
              </div>
              <Badge 
                variant={risk.level === 'Låg' ? 'default' : risk.level === 'Medel' ? 'secondary' : 'destructive'}
                className={
                  risk.level === 'Låg' ? 'bg-emerald-100 text-emerald-800' :
                  risk.level === 'Medel' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }
              >
                {risk.level} Risk
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Rekommendationer</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div>• Säkerställ kontinuerlig marknadsföring för att bibehålla behandlingsvolym</div>
            <div>• Överväg prispremium för specialiserade behandlingar</div>
            <div>• Investera i personalutbildning för maximalt utnyttjande</div>
            <div>• Etablera reservfond för oväntade driftskostnader</div>
          </div>
        </div>
      </div>

      {/* Appendix: Scenarioanalys */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Scenarioanalys
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Konservativt scenario */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 mb-3">Konservativt Scenario</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Behandlingar/dag:</span>
                <span>{Math.max(1, treatmentsPerDay - 2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pris/behandling:</span>
                <span>{formatCurrency(customerPrice * 0.9, false)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Netto/månad:</span>
                  <span>{formatCurrency((Math.max(1, treatmentsPerDay - 2) * customerPrice * 0.9 * 22 * 0.8) - totalMonthlyCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Realistiskt scenario (nuvarande) */}
          <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">Realistiskt Scenario (Nuvarande)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Behandlingar/dag:</span>
                <span>{treatmentsPerDay}</span>
              </div>
              <div className="flex justify-between">
                <span>Pris/behandling:</span>
                <span>{formatCurrency(customerPrice, false)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Netto/månad:</span>
                  <span>{formatCurrency(modalNetPerMonthExVat)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Optimistiskt scenario */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 mb-3">Optimistiskt Scenario</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Behandlingar/dag:</span>
                <span>{treatmentsPerDay + 3}</span>
              </div>
              <div className="flex justify-between">
                <span>Pris/behandling:</span>
                <span>{formatCurrency(customerPrice * 1.1, false)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Netto/månad:</span>
                  <span>{formatCurrency(((treatmentsPerDay + 3) * customerPrice * 1.1 * 22 * 0.8) - totalMonthlyCost)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons - döljs vid utskrift */}
      <div className="print:hidden flex justify-end gap-4 pt-6">
        <Button 
          variant="outline" 
          onClick={handlePrintReport}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Skriv ut
        </Button>
        <Button 
          variant="outline" 
          onClick={handleEmailReport}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Skicka via Email
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          onClick={() => window.open('/contact', '_blank')}
        >
          💬 Kontakta Rådgivare
        </Button>
      </div>

      {/* Disclaimers */}
      <div className="text-xs text-slate-500 space-y-2 pt-6 border-t border-slate-200">
        <div>
          <strong>Disclaimer:</strong> Denna analys är baserad på angivna parametrar och utgör inte finansiell rådgivning. 
          Faktiska resultat kan variera beroende på marknadsförhållanden, konkurrens och operationella faktorer.
        </div>
        <div>
          <strong>Datakällor:</strong> Beräkningar baserade på användarinställningar och standardiserade branschvärden. 
          Kontakta din rådgivare för personlig finansiell rådgivning.
        </div>
        <div>
          <strong>Konfidentialitet:</strong> Detta dokument innehåller känslig affärsinformation och ska behandlas konfidentiellt.
        </div>
      </div>
    </div>
  );
};

export default BankReport;