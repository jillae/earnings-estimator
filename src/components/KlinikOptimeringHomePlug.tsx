import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Brain, ExternalLink, Sparkles } from 'lucide-react';

export const KlinikOptimeringHomePlug: React.FC = () => {
  return (
    <section className="container max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="relative">
        {/* Bakgrundsgradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl"></div>
        
        <Card className="relative border-primary/20 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Brain className="h-6 w-6 text-primary" />
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-driven klinikoptimering
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Ta nästa steg: Optimera hela din klinik
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nu när du har koll på maskinens ekonomi - upptäck hur vår AI-assistent kan hjälpa dig maximera hela klinikens potential
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">+30%</div>
                <div className="text-sm text-green-600">Högre kapacitetsutnyttjande</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200">
                <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">+25%</div>
                <div className="text-sm text-blue-600">Ökad omsättning</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
                <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-purple-700">AI-assistent</div>
                <div className="text-sm text-purple-600">24/7 affärsrådgivning</div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button 
                size="lg"
                className="group px-8 py-3 text-lg"
                onClick={() => window.open('/klinik-optimering-coming-soon', '_blank')}
              >
                <Brain className="h-5 w-5 mr-2" />
                Upptäck KlinikOptimering
                <ExternalLink className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Gratis testperiod • Ingen kreditkort krävs • Kom igång på 2 minuter
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};