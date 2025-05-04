
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DealerRevenueReport from '@/components/DealerRevenueReport';
import { Helmet } from 'react-helmet-async';

const DealerRevenue = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Återförsäljarintäkt - Analys</title>
        <meta name="description" content="Analys av intäkter för återförsäljare vid olika leasingalternativ." />
      </Helmet>
      
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Återförsäljarintäkt - Analys</h1>
          <DealerRevenueReport includeInsurance={true} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DealerRevenue;
