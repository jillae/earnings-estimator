import React from 'react';
import { Slider } from "@/components/ui/slider";
import { useCalculator } from '@/context/CalculatorContext';

interface WorkDaysSettingsProps {
  treatmentsPerDay: number;
  customerPrice: number;
  onTreatmentsChange: (value: number) => void;
  onCustomerPriceChange: (value: number) => void;
}

const WorkDaysSettings: React.FC<WorkDaysSettingsProps> = ({
  treatmentsPerDay,
  customerPrice,
  onTreatmentsChange,
  onCustomerPriceChange
}) => {
  const { logSignificantInteraction, leasingCost, operatingCost } = useCalculator();

  // Beräkna nuvarande nollpunkt i arbetsdagar
  const calculateBreakEvenDays = () => {
    const totalMonthlyCost = leasingCost + operatingCost.costPerMonth;
    const monthlyRevenueExVat = (treatmentsPerDay * customerPrice * 22) / 1.25; // 22 arbetsdagar per månad
    const dailyRevenue = monthlyRevenueExVat / 22;
    if (dailyRevenue <= 0 || totalMonthlyCost <= 0) return 22;
    
    const breakEvenDays = totalMonthlyCost / dailyRevenue;
    return Math.round(Math.max(1, Math.min(22, breakEvenDays)));
  };

  const currentBreakEvenDays = calculateBreakEvenDays();

  // Hantera arbetsdagar slider - beräkna behandlingar per dag baserat på önskad nollpunkt
  const handleWorkDaysSliderChange = (values: number[]) => {
    logSignificantInteraction('work_days_changed');
    const targetWorkDays = values[0];
    
    const totalMonthlyCost = leasingCost + operatingCost.costPerMonth;
    
    // Beräkna hur många behandlingar per dag som behövs för att nå denna nollpunkt
    if (customerPrice > 0 && totalMonthlyCost > 0) {
      const requiredDailyRevenue = totalMonthlyCost / targetWorkDays;
      const requiredMonthlyRevenueExVat = requiredDailyRevenue * 22;
      const requiredMonthlyRevenueIncVat = requiredMonthlyRevenueExVat * 1.25;
      const requiredTreatmentsPerDay = requiredMonthlyRevenueIncVat / (customerPrice * 22);
      
      const newTreatments = Math.round(Math.max(1, Math.min(12, requiredTreatmentsPerDay)));
      onTreatmentsChange(newTreatments);
    }
  };

  // Hantera kundpris via slider
  const handleCustomerPriceSliderChange = (values: number[]) => {
    logSignificantInteraction('customer_price_changed');
    onCustomerPriceChange(values[0]);
  };

  return (
    <section className="w-full flex flex-row gap-4 md:gap-6">
      {/* Nollpunkt i arbetsdagar */}
      <div className="flex-1 flex flex-col justify-between bg-emerald-50/20 border-emerald-200 rounded-2xl border px-5 py-6 shadow-subtle min-h-[164px] hover:bg-emerald-50/30 transition-colors">
        <label htmlFor="work-days" className="text-sm font-semibold text-emerald-800 mb-3 flex items-center">
          <span className="w-2 h-2 bg-emerald-400 rounded-sm mr-2"></span>
          Nollpunkt (arbetsdagar/månad)
        </label>
        <div className="space-y-4">
          <div className="text-lg font-semibold text-slate-800">{currentBreakEvenDays} dagar</div>
          <Slider
            value={[currentBreakEvenDays]}
            min={1}
            max={22}
            step={1}
            onValueChange={handleWorkDaysSliderChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>1 dag</span>
            <span>22 dagar</span>
          </div>
        </div>
        <p className="text-xs text-emerald-600">Påverkar behandlingar per dag ({treatmentsPerDay} st)</p>
      </div>
      
      {/* Kundpris */}
      <div className="flex-1 flex flex-col justify-between bg-emerald-50/20 border-emerald-200 rounded-2xl border px-5 py-6 shadow-subtle min-h-[164px] hover:bg-emerald-50/30 transition-colors">
        <label htmlFor="customer-price" className="text-sm font-semibold text-emerald-800 mb-3 flex items-center">
          <span className="w-2 h-2 bg-emerald-400 rounded-sm mr-2"></span>
          Kundpris per behandling (kr, inkl moms)
        </label>
        <div className="space-y-4">
          <div className="text-lg font-semibold text-slate-800">{Math.round(customerPrice).toLocaleString()} kr</div>
          <Slider
            value={[customerPrice]}
            min={500}
            max={8000}
            step={100}
            onValueChange={handleCustomerPriceSliderChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>500 kr</span>
            <span>8 000 kr</span>
          </div>
        </div>
        <p className="text-xs text-emerald-600">Justera med sliden</p>
      </div>
    </section>
  );
};

export default WorkDaysSettings;