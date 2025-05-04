
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

// Lista över maskiner som ska exkluderas från rapporten
const EXCLUDED_MACHINE_IDS = ['gvl', 'evrl', 'xlr8', 'base-station', 'lunula'];

const DealerRevenueReport: React.FC<DealerRevenueReportProps> = ({
  exchangeRate = 11.49260,
  includeInsurance = false
}) => {
  // Beräkna intäktsanalys
  const allAnalyses = calculateDealerRevenue(exchangeRate, includeInsurance);
  
  // Filtrera bort maskiner som inte ska visas
  const analyses = allAnalyses.filter(analysis => !EXCLUDED_MACHINE_IDS.includes(analysis.machineId));
  
  // Sortera efter högst skillnad
  const sortedAnalyses = [...analyses].sort((a, b) => b.difference - a.difference);
  
  return (
    <div className="space-y-6">
      <Alert className="bg-slate-50 border-slate-200">
        <AlertTitle className="text-lg font-bold">Återförsäljarintäkt - Standardleasing vs. Maximal leasing</AlertTitle>
        <AlertDescription>
          Denna rapport visar potentiell intäktsökning genom att erbjuda maximal leasing istället för standardnivå. 
          Beräkningen inkluderar också total intäkt över 36 och 60 månader, samt kreditintäkter för maskiner som använder krediter (baserat på 2 kunder/dag, 22 dagar/månad).
        </AlertDescription>
      </Alert>
      
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
              <TableHead className="text-right">Krediter</TableHead>
              <TableHead className="text-right">36/60 jämf.</TableHead>
              
              {/* Nya kolumner */}
              <TableHead className="text-right">Leasing diff 36m</TableHead>
              <TableHead className="text-right">Credits total 36m</TableHead>
              <TableHead className="text-right">Diff/Credits 36m</TableHead>
              
              <TableHead className="text-right">Leasing diff 60m</TableHead>
              <TableHead className="text-right">Credits total 60m</TableHead>
              <TableHead className="text-right">Diff/Credits 60m</TableHead>
              
              {/* Befintliga kolumner */}
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
                  {item.usesCredits ? formatCurrency(item.monthlyCreditsRevenue) : "-"}
                </TableCell>
                <TableCell className="text-right font-medium text-amber-600">
                  {formatCurrency(item.differenceComparisonRatio)}
                </TableCell>
                
                {/* Nya kolumner */}
                <TableCell className="text-right font-medium text-purple-600">
                  {formatCurrency(item.totalLeasingDifference36Month)}
                </TableCell>
                <TableCell className="text-right font-medium text-teal-600">
                  {item.usesCredits ? formatCurrency(item.totalCreditsRevenue36Month) : "-"}
                </TableCell>
                <TableCell className="text-right font-medium text-orange-600">
                  {item.usesCredits ? 
                    (item.totalLeasingDifference36Month > item.totalCreditsRevenue36Month ? 
                      "+" + formatCurrency(item.totalLeasingDifference36Month - item.totalCreditsRevenue36Month) : 
                      "-" + formatCurrency(item.totalCreditsRevenue36Month - item.totalLeasingDifference36Month)) : 
                    "-"}
                </TableCell>
                
                <TableCell className="text-right font-medium text-purple-600">
                  {formatCurrency(item.totalLeasingDifference60Month)}
                </TableCell>
                <TableCell className="text-right font-medium text-teal-600">
                  {item.usesCredits ? formatCurrency(item.totalCreditsRevenue60Month) : "-"}
                </TableCell>
                <TableCell className="text-right font-medium text-orange-600">
                  {item.usesCredits ? 
                    (item.totalLeasingDifference60Month > item.totalCreditsRevenue60Month ? 
                      "+" + formatCurrency(item.totalLeasingDifference60Month - item.totalCreditsRevenue60Month) : 
                      "-" + formatCurrency(item.totalCreditsRevenue60Month - item.totalLeasingDifference60Month)) : 
                    "-"}
                </TableCell>
                
                {/* Befintliga kolumner */}
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
        För maskiner som använder krediter inkluderas potentiell kreditintäkt baserat på 2 kunder per dag (44 behandlingar/månad).
        Jämförelsekolumnen visar skillnad mellan standard och max över 36 månader justerat från 60 månader.
        <br />
        <br />
        <strong>Förklaringar:</strong><br />
        - Leasing diff: Total skillnad mellan standard och max leasing över hela perioden.<br />
        - Credits total: Total kreditintäkt över hela perioden.<br />
        - Diff/Credits: Skillnaden mellan leasing-differens och krediter över hela perioden (+ om leasing är högre, - om krediter är högre).
        {includeInsurance && " Försäkringskostnad är inkluderad i beräkningen."}
      </div>
    </div>
  );
};

export default DealerRevenueReport;
