
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, Globe, Mail, Phone, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Kontakt | Intäktsberäkning</title>
        <meta name="description" content="Kontakta Arch Academy AB för support, frågor och information om Erchonia laserutrustning. Vi är official distributor för Nordics." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-slate-800">Kontakt</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Vi finns här för att hjälpa dig med frågor om våra laserutrustningar och tjänster. 
              Kontakta oss via något av alternativen nedan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Besöksadress */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Building className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-800">Besöksadress</h3>
                    <div className="text-slate-600 leading-relaxed">
                      <p className="font-medium">Arch Academy AB</p>
                      <p>Kopparv 28</p>
                      <p>791 41 FALUN</p>
                      <p>SWEDEN</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Telefon */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Phone className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-800">Telefon</h3>
                    <a href="tel:020-104050" className="text-lg text-slate-600 hover:text-green-600 transition-colors">
                      020-104050
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teknisk support */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Phone className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-800">Teknisk support</h3>
                    <a href="tel:08-773 33 99" className="text-lg text-slate-600 hover:text-green-600 transition-colors">
                      08-773 33 99
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* E-post */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Mail className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-800">E-post</h3>
                    <a href="mailto:gholmgren@erchonia-emea.com" className="text-lg text-slate-600 hover:text-green-600 transition-colors break-all">
                      gholmgren@erchonia-emea.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Globe className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-800">Information</h3>
                    <p className="text-lg text-slate-600">
                      Erchonia official distributor - Nordics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hjälp */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <HelpCircle className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-800">Hjälp</h3>
                    <a 
                      href="https://bit.ly/EENHelpdesk" 
                      className="text-lg text-green-600 hover:text-green-700 transition-colors font-medium"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Supportcenter
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Extra info sektion */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">Öppettider Support</h3>
                <div className="grid md:grid-cols-2 gap-6 text-slate-600">
                  <div>
                    <p className="font-medium mb-2">Allmän support</p>
                    <p>Måndag - Fredag: 09:00 - 17:00</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Teknisk support</p>
                    <p>Måndag - Fredag: 08:00 - 18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
