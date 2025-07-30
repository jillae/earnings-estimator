import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Users, Brain, ExternalLink } from 'lucide-react';

export const KlinikOptimeringSidebar: React.FC = () => {
  return (
    <Card className="border-l-4 border-l-primary/60 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">
            AI-driven
          </Badge>
        </div>
        <CardTitle className="text-lg">Maximera din kliniks potential</CardTitle>
        <CardDescription className="text-sm">
          Få fullständig översikt över kapacitet, ekonomi och kundflöde med AI-assistans
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium">+30%</span>
            <span className="text-muted-foreground text-xs">kapacitet</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="font-medium">+25%</span>
            <span className="text-muted-foreground text-xs">omsättning</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>AI-assistent för strategiska beslut</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Realtidsanalys av kapacitetsutnyttjande</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Smart personalplanering och resursoptimering</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50">
          <Button 
            className="w-full group" 
            onClick={() => window.open('https://klinik-flow-control.lovable.app', '_blank')}
            variant="default"
          >
            <Users className="h-4 w-4 mr-2" />
            Optimera din klinik
            <ExternalLink className="h-3 w-3 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            Gratis testperiod • Ingen kreditkort krävs
          </p>
        </div>
      </CardContent>
    </Card>
  );
};