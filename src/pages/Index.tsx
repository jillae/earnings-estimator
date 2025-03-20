
import React from 'react';
import Header from '@/components/Header';
import Calculator from '@/components/Calculator';
import Footer from '@/components/Footer';
import MachineGalleryContainer from '@/components/MachineGalleryContainer';
import WhitePaperLibrary from '@/components/WhitePaperLibrary';
import { CalculatorProvider } from '@/context/CalculatorContext';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CalculatorProvider>
        <MachineGalleryContainer />
        <main className="flex-grow py-6">
          <Calculator />
        </main>
        <WhitePaperLibrary />
      </CalculatorProvider>
      <Footer />
    </div>
  );
};

export default Index;
