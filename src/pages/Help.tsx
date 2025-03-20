
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ExternalLink, Phone } from 'lucide-react';

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
          </div>
          
          <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              Teknisk support
            </h2>
            <p className="text-lg font-medium">Telefon: 08-773 33 00</p>
            
            <div className="mt-4">
              <a 
                href="https://bit.ly/EENHelpdesk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Supportcenter <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
            
            <div className="mt-4 text-sm text-blue-700">
              <p>Arch Academy AB</p>
              <p>Kopparv 28</p>
              <p>791 41 FALUN</p>
              <p>SWEDEN</p>
              <p>020-104050</p>
              <p>Erchonia official distributor - Nordics</p>
              <p>gholmgren@erchonia-emea.com</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
