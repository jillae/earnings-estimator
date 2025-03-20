
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Machine } from '@/data/machines/types';
import MachineGallery from './MachineGallery';

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
      <label htmlFor="machine-select" className="input-label mb-4">
        Välj maskin
      </label>
      
      {/* Visuell galleri för maskinval */}
      <MachineGallery 
        machines={machines} 
        selectedMachineId={selectedMachineId}
        onChange={onChange}
      />
      
      {/* Traditionell dropdown för maskinval som backup/alternativ */}
      <div className="mt-4">
        <Select value={selectedMachineId} onValueChange={handleMachineChange}>
          <SelectTrigger className="w-full h-auto py-3 min-h-[50px]" id="machine-select">
            <SelectValue placeholder="Välj maskin" />
          </SelectTrigger>
          
          <SelectContent position="item-aligned" className="w-full max-h-[400px]">
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
