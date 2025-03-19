
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';
import { fetchExchangeRate, calculateMachinePriceSEK } from '@/utils/calculatorUtils';

export function useMachinePricing({
  selectedMachineId,
  setCustomerPrice
}: {
  selectedMachineId: string;
  setCustomerPrice: (price: number) => void;
}) {
  const [exchangeRate, setExchangeRate] = useState<number>(11.49260);
  const [machinePriceSEK, setMachinePriceSEK] = useState<number>(0);

  // Fetch exchange rate on initial load
  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        const rate = await fetchExchangeRate();
        console.log("Fetched exchange rate:", rate);
        setExchangeRate(rate);
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    };
    
    getExchangeRate();
  }, []);

  // Update machine price in SEK when exchange rate or selected machine changes
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    if (selectedMachine) {
      setCustomerPrice(selectedMachine.defaultCustomerPrice || 1990);
      
      const priceSEK = calculateMachinePriceSEK(selectedMachine, exchangeRate);
      console.log("Machine price in SEK:", priceSEK);
      setMachinePriceSEK(priceSEK);
    }
  }, [selectedMachineId, exchangeRate, setCustomerPrice]);

  return {
    exchangeRate,
    machinePriceSEK
  };
}
