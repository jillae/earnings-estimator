import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalculator } from '@/context/CalculatorContext';
import { useMachineData } from '@/hooks/useMachineData';
import { Monitor, Zap, Smartphone } from 'lucide-react';

interface MachineQuickSwitchProps {
  hoveredInput?: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null;
  onHoveredInputChange?: (input: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null) => void;
}

const MachineQuickSwitch: React.FC<MachineQuickSwitchProps> = ({
  hoveredInput,
  onHoveredInputChange
}) => {
  const { selectedMachineId, setSelectedMachineId, selectedMachine } = useCalculator();
  const { calculatorMachines } = useMachineData();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'premium':
        return <Monitor className="w-4 h-4" />;
      case 'treatment':
        return <Zap className="w-4 h-4" />;
      case 'handheld':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'premium': return 'Premium';
      case 'treatment': return 'Behandling';
      case 'handheld': return 'Handhållen';
      case 'special': return 'Special';
      default: return 'Okänd';
    }
  };

  // Gruppera maskiner per kategori
  const groupedMachines = calculatorMachines.reduce((groups, machine) => {
    const category = (machine as any).category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(machine);
    return groups;
  }, {} as Record<string, typeof calculatorMachines>);

  return (
    <div 
      className="bg-white rounded-2xl border border-green-100 shadow-subtle p-4 animate-slide-in hover:shadow-lg transition-all duration-200"
      style={{ animationDelay: '175ms' }}
      onMouseEnter={() => onHoveredInputChange?.('clinic')}
      onMouseLeave={() => onHoveredInputChange?.(null)}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔄</span>
        <h3 className="text-md font-semibold text-slate-800">Växla maskin</h3>
      </div>
      
      <Select value={selectedMachineId} onValueChange={setSelectedMachineId}>
        <SelectTrigger className="w-full bg-white border-green-200 hover:border-green-300 focus:border-green-400 focus:ring-green-200">
          <SelectValue placeholder="Välj en annan maskin...">
            {selectedMachine && (
              <div className="flex items-center gap-2">
                {getCategoryIcon((selectedMachine as any).category)}
                <span>{selectedMachine.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-green-200 shadow-lg max-h-96 z-50">
          {Object.entries(groupedMachines).map(([category, machines]) => (
            <div key={category}>
              <div className="px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50 border-b border-slate-100">
                {getCategoryName(category)}
              </div>
              {machines.map((machine) => (
                <SelectItem
                  key={machine.id}
                  value={machine.id}
                  className="cursor-pointer hover:bg-green-50 focus:bg-green-50 py-2"
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon((machine as any).category)}
                    <span className="font-medium">{machine.name}</span>
                    {machine.usesCredits && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Credits
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
      
      {selectedMachine && (
        <div className="mt-2 text-xs text-slate-600">
          Nuvarande: <span className="font-medium text-green-700">{selectedMachine.name}</span>
        </div>
      )}
    </div>
  );
};

export default MachineQuickSwitch;