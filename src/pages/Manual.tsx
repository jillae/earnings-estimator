
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const Manual = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Manual | Intäktsberäkning</title>
        <meta name="description" content="Utförlig guide och manual för att använda vår Intäktsberäkning för laserkliniker. Lär dig hur du maximerar lönsamheten för din klinik." />
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Manual för Intäktsberäkning</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-8">Välkommen till manualen för vår Intäktsberäkning. Här hittar du information om hur du använder kalkylatorn för att beräkna kostnader och intäkter för olika laserutrustningar.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Kom igång</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li className="pl-2">Välj laserutrustning från gallerivy eller rullgardinsmenyn</li>
            <li className="pl-2">Ange antalet behandlingar per dag</li>
            <li className="pl-2">Justera kundpris för varje behandling</li>
            <li className="pl-2">Justera leasingkostnaden med reglaget</li>
            <li className="pl-2">Se resultatet i realtid i resultatvyn</li>
          </ol>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">Avancerade funktioner</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="pl-2">
              <strong>Kliniktillgänglighet:</strong> Du kan anpassa kalkylen baserat på storleken på din klinik genom att välja Liten, Mellan eller Stor i inställningarna.
            </li>
            <li className="pl-2">
              <strong>Flatrate-modell:</strong> För utrustningar som använder credits kan du aktivera flatrate-modellen, där du får obegränsade credits mot en fast månadskostnad. Detta aktiveras när leasingkostnaden når minst 80% av maxvärdet och du har minst 3 behandlingar per dag.
            </li>
            <li className="pl-2">
              <strong>Leasingperioder:</strong> Välj mellan olika leasingperioder (36, 48 eller 60 månader) för att se hur det påverkar dina månadskostnader.
            </li>
            <li className="pl-2">
              <strong>Försäkringsalternativ:</strong> Se hur valet av försäkring påverkar dina totala kostnader.
            </li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">Tolka resultaten</h2>
          <p>I resultatvyn kan du se följande information:</p>
          <ul className="list-disc pl-5 space-y-3">
            <li className="pl-2"><strong>Dagliga, veckovisa, månatliga och årliga intäkter</strong> baserat på dina inställningar.</li>
            <li className="pl-2"><strong>Månatliga kostnader</strong> inklusive leasingkostnad och driftkostnader.</li>
            <li className="pl-2"><strong>Nettoresultat per månad och år</strong> (exkl. moms).</li>
            <li className="pl-2"><strong>Intäktsprojektioner</strong> vid olika beläggningsgrader (50%, 75% och 100%).</li>
          </ul>
          
          <div className="bg-blue-50 p-6 rounded-lg mt-10 mb-4">
            <h3 className="text-xl font-semibold mb-3 text-blue-800">Tips för effektiv användning</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li className="pl-2">Experimentera med olika kundpriser för att hitta optimal lönsamhet</li>
              <li className="pl-2">Jämför olika laserutrustningar för att se vilken som passar din klinik bäst</li>
              <li className="pl-2">Använd beläggningsgraderna för att planera för olika scenarier</li>
              <li className="pl-2">Utvärdera om flatrate-modellen är lönsam för dina specifika behandlingsvolymer</li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Manual;
