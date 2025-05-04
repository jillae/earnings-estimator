
import React from 'react';
import { 
  calculateDealerRevenue, 
  calculateTotalRevenueDifference, 
  DealerRevenueAnalysis 
} from '@/utils/dealerRevenueAnalysis';
import { formatCurrency } from '@/utils/formatUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          Beräkningen inkluderar också total intäkt över 36 och 60 månader, samt kreditintäkter för maskiner som använder krediter (baserat på 2 kunder/dag).
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <div className="text-sm text-slate-600">Månadsintäkt standard</div>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totals.totalStandard)}</div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <div className="text-sm text-slate-600">Månadsintäkt max</div>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totals.totalMax)}</div>
        </div>
        
        <div className="bg-emerald-100 border border-emerald-200 p-4 rounded-lg">
          <div className="text-sm text-slate-600">Månatlig skillnad</div>
          <div className="text-2xl font-bold text-emerald-700">{formatCurrency(totals.totalDifference)}</div>
        </div>
        
        <div className="bg-emerald-100 border border-emerald-200 p-4 rounded-lg">
          <div className="text-sm text-slate-600">Genomsnittlig ökning</div>
          <div className="text-2xl font-bold text-emerald-700">+{totals.averagePercentIncrease.toFixed(1)}%</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="text-sm text-slate-600">Total 36 månader</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(totals.total36MonthRevenue)}</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="text-sm text-slate-600">Total 60 månader</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(totals.total60MonthRevenue)}</div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Intäktsanalys per maskin</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Maskin</TableHead>
              <TableHead className="text-right">Standard</TableHead>
              <TableHead className="text-right">Max</TableHead>
              <TableHead className="text-right">Skillnad</TableHead>
              <TableHead className="text-right">Ökning %</TableHead>
              <TableHead className="text-right">Använder krediter</TableHead>
              <TableHead className="text-right">Total 36m</TableHead>
              <TableHead className="text-right">Total 60m</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAnalyses.map((item) => (
              <TableRow key={item.machineId}>
                <TableCell className="font-medium">{item.machineName}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.standardLeasingAmount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.maxLeasingAmount)}</TableCell>
                <TableCell className="text-right font-medium text-emerald-600">
                  {formatCurrency(item.difference)}
                </TableCell>
                <TableCell className="text-right font-medium text-emerald-600">
                  +{item.differencePercent.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  {item.usesCredits ? "Ja" : "Nej"}
                </TableCell>
                <TableCell className="text-right font-medium text-blue-600">
                  {formatCurrency(item.revenue36Month)}
                </TableCell>
                <TableCell className="text-right font-medium text-blue-600">
                  {formatCurrency(item.revenue60Month)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-slate-500 italic">
        Notera: Denna analys är baserad på standardleasingnivåer och maximum leasingpriser som är konfigurerade i systemet.
        För maskiner som använder krediter inkluderas potentiell kreditintäkt baserat på 2 kunder per dag (40 behandlingar/månad).
        {includeInsurance && " Försäkringskostnad är inkluderad i beräkningen."}
      </div>
    </div>
  );
};

export default DealerRevenueReport;
