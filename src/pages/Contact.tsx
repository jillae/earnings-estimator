
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
                <span>📞</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">Telefon</h3>
                <p>+46 123 456 789</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <span>✉️</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">E-post</h3>
                <p>info@lasercalculator.se</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <span>🏢</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">Besöksadress</h3>
                <p>Lasergatan 123<br />123 45 Stockholm</p>
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
