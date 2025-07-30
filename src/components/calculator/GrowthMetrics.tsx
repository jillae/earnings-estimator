import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { TrendingUp, Target, Calendar, Percent } from 'lucide-react';

interface GrowthMetricsProps {
  monthlyRevenue: number;
  monthlyNet: number;
  totalMonthlyCost: number;
  treatmentsPerDay: number;
  customerPrice: number;
}

const GrowthMetrics: React.FC<GrowthMetricsProps> = ({
  monthlyRevenue,
  monthlyNet,
  totalMonthlyCost,
  treatmentsPerDay,
  customerPrice
}) => {
  // Beräkna nyckeltal
  const profitMargin = monthlyRevenue > 0 ? (monthlyNet / monthlyRevenue) * 100 : 0;
  
  // Nollpunkt - hur många dagar behövs för att täcka kostnader
  const dailyRevenue = monthlyRevenue / 22; // 22 arbetsdagar per månad
  const breakEvenDays = dailyRevenue > 0 ? totalMonthlyCost / dailyRevenue : 0;
  
  // Total nettovinst över 5 år
  const totalNetProfit5Years = monthlyNet * 12 * 5;
  
  // Potentiell årlig intäkt (100% beläggning)
  const maxDailyTreatments = 20; // Maximalt antal behandlingar per dag
  const maxDailyRevenue = maxDailyTreatments * customerPrice;
  const maxYearlyRevenue = (maxDailyRevenue * 22 * 12) / 1.25; // ex moms

  const metrics = [
    {
      icon: <Percent className="h-5 w-5 text-emerald-600" />,
      label: "Vinstmarginal",
      value: `${profitMargin.toFixed(1)}%`,
      description: "Andel av intäkten som blir netto"
    },
    {
      icon: <Target className="h-5 w-5 text-blue-600" />,
      label: "Nollpunkt",
      value: `${breakEvenDays.toFixed(1)} dagar`,
      description: "Arbetsdagar per månad för att täcka kostnader"
    },
    {
      icon: <Calendar className="h-5 w-5 text-purple-600" />,
      label: "Total Nettovinst 5 år",
      value: formatCurrency(totalNetProfit5Years),
      description: "Prognostiserad totalvinst över avtalsperioden"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
      label: "Potentiell Årlig Intäkt",
      value: formatCurrency(maxYearlyRevenue),
      description: "Vid 100% beläggning (20 beh/dag)"
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Nyckeltal för Tillväxt
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                {metric.icon}
                <span className="text-sm font-medium text-slate-700">{metric.label}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {metric.value}
              </div>
              <div className="text-xs text-slate-500">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Tillväxtfokus</p>
          <p>Dessa nyckeltal hjälper dig förstå din kliniks ekonomiska potential och planera för framtida tillväxt.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthMetrics;