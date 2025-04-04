
import React from 'react';
import Header from '@/components/Header';
import Calculator from '@/components/Calculator';
import Footer from '@/components/Footer';
import MachineGalleryContainer from '@/components/MachineGalleryContainer';
import WhitePaperLibrary from '@/components/WhitePaperLibrary';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Intäktsberäkning för laserkliniker</title>
        <meta name="description" content="Beräkna intäkter och kostnader för din laserklinik med vår intäktsberäknare. Jämför leasingalternativ och visualisera din lönsamhet." />
        <meta name="keywords" content="intäktsberäkning, laser, laserklinik, lönsamhet, beräknare, kalkylator" />
      </Helmet>
      
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
