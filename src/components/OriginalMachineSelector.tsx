import React from 'react';
import { machineData } from '@/data/machines';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OriginalMachineSelectorProps {
  machineId: string;
  onMachineChange: (machineId: string) => void;
}

export const OriginalMachineSelector: React.FC<OriginalMachineSelectorProps> = ({ 
  machineId, 
  onMachineChange 
}) => {
  console.log('OriginalMachineSelector: Rendering med machineId:', machineId);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Välj maskin
      </label>
      <Select value={machineId} onValueChange={onMachineChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Välj en maskin" />
        </SelectTrigger>
        <SelectContent>
          {machineData.map((machine) => (
            <SelectItem key={machine.id} value={machine.id}>
              {machine.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};