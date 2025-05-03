
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-12 border-t border-slate-200 animate-fade-in">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Erchonia Nordics. Alla rättigheter förbehållna.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">
              Kontakt
            </a>
            <a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">
              Villkor
            </a>
            <a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">
              Integritetspolicy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
