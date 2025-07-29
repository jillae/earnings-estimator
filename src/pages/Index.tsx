
import React from 'react';
import Header from '@/components/Header';
import Calculator from '@/components/Calculator';
import WhitePaperLibrary from '@/components/WhitePaperLibrary';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Intäktsberäkning för laserkliniker</title>
        <meta name="description" content="Beräkna intäkter och kostnader för din laserklinik med vår intäktsberäknare. Jämför leasingalternativ och visualisera din lönsamhet." />
      </Helmet>
      
      <Header />
      <main className="flex-grow py-6">
        <Calculator />
        <WhitePaperLibrary />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
