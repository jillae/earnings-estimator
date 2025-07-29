import React from 'react';
import { Lock, Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GatedOverlayProps {
  onUnlock: () => void;
}

export const GatedOverlay: React.FC<GatedOverlayProps> = ({ onUnlock }) => {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
      <Card className="max-w-md mx-4">
        <CardContent className="p-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-xl font-semibold">Lås upp intäktsberäkningen</h3>
          
          <p className="text-muted-foreground">
            Se dina personliga intäkter och kostnader baserat på din klinikstorlek och behandlingsvolym.
          </p>
          
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center">
              <Calculator className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs">Anpassade beräkningar</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs">Intäktsprognoser</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs">Lönsamhetsanalys</p>
            </div>
          </div>
          
          <Button onClick={onUnlock} className="w-full" size="lg">
            Lås upp kalkylatorn gratis
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Kostnadsfritt • Inga förpliktelser • Omedelbar tillgång
          </p>
        </CardContent>
      </Card>
    </div>
  );
};