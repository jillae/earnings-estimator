import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp } from 'lucide-react';
import DetailedAnalysisModal from './calculator/DetailedAnalysisModal';
import { GrowthForecastPlug } from './GrowthForecastPlug';

interface ResultsTableProps {
  dailyRevenueIncVat: number;
  weeklyRevenueIncVat: number;
  monthlyRevenueIncVat: number;
  yearlyRevenueIncVat: number;
  leasingCostPerMonth: number;
  operatingCostPerMonth: number;
  paymentOption?: 'leasing' | 'cash';
  cashPriceSEK?: number;
  netPerMonthExVat: number;
  netPerYearExVat: number;
  occupancy50: number;
  occupancy75: number;
  occupancy100: number;
  isFlatrateActive?: boolean;
  selectedSlaLevel?: 'Brons' | 'Silver' | 'Guld';
  treatmentsPerDay?: number;
  customerPrice?: number;
  slaCost?: number;
  creditCost?: number;
  hoveredInput?: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  dailyRevenueIncVat,
  weeklyRevenueIncVat,
  monthlyRevenueIncVat,
  yearlyRevenueIncVat,
  leasingCostPerMonth,
  operatingCostPerMonth,
  paymentOption = 'leasing',
  cashPriceSEK = 0,
  netPerMonthExVat,
  netPerYearExVat,
  occupancy50,
  occupancy75,
  occupancy100,
  isFlatrateActive = false,
  selectedSlaLevel = 'Brons',
  treatmentsPerDay = 0,
  customerPrice = 0,
  slaCost = 0,
  creditCost = 0,
  hoveredInput = null
}) => {
  // Validera värden och se till att de är giltiga nummer
  const safeDaily = isNaN(dailyRevenueIncVat) ? 0 : dailyRevenueIncVat;
  const safeWeekly = isNaN(weeklyRevenueIncVat) ? 0 : weeklyRevenueIncVat;
  const safeMonthly = isNaN(monthlyRevenueIncVat) ? 0 : monthlyRevenueIncVat;
  const safeYearly = isNaN(yearlyRevenueIncVat) ? 0 : yearlyRevenueIncVat;
  const safeLeasingCost = isNaN(leasingCostPerMonth) ? 0 : leasingCostPerMonth;
  // Om Flatrate är aktivt, visa 0 för driftskostnader, annars använd faktisk kostnad
  const safeOperatingCost = isNaN(operatingCostPerMonth) ? 0 : operatingCostPerMonth;
  const safeCashPrice = isNaN(cashPriceSEK) ? 0 : cashPriceSEK;
  const safeNetMonth = isNaN(netPerMonthExVat) ? 0 : netPerMonthExVat;
  const safeNetYear = isNaN(netPerYearExVat) ? 0 : netPerYearExVat;
  const safeOcc50 = isNaN(occupancy50) ? 0 : occupancy50;
  const safeOcc75 = isNaN(occupancy75) ? 0 : occupancy75;
  const safeOcc100 = isNaN(occupancy100) ? 0 : occupancy100;
  const safeSlaOstCost = isNaN(slaCost) ? 0 : slaCost;
  const safeCreditCost = isNaN(creditCost) ? 0 : creditCost;

  // Calculate components for display
  const totalCostPerMonth = safeLeasingCost + safeOperatingCost;

  // Lägg till extra loggning för felsökning av beläggningsgrader
  console.log(`[TRACKER] ResultsTable rendering with occupancy values:
    occupancy50 prop: ${occupancy50} -> safeOcc50: ${safeOcc50}
    occupancy75 prop: ${occupancy75} -> safeOcc75: ${safeOcc75}
    occupancy100 prop: ${occupancy100} -> safeOcc100: ${safeOcc100}
    Monthly revenue (inc VAT): ${safeMonthly}
    Yearly revenue (inc VAT): ${safeYearly}
    Monthly operating cost: ${safeOperatingCost} (original: ${operatingCostPerMonth}, flatrate active: ${isFlatrateActive})
    Leasing cost: ${safeLeasingCost}
    Total cost per month: ${totalCostPerMonth}
    Net per month (ex VAT): ${safeNetMonth}
    Monthly revenue (ex VAT): ${safeMonthly / 1.25}
    Behandlingar per dag: ${treatmentsPerDay}
    Kundpris: ${customerPrice}
  `);

  return <div className="glass-card mt-8 animate-slide-in bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200" style={{
    animationDelay: '600ms'
  }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Resultat</h2>
        <DetailedAnalysisModal />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 text-slate-600 font-medium text-xs">Översikt</th>
              <th className="text-right py-2 px-2 text-slate-600 font-medium text-xs">Per månad</th>
              <th className="text-right py-2 px-2 text-slate-600 font-medium text-xs">Per år</th>
            </tr>
          </thead>
          <tbody>
            {/* KLINIK SEKTION */}
            <tr className="border-b border-slate-100 bg-blue-50/30">
              <td colSpan={3} className="py-2 px-3 text-xs font-semibold text-blue-800 uppercase tracking-wide">
                📊 Klinik & Verksamhet
              </td>
             </tr>
             <tr className={`border-b border-slate-200 transition-colors ${hoveredInput === 'treatments' ? 'bg-emerald-100/50 ring-2 ring-emerald-300' : 'bg-emerald-50/10 hover:bg-emerald-50/20'}`}>
               <td className="py-2 px-3 text-slate-700 text-xs border-l border-emerald-300">Behandlingar/dag</td>
               <td className="py-2 px-2 text-right text-slate-700 font-medium text-xs">{treatmentsPerDay || 0}</td>
               <td className="py-2 px-2 text-right text-slate-700 font-medium text-xs">{(treatmentsPerDay || 0) * 252}</td>
            </tr>
             <tr className={`border-b border-slate-200 transition-colors ${hoveredInput === 'workdays' ? 'bg-emerald-100/50 ring-2 ring-emerald-300' : 'bg-emerald-50/10 hover:bg-emerald-50/20'}`}>
               <td className="py-2 px-3 text-slate-700 text-xs border-l border-emerald-300">Nollpunkt (arbetsdagar/månad)</td>
               <td className="py-2 px-2 text-right text-slate-700 font-medium text-xs">
                 {(() => {
                   const monthlyRevenueExVat = safeMonthly / 1.25;
                   const dailyRevenue = monthlyRevenueExVat / (22); // Använd standardvärde för nollpunkt beräkning
                   const breakEvenDays = dailyRevenue > 0 ? totalCostPerMonth / dailyRevenue : 0;
                   return Math.round(breakEvenDays);
                 })()} dagar
               </td>
               <td className="py-2 px-2 text-right text-slate-700 font-medium text-xs">
                 {(() => {
                   const monthlyRevenueExVat = safeMonthly / 1.25;
                   const dailyRevenue = monthlyRevenueExVat / (22);
                   const breakEvenDays = dailyRevenue > 0 ? totalCostPerMonth / dailyRevenue : 0;
                   const currentWorkingDays = treatmentsPerDay > 0 ? 22 : 0;
                   
                   return currentWorkingDays >= breakEvenDays ? (
                     <span className="text-emerald-600 font-bold">✅ Vinst</span>
                   ) : (
                     <span className="text-red-600 font-bold">❌ Förlust</span>
                   );
                 })()}
               </td>
              </tr>
              <tr className={`border-b border-slate-200 transition-colors ${hoveredInput === 'price' ? 'bg-emerald-100/50 ring-2 ring-emerald-300' : 'bg-emerald-50/10 hover:bg-emerald-50/20'}`}>
                <td className="py-2 px-3 text-slate-700 text-xs border-l border-emerald-300">Intäkt/behandling (ink moms)</td>
                <td className="py-2 px-2 text-right text-slate-700 font-medium text-xs">{formatCurrency(customerPrice || 0)}</td>
                <td className="py-2 px-2 text-right text-slate-700 font-medium text-xs">-</td>
             </tr>
            
            {/* INTÄKT SEKTION */}
            <tr className="border-b border-slate-100 bg-emerald-50/30">
              <td colSpan={3} className="py-2 px-3 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                💰 Intäkter
              </td>
            </tr>
            <tr className="border-b border-slate-200 bg-emerald-50/10 hover:bg-emerald-50/20 transition-colors">
              <td className="py-2 px-3 text-slate-700 text-xs border-l border-emerald-300">Total intäkt (ink moms)</td>
              <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">{formatCurrency(safeMonthly)}</td>
              <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">{formatCurrency(safeYearly)}</td>
            </tr>
            
            {/* KOSTNADER SEKTION */}
            <tr className="border-b border-slate-100 bg-red-50/30">
              <td colSpan={3} className="py-2 px-3 text-xs font-semibold text-red-800 uppercase tracking-wide">
                📉 Kostnader
              </td>
            </tr>
            
            {paymentOption === 'leasing' ? (
              <tr className={`border-b border-slate-200 transition-colors ${hoveredInput === 'leasing' || hoveredInput === 'payment' ? 'bg-red-100/50 ring-2 ring-red-300' : 'bg-red-50/10 hover:bg-red-50/20'}`}>
                <td className="py-2 px-3 text-slate-700 text-xs border-l border-red-300">Leasingkostnad (ex moms)</td>
                <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">{formatCurrency(safeLeasingCost)}</td>
                <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">{formatCurrency(safeLeasingCost * 12)}</td>
              </tr>
            ) : (
              <tr className={`border-b border-slate-200 transition-colors ${hoveredInput === 'payment' ? 'bg-red-100/50 ring-2 ring-red-300' : 'bg-red-50/10 hover:bg-red-50/20'}`}>
                <td className="py-2 px-3 text-slate-700 text-xs border-l border-red-300">Kontantköp (ex moms, 5 år)</td>
                <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">{formatCurrency(safeCashPrice / 60)}</td>
                <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">{formatCurrency((safeCashPrice / 60) * 12)}</td>
              </tr>
             )}
            
            {/* Flatrate eller Credits kostnad */}
            {isFlatrateActive ? (
              <tr className={`border-b border-slate-200 transition-colors ${hoveredInput === 'credits' ? 'bg-red-100/50 ring-2 ring-red-300' : 'bg-red-50/10 hover:bg-red-50/20'}`}>
                <td className="py-2 px-3 text-slate-700 text-xs border-l border-red-300">
                  {selectedSlaLevel === 'Guld' ? 'Flatrate credits (ingår i Guld)' : 'Flatrate credits'}
                </td>
                <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">
                  {selectedSlaLevel === 'Guld' ? 'Ingår' : formatCurrency(safeCreditCost)}
                </td>
                <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">
                  {selectedSlaLevel === 'Guld' ? 'Ingår' : formatCurrency(safeCreditCost * 12)}
                </td>
              </tr>
            ) : (
              safeCreditCost > 0 && (
                <tr className={`border-b border-slate-200 transition-colors ${hoveredInput === 'credits' ? 'bg-red-100/50 ring-2 ring-red-300' : 'bg-red-50/10 hover:bg-red-50/20'}`}>
                  <td className="py-2 px-3 text-slate-700 text-xs border-l border-red-300">Credits (per användning)</td>
                  <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">{formatCurrency(safeCreditCost)}</td>
                  <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">{formatCurrency(safeCreditCost * 12)}</td>
                </tr>
              )
            )}
            
            {/* SLA-kostnad - visa alltid, även vid 0 kr */}
            <tr className={`border-b border-slate-200 transition-colors ${hoveredInput === 'sla' ? 'bg-red-100/50 ring-2 ring-red-300' : 'bg-red-50/10 hover:bg-red-50/20'}`}>
              <td className="py-2 px-3 text-slate-700 text-xs border-l border-red-300">SLA {selectedSlaLevel}</td>
              <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">{formatCurrency(safeSlaOstCost)}</td>
              <td className="py-2 px-2 text-right text-slate-700 whitespace-nowrap text-xs">{formatCurrency(safeSlaOstCost * 12)}</td>
            </tr>
            
            <tr className="border-b border-slate-200 font-medium bg-slate-50">
              <td className="py-2 px-3 text-slate-800 text-xs font-bold">Total kostnad</td>
              <td className="py-2 px-2 text-right text-slate-800 font-bold whitespace-nowrap text-xs">{formatCurrency(totalCostPerMonth)}</td>
              <td className="py-2 px-2 text-right text-slate-800 font-bold whitespace-nowrap text-xs">{formatCurrency(totalCostPerMonth * 12)}</td>
            </tr>
            
            {/* NETTO SEKTION */}
            <tr className="border-b border-slate-100 bg-emerald-50/50">
              <td colSpan={3} className="py-2 px-3 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                ✅ Nettoresultat
              </td>
            </tr>
            <tr className="border-b border-slate-200 font-bold bg-emerald-50">
              <td className="py-3 px-3 text-slate-900 text-sm font-bold">Netto (ex moms)</td>
              <td className="py-3 px-2 text-right text-emerald-700 font-bold text-base whitespace-nowrap">{formatCurrency(safeNetMonth)}</td>
              <td className="py-3 px-2 text-right text-emerald-700 font-bold text-base whitespace-nowrap">{formatCurrency(safeNetYear)}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-3 text-slate-700 text-xs">Vinstmarginal</td>
              <td className="py-2 px-2 text-right text-emerald-700 font-medium text-xs">
                {safeMonthly > 0 ? `${((safeNetMonth / (safeMonthly / 1.25)) * 100).toFixed(1)}%` : '0%'}
              </td>
              <td className="py-2 px-2 text-right text-emerald-700 font-medium text-xs">
                {safeYearly > 0 ? `${((safeNetYear / (safeYearly / 1.25)) * 100).toFixed(1)}%` : '0%'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="w-2 h-2 bg-emerald-400 rounded-sm mr-2"></span>
          Budgeterbar intäkt vid olika beläggningsgrad
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200/50 border-l-4 border-l-emerald-300 hover:shadow-md transition-all duration-200">
            <div className="text-sm text-blue-700 mb-1 font-medium">Beläggning 50%, år 1 (ink moms)</div>
            <div className="text-xl font-bold text-blue-800 whitespace-nowrap">{formatCurrency(safeOcc50)}</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 border-l-4 border-l-emerald-300 hover:shadow-md transition-all duration-200">
            <div className="text-sm text-emerald-700 mb-1 font-medium">Beläggning 75%, år 2 (ink moms)</div>
            <div className="text-xl font-bold text-emerald-800 whitespace-nowrap">{formatCurrency(safeOcc75)}</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-purple-50 border border-emerald-200/50 border-l-4 border-l-emerald-300 hover:shadow-md transition-all duration-200">
            <div className="text-sm text-purple-700 mb-1 font-medium">Beläggning 100%, år 3 (ink moms)</div>
            <div className="text-xl font-bold text-purple-800 whitespace-nowrap">{formatCurrency(safeOcc100)}</div>
          </div>
        </div>
        
        
        </div>
        
        {/* Tillväxtprognos plugg */}
        <GrowthForecastPlug />
      
      <div className="mt-8 text-sm text-slate-500 italic">
        Detta är endast ett beräkningsunderlag. Priser och kostnader uppdateras dagligen baserat på aktuell marknad och valutakurser, 
        vilket innebär att resultaten kan variera från dag till dag. Vid avtal gäller villkor från leasingbolag samt faktura.
        {paymentOption === 'leasing' && (
          <span className="ml-1">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-emerald-600 hover:text-emerald-700 font-medium"
              onClick={() => window.open('https://bit.ly/leasingeen', '_blank')}
            >
              <Download className="h-3 w-3 mr-1" />
              För leasingoffert, ansök här
            </Button>
          </span>
        )}
      </div>
    </div>;
};

export default ResultsTable;
