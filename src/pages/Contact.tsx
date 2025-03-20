
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Kontakta oss</h1>
        <div className="prose max-w-none">
          <p>Kontakta oss för mer information om våra laserutrustningar och tjänster.</p>
          
          <div className="mt-8 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <span>🏢</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">Besöksadress</h3>
                <p>
                  Arch Academy AB<br />
                  Kopparv 28<br />
                  791 41 FALUN<br />
                  SWEDEN
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <span>📞</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">Telefon</h3>
                <p>020-104050</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <span>✉️</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">E-post</h3>
                <p>gholmgren@erchonia-emea.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <span>🌐</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">Information</h3>
                <p>Erchonia official distributor - Nordics</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <span>❓</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">Hjälp</h3>
                <p><a href="https://bit.ly/EENHelpdesk" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://bit.ly/EENHelpdesk</a></p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
