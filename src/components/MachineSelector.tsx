
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
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '100ms' }}>
      <div className="text-center">
        <label htmlFor="machine-select" className="text-lg font-semibold block mb-4">
          Växla maskin - vid behov
        </label>
        
        {/* Centrerad dropdown för maskinval */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Select 
              value={selectedMachineId} 
              onValueChange={handleMachineChange}
              onOpenChange={(open) => {
                if (open) {
                  console.log("MachineSelector: Dropdown öppnades");
                }
              }}
            >
              <SelectTrigger className="w-full h-auto py-3 min-h-[50px] text-center bg-background border-2" id="machine-select">
                <SelectValue placeholder="Välj en maskin" />
              </SelectTrigger>
              
              <SelectContent position="item-aligned" className="w-full max-h-[400px] bg-background border shadow-lg z-[100]">
                {machines.map((machine) => (
                  <SelectItem 
                    key={machine.id} 
                    value={machine.id}
                    className="hover:bg-slate-100 focus:bg-slate-100"
                  >
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
      </div>
    </div>
  );
};

export default MachineSelector;
