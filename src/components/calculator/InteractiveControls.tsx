import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

interface InteractiveControlsProps {
  treatmentsPerDay: number;
  onTreatmentsChange: (value: number) => void;
  customerPrice: number;
  onCustomerPriceChange: (value: number) => void;
  monthlyRevenue: number;
  monthlyNet: number;
}

const InteractiveControls: React.FC<InteractiveControlsProps> = ({
  treatmentsPerDay,
  onTreatmentsChange,
  customerPrice,
  onCustomerPriceChange,
  monthlyRevenue,
  monthlyNet
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-800">
            Interaktiva Prognoser - Testa Din Kliniks Potential
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Antal behandlingar per dag */}
          <div className="space-y-3">
            <Label htmlFor="modal-treatments" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Antal behandlingar per dag
            </Label>
            <div className="space-y-2">
              <Slider
                id="modal-treatments"
                min={1}
                max={12}
                step={1}
                value={[treatmentsPerDay]}
                onValueChange={(value) => onTreatmentsChange(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1 beh/dag</span>
                <span className="font-semibold text-blue-600">{treatmentsPerDay} behandlingar/dag</span>
                <span>12 beh/dag</span>
              </div>
            </div>
          </div>

          {/* Kundpris per behandling */}
          <div className="space-y-3">
            <Label htmlFor="modal-price" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Kundpris per behandling (ink moms)
            </Label>
            <div className="space-y-2">
              <Input
                id="modal-price"
                type="number"
                min="500"
                max="10000"
                step="100"
                value={customerPrice}
                onChange={(e) => onCustomerPriceChange(Number(e.target.value))}
                className="text-center font-medium"
              />
              <div className="text-xs text-slate-500 text-center">
                500 kr - 10 000 kr per behandling
              </div>
            </div>
          </div>
        </div>

        {/* Resultat-förhandsvisning */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-sm text-slate-600">Din månatliga intäkt</div>
            <div className="text-xl font-bold text-emerald-600">{formatCurrency(monthlyRevenue)}</div>
            <div className="text-xs text-slate-500">ex moms</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-600">Din månatliga netto</div>
            <div className="text-xl font-bold text-blue-600">{formatCurrency(monthlyNet)}</div>
            <div className="text-xs text-slate-500">ex moms</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Prognos-verktyg</p>
          <p>Justera värdena ovan för att se hur olika scenarier påverkar din kliniks lönsamhet över tid. Grafen uppdateras automatiskt!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveControls;