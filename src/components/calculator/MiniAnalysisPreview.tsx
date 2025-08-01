import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useModalCalculations } from '@/hooks/useModalCalculations';
import { formatCurrency } from '@/utils/formatUtils';

interface MiniAnalysisPreviewProps {
  onOpenFullAnalysis: () => void;
}

const MiniAnalysisPreview: React.FC<MiniAnalysisPreviewProps> = ({ onOpenFullAnalysis }) => {
  const { modalNetPerYearExVat, monthlyData } = useModalCalculations();
  
  // Förenkla data för mini-graf - visa bara vinst per år
  const yearlyData = monthlyData
    .filter((_, index) => index % 12 === 11) // Visa bara årsslutsdata
    .slice(0, 5) // Visa bara första 5 åren
    .map(item => ({
      year: Math.ceil(item.month / 12),
      profit: item.nettoKumulativ
    }));

  // Hitta break-even punkt (när nettoKumulativ blir positivt)
  const breakEvenMonth = monthlyData.find(item => item.nettoKumulativ > 0)?.month || 'Aldrig';
  
  // Beräkna ROI för år 1
  const year1Profit = modalNetPerYearExVat;
  const totalInvestment = 50000; // Ungefärlig initial kostnad
  const roi = ((year1Profit / totalInvestment) * 100);

  return (
    <div className="w-full mt-8 mb-8">
      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-6"></div>
      
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-slate-200/60 shadow-sm">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Snabböversikt</h3>
                <p className="text-sm text-slate-600">Förhandsgranskning av din investering</p>
              </div>
            </div>
            <Button 
              onClick={onOpenFullAnalysis}
              variant="outline"
              size="sm"
              className="text-blue-700 border-blue-200 hover:bg-blue-50"
            >
              Se detaljerad analys
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mini-graf */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/50">
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Vinstutveckling över tid
              </h4>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyData}>
                    <XAxis 
                      dataKey="year" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis hide />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#059669" 
                      strokeWidth={2}
                      dot={{ fill: '#059669', r: 3 }}
                      activeDot={{ r: 4, fill: '#059669' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Nyckeltal */}
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-slate-200/50">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-slate-600">Break-even</span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {typeof breakEvenMonth === 'number' ? `Månad ${breakEvenMonth}` : breakEvenMonth}
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-slate-200/50">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-600">År 1 vinst</span>
                </div>
                <div className="text-lg font-bold text-emerald-700">
                  {formatCurrency(year1Profit)}
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-slate-200/50">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-slate-600">ROI år 1</span>
                </div>
                <div className="text-lg font-bold text-purple-700">
                  {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-4 pt-4 border-t border-slate-200/50">
            <p className="text-xs text-slate-500 text-center">
              Klicka "Se detaljerad analys" för fullständiga grafer, scenarioanalys och exportfunktioner
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MiniAnalysisPreview;