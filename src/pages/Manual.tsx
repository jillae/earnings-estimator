
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Manual = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Manual för laserkalkylator</h1>
        <div className="prose max-w-none">
          <p>Välkommen till manualen för vår laserkalkylator. Här hittar du information om hur du använder kalkylatorn för att beräkna kostnader och intäkter för olika laserutrustningar.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Kom igång</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Välj laserutrustning från gallerivy eller rullgardinsmenyn</li>
            <li>Ange antalet behandlingar per dag</li>
            <li>Justera leasingkostnaden med reglaget</li>
            <li>Se resultatet i realtid i resultatvyn</li>
          </ol>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Avancerade funktioner</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Justera kliniktillgänglighet och behandlingsfrekvens</li>
            <li>Välj leasingperiod och anpassa försäkringsalternativ</li>
            <li>Granska detaljerade beräkningar för driftskostnader</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Manual;
