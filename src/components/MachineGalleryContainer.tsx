
import React, { useEffect, useRef } from 'react';
import MachineGallery from './MachineGallery';
import { useCalculator } from '@/context/CalculatorContext';
import { machineData } from '@/data/machines';
import { toast } from "sonner";

const MachineGalleryContainer: React.FC = () => {
  const { selectedMachineId, setSelectedMachineId } = useCalculator();
  const previousMachineIdRef = useRef<string>(selectedMachineId);
  
  // Se till att vi inte visar "select-machine" i galleriet
  const filteredMachines = machineData.filter(machine => machine.id !== "select-machine");

  // Debug för att se om Context värden fungerar
  useEffect(() => {
    console.log("MachineGalleryContainer: Nuvarande vald maskin ID från context:", selectedMachineId);
    
    // Visa toast endast när maskin-ID faktiskt ändras (inte vid initial rendering)
    if (previousMachineIdRef.current !== selectedMachineId && 
        selectedMachineId !== "select-machine" && 
        previousMachineIdRef.current !== undefined) {
      const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
      if (selectedMachine) {
        toast.success(`Du har valt ${selectedMachine.name}`);
      }
    }
    
    previousMachineIdRef.current = selectedMachineId;
  }, [selectedMachineId]);

  const handleMachineSelection = (machineId: string) => {
    console.log(`MachineGalleryContainer: Användaren valde maskin: ${machineId}`);
    // Uppdatera den globala staten direkt, även om samma maskin väljs igen
    if (machineId !== selectedMachineId) {
      setSelectedMachineId(machineId);
    } else {
      // Forcera en uppdatering även om samma maskin väljs igen
      // Detta hjälper till att synkronisera UI när samma val görs
      const forceUpdate = setTimeout(() => {
        setSelectedMachineId(machineId);
      }, 0);
      return () => clearTimeout(forceUpdate);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-6">
      <div className="glass-card animate-slide-in" style={{ animationDelay: '200ms' }}>
        <h2 className="text-xl font-semibold mb-4">Välj din maskin</h2>
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
