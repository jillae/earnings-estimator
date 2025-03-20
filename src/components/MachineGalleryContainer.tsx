
import React, { useEffect } from 'react';
import MachineGallery from './MachineGallery';
import { useCalculator } from '@/context/CalculatorContext';
import { machineData } from '@/data/machines';
import { toast } from "sonner";

const MachineGalleryContainer: React.FC = () => {
  const { selectedMachineId, setSelectedMachineId } = useCalculator();
  
  // Se till att vi inte visar "select-machine" i galleriet
  const filteredMachines = machineData.filter(machine => machine.id !== "select-machine");

  // Debug för att se om Context värden fungerar
  useEffect(() => {
    console.log("MachineGalleryContainer: Nuvarande vald maskin ID:", selectedMachineId);
  }, [selectedMachineId]);

  const handleMachineSelection = (machineId: string) => {
    console.log(`MachineGalleryContainer: Sätter vald maskin till: ${machineId}`);
    
    // Uppdatera vald maskin i context
    setSelectedMachineId(machineId);
    
    // Visa bekräftelse med toast
    const selectedMachine = machineData.find(machine => machine.id === machineId);
    if (selectedMachine) {
      toast.success(`Du har valt ${selectedMachine.name}`);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-2">
      <div className="glass-card animate-slide-in" style={{ animationDelay: '200ms' }}>
        <h2 className="text-lg font-medium mb-4">Välj din maskin</h2>
        <MachineGallery
          machines={filteredMachines}
          selectedMachineId={selectedMachineId}
          onChange={handleMachineSelection}
        />
      </div>
    </div>
  );
};

export default MachineGalleryContainer;
