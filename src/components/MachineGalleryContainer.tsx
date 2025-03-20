
import React from 'react';
import MachineGallery from './MachineGallery';
import { useCalculator } from '@/context/CalculatorContext';
import { machineData } from '@/data/machines';

const MachineGalleryContainer: React.FC = () => {
  const { selectedMachineId, setSelectedMachineId } = useCalculator();
  
  // Se till att vi inte visar "select-machine" i galleriet
  const filteredMachines = machineData.filter(machine => machine.id !== "select-machine");

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-2">
      <div className="glass-card animate-slide-in" style={{ animationDelay: '200ms' }}>
        <h2 className="text-lg font-medium mb-4">Välj din maskin</h2>
        <MachineGallery
          machines={filteredMachines}
          selectedMachineId={selectedMachineId}
          onChange={setSelectedMachineId}
        />
      </div>
    </div>
  );
};

export default MachineGalleryContainer;
