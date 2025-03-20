
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Help = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Hjälp & Support</h1>
        <div className="prose max-w-none">
          <p>Behöver du hjälp med att använda laserkalkylatorn? Här har vi samlat vanliga frågor och svar.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Vanliga frågor</h2>
          
          <div className="space-y-6 mt-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Hur räknar kalkylatorn ut leasingkostnaden?</h3>
              <p className="mt-2">Leasingkostnaden beräknas baserat på maskinens pris, leasingperiod, leasingfaktor och försäkringsalternativ. Kalkylatorn tar även hänsyn till valutakurser för importerade maskiner.</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Varför skiljer sig intäktsberäkningarna mellan olika maskiner?</h3>
              <p className="mt-2">Intäktsberäkningarna baseras på respektive maskins förmåga, behandlingstider, behandlingskostnader och kreditåtgång. Premiumutrustning kan generera högre intäkter per behandling.</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Hur uppdaterar jag valutakurser och andra inställningar?</h3>
              <p className="mt-2">Endast administratörer kan uppdatera valutakurser och andra systemparametrar. Logga in via Admin-knappen om du har administratörsbehörighet.</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Teknisk support</h2>
          <p>Kontakta vår tekniska support på <strong>support@lasercalculator.se</strong> eller ring <strong>+46 123 456 789</strong>.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
