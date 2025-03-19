import React from 'react';
const Header: React.FC = () => {
  return <header className="py-6 mb-8 border-b border-slate-200 animate-fade-in">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Intäktsberäkning
          </h1>
          <p className="text-slate-500 max-w-2xl text-balance">Beräkna potentiella intäkter och kostnader baserat på din klinikstorlek och maskin från Erchonia Nordic - Sweden</p>
        </div>
      </div>
    </header>;
};
export default Header;