
import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';

interface ResultsTableProps {
  dailyRevenueIncVat: number;
  weeklyRevenueIncVat: number;
  monthlyRevenueIncVat: number;
  yearlyRevenueIncVat: number;
  leasingCostPerMonth: number;
  operatingCostPerMonth: number;
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
  netPerMonthExVat,
  netPerYearExVat,
  occupancy50,
  occupancy75,
  occupancy100
}) => {
  // Calculate total costs per month
  const totalCostPerMonth = leasingCostPerMonth + operatingCostPerMonth;
  
  return (
    <div className="glass-card mt-8 animate-slide-in" style={{ animationDelay: '600ms' }}>
      <h2 className="text-2xl font-bold mb-6">Resultat</h2>
      
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
              <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(dailyRevenueIncVat)}</td>
              <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(weeklyRevenueIncVat)}</td>
              <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(monthlyRevenueIncVat)}</td>
              <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(yearlyRevenueIncVat)}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-3 px-4 text-slate-700">Leasingkostnad (ex moms)</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(leasingCostPerMonth)}</td>
              <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(leasingCostPerMonth * 12)}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-3 px-4 text-slate-700">Drift (credits/flatrate) (ex moms)</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(operatingCostPerMonth)}</td>
              <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(operatingCostPerMonth * 12)}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-3 px-4 text-slate-700">Total kostnad (ex moms)</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(totalCostPerMonth)}</td>
              <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(totalCostPerMonth * 12)}</td>
            </tr>
            <tr className="border-b border-slate-200 font-bold">
              <td className="py-3 px-4 text-slate-700">Netto (ex moms)</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700">-</td>
              <td className="py-3 px-4 text-right text-slate-700 text-emerald-600">{formatCurrency(netPerMonthExVat)}</td>
              <td className="py-3 px-4 text-right text-slate-700 text-emerald-600">{formatCurrency(netPerYearExVat)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Budgeterbar intäkt vid olika beläggningsgrad</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-sm text-slate-600 mb-1">Beläggning 50%, år 1 (ink moms)</div>
            <div className="text-xl font-semibold text-emerald-600">{formatCurrency(occupancy50)}</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-sm text-slate-600 mb-1">Beläggning 75%, år 2 (ink moms)</div>
            <div className="text-xl font-semibold text-emerald-600">{formatCurrency(occupancy75)}</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-sm text-slate-600 mb-1">Beläggning 100%, år 3 (ink moms)</div>
            <div className="text-xl font-semibold text-emerald-600">{formatCurrency(occupancy100)}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-slate-500 italic">
        Detta är endast ett beräkningsunderlag. Avtal gäller.
      </div>
    </div>
  );
};

export default ResultsTable;
