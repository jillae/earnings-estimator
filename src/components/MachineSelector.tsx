
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Machine } from '@/data/machineData';

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
  const handleMachineChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '100ms' }}>
      <label htmlFor="machine-select" className="input-label">
        Välj maskin
      </label>
      
      <Select value={selectedMachineId} onValueChange={handleMachineChange}>
        <SelectTrigger className="w-full" id="machine-select">
          <SelectValue placeholder="Välj maskin" />
        </SelectTrigger>
        
        <SelectContent>
          {machines.map((machine) => (
            <SelectItem key={machine.id} value={machine.id}>
              <div className="flex flex-col">
                <span>{machine.name}</span>
                <span className="text-xs text-slate-500">{machine.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MachineSelector;
