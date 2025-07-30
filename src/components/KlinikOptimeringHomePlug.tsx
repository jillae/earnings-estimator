import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Brain, ExternalLink, Target, Users } from 'lucide-react';

export const KlinikOptimeringHomePlug: React.FC = () => {
  return (
    <section className="container max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="relative">
        {/* Bakgrundsgradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-emerald-50/50 to-purple-50/50 rounded-2xl"></div>
        
        <Card className="relative border-blue-200/50 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Target className="h-6 w-6 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                Kapacitetsanalys
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Maximera din kliniks potential med smart beläggningsanalys
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upptäck hur olika beläggningsgrader påverkar din lönsamhet och få strategier för att nå dina tillväxtmål
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">50%</div>
                <div className="text-sm text-blue-600">Försiktig start</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200">
                <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-700">75%</div>
                <div className="text-sm text-emerald-600">Stabil tillväxt</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">100%</div>
                <div className="text-sm text-purple-600">Full kapacitet</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200">
                <Brain className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-emerald-700">AI-assistent</div>
                <div className="text-sm text-emerald-600">24/7 affärsrådgivning</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-100 border border-indigo-200">
                <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-indigo-700">+30%</div>
                <div className="text-sm text-indigo-600">Kapacitetsutnyttjande</div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button 
                size="lg"
                className="group px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.open('/klinik-optimering-coming-soon', '_blank')}
              >
                <Target className="h-5 w-5 mr-2" />
                Få personlig kapacitetsanalys
                <ExternalLink className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Kostnadsfri konsultation • Skräddarsydda strategier för din klinik
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};