import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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
  occupancy100
}) => {
  // Validera värden och se till att de är giltiga nummer
  const safeDaily = isNaN(dailyRevenueIncVat) ? 0 : dailyRevenueIncVat;
  const safeWeekly = isNaN(weeklyRevenueIncVat) ? 0 : weeklyRevenueIncVat;
  const safeMonthly = isNaN(monthlyRevenueIncVat) ? 0 : monthlyRevenueIncVat;
  const safeYearly = isNaN(yearlyRevenueIncVat) ? 0 : yearlyRevenueIncVat;
  const safeLeasingCost = isNaN(leasingCostPerMonth) ? 0 : leasingCostPerMonth;
  const safeOperatingCost = isNaN(operatingCostPerMonth) ? 0 : operatingCostPerMonth;
  const safeCashPrice = isNaN(cashPriceSEK) ? 0 : cashPriceSEK;
  const safeNetMonth = isNaN(netPerMonthExVat) ? 0 : netPerMonthExVat;
  const safeNetYear = isNaN(netPerYearExVat) ? 0 : netPerYearExVat;
  const safeOcc50 = isNaN(occupancy50) ? 0 : occupancy50;
  const safeOcc75 = isNaN(occupancy75) ? 0 : occupancy75;
  const safeOcc100 = isNaN(occupancy100) ? 0 : occupancy100;

  // Calculate total costs per month
  const totalCostPerMonth = safeLeasingCost + safeOperatingCost;

  // Lägg till extra loggning för felsökning
  console.log(`ResultsTable rendering with values:
    Monthly revenue (inc VAT): ${safeMonthly}
    Monthly operating cost: ${safeOperatingCost}
    Leasing cost: ${safeLeasingCost}
    Total cost per month: ${totalCostPerMonth}
    Net per month (ex VAT): ${safeNetMonth}
    Monthly revenue (ex VAT): ${safeMonthly / 1.25}
  `);

  return <div className="glass-card mt-8 animate-slide-in bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200" style={{
    animationDelay: '600ms'
  }}>
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Resultat</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-slate-600 font-medium text-sm">Översikt</th>
              <th className="text-right py-3 px-4 text-slate-600 font-medium text-sm">Per dag</th>
              <th className="text-right py-3 px-4 text-slate-600 font-medium text-sm">Per vecka</th>
              <th className="text-right py-3 px-4 text-slate-600 font-medium text-sm">Per månad</th>
              <th className="text-right py-3 px-4 text-slate-600 font-medium text-sm">Per år</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-3 px-4 text-slate-700">Intäkt (ink moms)</td>
              <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(safeDaily)}</td>
              <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(safeWeekly)}</td>
              <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(safeMonthly)}</td>
              <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(safeYearly)}</td>
            </tr>
            
            {paymentOption === 'leasing' ? (
              <tr className="border-b border-slate-200">
                <td className="py-3 px-4 text-slate-700">Leasingkostnad (ex moms)</td>
                <td className="py-3 px-4 text-right text-slate-700">-</td>
                <td className="py-3 px-4 text-right text-slate-700">-</td>
                <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(safeLeasingCost)}</td>
                <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(safeLeasingCost * 12)}</td>
              </tr>
            ) : (
              <tr className="border-b border-slate-200">
                <td className="py-3 px-4 text-slate-700">Kontantköp (ex moms, avskrivning 5 år)</td>
                <td className="py-3 px-4 text-right text-slate-700">-</td>
                <td className="py-3 px-4 text-right text-slate-700">-</td>
                <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(safeCashPrice / 60)}</td>
                <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency((safeCashPrice / 60) * 12)}</td>
              </tr>
            )}
            
            {paymentOption === 'leasing' && (
              <tr>
                <td colSpan={5} className="text-center py-2">
                  <Button
                    variant="default"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    onClick={() => window.open('https://bit.ly/leasingeen', '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                     För leasingoffert, ansök här
                  </Button>
                </td>
              </tr>
            )}
            
            <tr className="border-b border-slate-200">
              <td className="py-3 px-4 text-slate-700">Driftskostnad (ex moms)</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(safeOperatingCost)}</td>
              <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(safeOperatingCost * 12)}</td>
            </tr>
            
            <tr className="border-b border-slate-200">
              <td className="py-3 px-4 text-slate-700">Total kostnad (ex moms)</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(totalCostPerMonth)}</td>
              <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">{formatCurrency(totalCostPerMonth * 12)}</td>
            </tr>
            
            <tr className="border-b border-slate-200 font-bold bg-emerald-50">
              <td className="py-4 px-4 text-slate-900">Netto (ex moms)</td>
              <td className="py-4 px-4 text-right text-slate-700">-</td>
              <td className="py-4 px-4 text-right text-slate-700">-</td>
              <td className="py-4 px-4 text-right text-emerald-700 font-bold text-lg whitespace-nowrap">{formatCurrency(safeNetMonth)}</td>
              <td className="py-4 px-4 text-right text-emerald-700 font-bold text-lg whitespace-nowrap">{formatCurrency(safeNetYear)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Budgeterbar intäkt vid olika beläggningsgrad</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="text-sm text-blue-700 mb-1 font-medium">Beläggning 50%, år 1 (ink moms)</div>
            <div className="text-xl font-bold text-blue-800 whitespace-nowrap">{formatCurrency(safeOcc50)}</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 hover:shadow-md transition-all duration-200">
            <div className="text-sm text-emerald-700 mb-1 font-medium">Beläggning 75%, år 2 (ink moms)</div>
            <div className="text-xl font-bold text-emerald-800 whitespace-nowrap">{formatCurrency(safeOcc75)}</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="text-sm text-purple-700 mb-1 font-medium">Beläggning 100%, år 3 (ink moms)</div>
            <div className="text-xl font-bold text-purple-800 whitespace-nowrap">{formatCurrency(safeOcc100)}</div>
          </div>
        </div>
      </div>
      
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
