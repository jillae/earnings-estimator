
import React, { useEffect, useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Machine } from '@/data/machines/types';

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
  // Förenkla genom att helt använda selectedMachineId som källa för sanningen
  // istället för att försöka hantera ett eget state
  
  const handleMachineChange = (newValue: string) => {
    console.log(`MachineSelector: Användaren valde maskin: ${newValue}`);
    if (newValue !== selectedMachineId) {
      onChange(newValue);
    }
  };

  // Debug loggning
  useEffect(() => {
    console.log(`MachineSelector: Rendering med machineId: ${selectedMachineId}`);
  }, [selectedMachineId]);

  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '100ms' }}>
      <label htmlFor="machine-select" className="input-label mb-4">
        Välj maskin
      </label>
      
      {/* Traditionell dropdown för maskinval som backup/alternativ */}
      <div>
        <Select value={selectedMachineId} onValueChange={handleMachineChange}>
          <SelectTrigger className="w-full h-auto py-3 min-h-[50px]" id="machine-select">
            <SelectValue placeholder="Välj maskin" />
          </SelectTrigger>
          
          <SelectContent position="item-aligned" className="w-full max-h-[400px] bg-white">
            <SelectItem value="select-machine">Välj maskin</SelectItem>
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
