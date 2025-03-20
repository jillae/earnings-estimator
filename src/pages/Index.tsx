
import React from 'react';
import Header from '@/components/Header';
import Calculator from '@/components/Calculator';
import Footer from '@/components/Footer';
import MachineGalleryContainer from '@/components/MachineGalleryContainer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MachineGalleryContainer />
      <main className="flex-grow py-6">
        <Calculator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
