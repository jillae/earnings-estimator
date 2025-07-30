import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';

// Hook för separata beräkningar inuti modalen
export const useModalCalculations = () => {
  const { 
    revenue: baseRevenue,
    netResults: baseNetResults,
    leasingCost,
    operatingCost,
    selectedMachine
  } = useCalculator();

  // Separata states för modalen - sätt defaultvärden enligt emerald
  const [modalTreatmentsPerDay, setModalTreatmentsPerDay] = useState(4);
  const [modalCustomerPrice, setModalCustomerPrice] = useState(3500);

  // Initialisera med värden från huvudkalkylatorn - men behåll våra defaultvärden
  useEffect(() => {
    // Kommenterar ut denna automatiska uppdatering så att våra defaults behålls
    // const originalTreatments = Math.round(baseRevenue.dailyRevenueIncVat / modalCustomerPrice);
    // if (originalTreatments > 0 && originalTreatments <= 20) {
    //   setModalTreatmentsPerDay(originalTreatments);
    // }
  }, [baseRevenue.dailyRevenueIncVat]);

  // Återställ defaultvärden när maskin byts
  useEffect(() => {
    if (selectedMachine) {
      // Sätt defaults baserat på maskinen
      if (selectedMachine.id === 'emerald') {
        setModalTreatmentsPerDay(4);
        setModalCustomerPrice(3500);
      } else if (selectedMachine.id === 'zerona') {
        setModalTreatmentsPerDay(3);
        setModalCustomerPrice(2800);
      } else if (selectedMachine.id === 'fx-635') {
        setModalTreatmentsPerDay(3);
        setModalCustomerPrice(2200);
      } else if (selectedMachine.id === 'fx-405') {
        setModalTreatmentsPerDay(2);
        setModalCustomerPrice(1800);
      } else {
        // Default för övriga maskiner
        setModalTreatmentsPerDay(2);
        setModalCustomerPrice(1800);
      }
    }
  }, [selectedMachine?.id]);

  // Beräkna modal-specifika värden
  const calculateModalRevenue = () => {
    const VAT_RATE = 0.25;
    const WORKING_DAYS_PER_MONTH = 22;
    const MONTHS_PER_YEAR = 12;

    const dailyRevenueIncVat = modalTreatmentsPerDay * modalCustomerPrice;
    const dailyRevenueExVat = dailyRevenueIncVat / (1 + VAT_RATE);
    
    const monthlyRevenueIncVat = dailyRevenueIncVat * WORKING_DAYS_PER_MONTH;
    const monthlyRevenueExVat = dailyRevenueExVat * WORKING_DAYS_PER_MONTH;
    
    const yearlyRevenueIncVat = monthlyRevenueIncVat * MONTHS_PER_YEAR;
    const yearlyRevenueExVat = monthlyRevenueExVat * MONTHS_PER_YEAR;

    return {
      dailyRevenueIncVat,
      dailyRevenueExVat,
      monthlyRevenueIncVat,
      monthlyRevenueExVat,
      yearlyRevenueIncVat,
      yearlyRevenueExVat
    };
  };

  const modalRevenue = calculateModalRevenue();
  const totalMonthlyCost = leasingCost + operatingCost.totalCost;
  const modalNetPerMonthExVat = modalRevenue.monthlyRevenueExVat - totalMonthlyCost;
  const modalNetPerYearExVat = modalNetPerMonthExVat * 12;

  // Beräkna kumulativa data för grafen
  const generateMonthlyData = () => {
    const monthlyData = [];
    const monthlyNet = modalNetPerMonthExVat;
    
    for (let month = 1; month <= 60; month++) {
      const cumulativeRevenue = modalRevenue.monthlyRevenueExVat * month;
      const cumulativeCosts = totalMonthlyCost * month;
      const cumulativeNet = monthlyNet * month;
      
      monthlyData.push({
        month: month,
        monthLabel: `Mån ${month}`,
        yearLabel: `År ${Math.ceil(month / 12)}`,
        // Kumulativa data  
        intaktKumulativ: cumulativeRevenue,
        kostnadKumulativ: cumulativeCosts,
        nettoKumulativ: cumulativeNet
      });
    }
    return monthlyData;
  };

  return {
    // Modal-specifika states
    modalTreatmentsPerDay,
    setModalTreatmentsPerDay,
    modalCustomerPrice,
    setModalCustomerPrice,
    
    // Beräknade värden
    modalRevenue,
    modalNetPerMonthExVat,
    modalNetPerYearExVat,
    totalMonthlyCost,
    
    // Data för grafer
    monthlyData: generateMonthlyData(),
    
    // Originalvärden för jämförelse
    originalRevenue: baseRevenue,
    originalNetResults: baseNetResults
  };
};