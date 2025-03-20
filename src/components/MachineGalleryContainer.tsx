
import React from 'react';
import MachineGallery from './MachineGallery';
import { useCalculator } from '@/context/CalculatorContext';
import { machineData } from '@/data/machineData';
import { specialMachines } from '@/data/machines/special';

const MachineGalleryContainer: React.FC = () => {
  const { selectedMachineId, setSelectedMachineId } = useCalculator();
  const allMachines = [...machineData, ...specialMachines];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-2">
      <div className="glass-card animate-slide-in" style={{ animationDelay: '200ms' }}>
        <h2 className="text-lg font-medium mb-4">Välj din maskin</h2>
        <MachineGallery
          machines={allMachines}
          selectedMachineId={selectedMachineId}
          onChange={setSelectedMachineId}
        />
      </div>
    </div>
  );
};

export default MachineGalleryContainer;
