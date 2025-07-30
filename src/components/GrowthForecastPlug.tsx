import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, LineChart, BarChart3, ExternalLink, Sparkles, Target, Calendar } from 'lucide-react';

export const GrowthForecastPlug: React.FC = () => {
  return (
    <section className="mt-8">
      <div className="relative">
        {/* Bakgrundsgradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-blue-50/50 to-purple-50/50 rounded-2xl"></div>
        
        <Card 
          className="relative border-emerald-200/50 shadow-lg bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          onClick={() => window.open('/klinik-optimering-coming-soon', '_blank')}
        >
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Datadriven tillväxt
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">
              Visualisera din tillväxtresa med avancerad prognosanalys
            </CardTitle>
            <CardDescription className="text-base text-slate-600 max-w-2xl mx-auto">
              Se hur din investering utvecklas över tid med interaktiva grafer och scenario-analyser
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200">
                <LineChart className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-emerald-700">3-års</div>
                <div className="text-xs text-emerald-600">Prognos</div>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200">
                <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-700">Scenarier</div>
                <div className="text-xs text-blue-600">Analys</div>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200">
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-purple-700">ROI</div>
                <div className="text-xs text-purple-600">Optimering</div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="text-xs text-muted-foreground">
                Avancerade grafer • Scenario-planering • Gratis för alla användare
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};