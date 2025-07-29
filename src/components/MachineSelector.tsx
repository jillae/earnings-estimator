
import React, { useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Machine } from '@/data/machines/types';
import { useCalculator } from '@/context/CalculatorContext';

interface MachineSelectorProps {
  machines: Machine[];
  selectedMachineId: string;
  onChange: (machineId: string) => void;
}

const MachineSelector: React.FC<MachineSelectorProps> = ({ 
  machines, 
  selectedMachineId, 
  onChange 
}) => {
  const { logSignificantInteraction } = useCalculator();
  
  // Debug-loggning för att se vilken maskin som är vald
  useEffect(() => {
    console.log(`MachineSelector: Rendering med machineId: ${selectedMachineId}`);
  }, [selectedMachineId]);

  const handleMachineChange = (newMachineId: string) => {
    console.log(`MachineSelector: Användaren valde maskin i dropdown: ${newMachineId}`);
    
    // Logga signifikant interaktion för gated access
    logSignificantInteraction('machine_changed');
    
    // Alltid trigga onChange för att säkerställa konsekvent uppdatering
    onChange(newMachineId);
  };

  // Visa alltid dropdown-väljaren, oavsett vald maskin
  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '100ms' }}>
      <label htmlFor="machine-select" className="input-label mb-4">
        Välj maskin
      </label>
      
      {/* Traditionell dropdown för maskinval som backup/alternativ */}
      <div>
        <Select 
          value={selectedMachineId} 
          onValueChange={handleMachineChange}
          onOpenChange={(open) => {
            if (open) {
              console.log("MachineSelector: Dropdown öppnades");
            }
          }}
        >
          <SelectTrigger className="w-full h-auto py-3 min-h-[50px]" id="machine-select">
            <SelectValue placeholder="Växla maskin här" />
          </SelectTrigger>
          
          <SelectContent position="item-aligned" className="w-full max-h-[400px] bg-white z-50">
            <SelectItem value="select-machine">Växla maskin här</SelectItem>
            {machines.map((machine) => (
              <SelectItem key={machine.id} value={machine.id}>
                <div className="flex flex-col py-1">
                  <span className="font-medium">{machine.name}</span>
                  <span className="text-xs text-slate-500">{machine.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MachineSelector;
