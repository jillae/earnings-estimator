
import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import MachineGallery from './MachineGallery';
import { useCalculator } from '@/context/CalculatorContext';
import { useMachineData } from '@/hooks/useMachineData';
import { toast } from "sonner";

const MachineGalleryContainer: React.FC = () => {
  const { selectedMachineId, setSelectedMachineId } = useCalculator();
  const [searchParams] = useSearchParams();
  const previousMachineIdRef = useRef<string>(selectedMachineId);
  
  // Hämta maskindata från databas istället för statisk data
  const { calculatorMachines, isLoading, error } = useMachineData();
  
  // Filtrera bort eventuell "select-machine" (endast visa alla maskiner)
  const filteredMachines = calculatorMachines.filter(machine => 
    machine.id !== "select-machine"
  );

  // Hantera URL query parameter för maskinval
  useEffect(() => {
    const machineFromUrl = searchParams.get('machine');
    if (machineFromUrl && machineFromUrl !== selectedMachineId && filteredMachines.length > 0) {
      const machine = filteredMachines.find(m => m.id === machineFromUrl);
      if (machine) {
        setSelectedMachineId(machineFromUrl);
        toast.success(`Laddar beräkning för ${machine.name}`);
      }
    }
  }, [searchParams, selectedMachineId, setSelectedMachineId, filteredMachines]);

  useEffect(() => {
    
    // Visa toast endast när maskin-ID faktiskt ändras (inte vid initial rendering)
    if (previousMachineIdRef.current !== selectedMachineId && 
        selectedMachineId !== "select-machine" && 
        previousMachineIdRef.current !== undefined &&
        !searchParams.get('machine') &&
        filteredMachines.length > 0) { // Visa inte toast för URL-baserade val
      const selectedMachine = filteredMachines.find(machine => machine.id === selectedMachineId);
      if (selectedMachine) {
        toast.success(`Du har valt ${selectedMachine.name}`);
      }
    }
    
    previousMachineIdRef.current = selectedMachineId;
  }, [selectedMachineId, filteredMachines]);

  const handleMachineSelection = (machineId: string) => {
    console.log('MachineGalleryContainer: handleMachineSelection', machineId);
    console.log('Current selectedMachineId:', selectedMachineId);
    setSelectedMachineId(machineId);
  };

  // Visa laddningsindikator medan data hämtas
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto mb-6">
        <div className="relative">
          <div className="absolute -top-3 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
            STEG 1
          </div>
          <div className="glass-card animate-slide-in pt-2" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-semibold mb-4">Välj din maskin</h2>
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-slate-600">Laddar maskiner från databas...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Visa felmeddelande om något gick fel
  if (error) {
    return (
      <div className="max-w-7xl mx-auto mb-6">
        <div className="relative">
          <div className="absolute -top-3 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
            FEL
          </div>
          <div className="glass-card animate-slide-in pt-2" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-semibold mb-4">Fel vid laddning av maskiner</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Försök igen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mb-6">
      <div className="relative">
        <div className="absolute -top-3 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
          STEG 1
        </div>
        <div className="glass-card animate-slide-in pt-2" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-semibold mb-4">Välj din maskin</h2>
          <MachineGallery
            machines={filteredMachines}
            selectedMachineId={selectedMachineId}
            onChange={handleMachineSelection}
          />
        </div>
      </div>
    </div>
  );
};

export default MachineGalleryContainer;
