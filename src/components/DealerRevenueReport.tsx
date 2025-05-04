
import React from 'react';
import { 
  calculateDealerRevenue, 
  calculateTotalRevenueDifference, 
  DealerRevenueAnalysis 
} from '@/utils/dealerRevenueAnalysis';
import { formatCurrency } from '@/utils/formatUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface DealerRevenueReportProps {
  exchangeRate?: number;
  includeInsurance?: boolean;
}

const DealerRevenueReport: React.FC<DealerRevenueReportProps> = ({
  exchangeRate = 11.49260,
  includeInsurance = false
}) => {
  // Beräkna intäktsanalys
  const analyses = calculateDealerRevenue(exchangeRate, includeInsurance);
  const totals = calculateTotalRevenueDifference(exchangeRate, includeInsurance);
  
  // Sortera efter högst skillnad
  const sortedAnalyses = [...analyses].sort((a, b) => b.difference - a.difference);
  
  return (
    <div className="space-y-6">
      <Alert className="bg-slate-50 border-slate-200">
        <AlertTitle className="text-lg font-bold">Återförsäljarintäkt - Standardleasing vs. Maximal leasing</AlertTitle>
        <AlertDescription>
          Denna rapport visar potentiell intäktsökning genom att erbjuda maximal leasing istället för standardnivå. 
          Alla belopp är ex. moms och baserade på 60 månaders leasingperiod.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <div className="text-sm text-slate-600">Total intäkt med standard</div>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totals.totalStandard)}</div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <div className="text-sm text-slate-600">Total intäkt med max</div>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totals.totalMax)}</div>
        </div>
        
        <div className="bg-emerald-100 border border-emerald-200 p-4 rounded-lg">
          <div className="text-sm text-slate-600">Total skillnad</div>
          <div className="text-2xl font-bold text-emerald-700">{formatCurrency(totals.totalDifference)}</div>
        </div>
        
        <div className="bg-emerald-100 border border-emerald-200 p-4 rounded-lg">
          <div className="text-sm text-slate-600">Genomsnittlig ökning</div>
          <div className="text-2xl font-bold text-emerald-700">+{totals.averagePercentIncrease.toFixed(1)}%</div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">Maskin</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-slate-700">Standard</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-slate-700">Max</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-slate-700">Skillnad</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-slate-700">Ökning %</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">Krediter</th>
            </tr>
          </thead>
          <tbody>
            {sortedAnalyses.map((item, index) => (
              <tr 
                key={item.machineId} 
                className={`border-b border-slate-200 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
              >
                <td className="py-3 px-4 text-slate-700 font-medium">{item.machineName}</td>
                <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(item.standardLeasingAmount)}</td>
                <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(item.maxLeasingAmount)}</td>
                <td className="py-3 px-4 text-right font-medium text-emerald-600">
                  {formatCurrency(item.difference)}
                </td>
                <td className="py-3 px-4 text-right font-medium text-emerald-600">
                  +{item.differencePercent.toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {item.usesCredits ? "Ja" : "Nej"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="text-sm text-slate-500 italic">
        Notera: Denna analys är baserad på standardleasingnivåer och maximum leasingpriser som är konfigurerade i systemet.
        Beräkningen använder leasingränta för 60 månader som referens.
        {includeInsurance && " Försäkringskostnad är inkluderad i beräkningen."}
      </div>
    </div>
  );
};

export default DealerRevenueReport;
