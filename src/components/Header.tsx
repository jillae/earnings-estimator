
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Settings, Phone, FileText, HelpCircle, ExternalLink, Library, BarChart3 } from 'lucide-react';

const Header = () => {
  const scrollToWhitepapers = (e: React.MouseEvent) => {
    e.preventDefault();
    // Kontrollera om vi är på startsidan
    if (window.location.pathname === '/') {
      const element = document.getElementById('whitepapers');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Använd React Router för navigering istället för window.location
      const navigate = () => {
        setTimeout(() => {
          window.location.href = '/#whitepapers';
        }, 100);
      };
      navigate();
    }
  };

  return (
    <>
      <div className="bg-primary text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {/* Huvudnavigation */}
            <div className="flex items-center space-x-4 border-r border-white/20 pr-6">
              <Link to="/" className="flex items-center hover:text-primary-foreground/80 transition-colors cursor-pointer">
                <Home className="h-4 w-4 mr-1" />
                <span className="text-sm">Kalkylator</span>
              </Link>
              <Link to="/dashboard" className="flex items-center hover:text-primary-foreground/80 transition-colors cursor-pointer">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="text-sm">Dashboard</span>
              </Link>
            </div>

            {/* Analysverktyg - nu integrerade i kalkylatorn via modaler, men kan behållas för direktaccess */}
            
            {/* Produkter & Information */}
            <div className="flex items-center space-x-4 border-r border-white/20 pr-6">
              <a 
                href="https://bit.ly/erchoniaeenallmodels" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center hover:text-primary-foreground/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="text-sm">Produkter</span>
              </a>
              <a 
                href="#whitepapers" 
                onClick={scrollToWhitepapers}
                className="flex items-center hover:text-primary-foreground/80 transition-colors"
              >
                <Library className="h-4 w-4 mr-1" />
                <span className="text-sm">Whitepapers</span>
              </a>
            </div>

            {/* Support & Service */}
            <div className="flex items-center space-x-4">
              <Link to="/manual" className="flex items-center hover:text-primary-foreground/80 transition-colors cursor-pointer">
                <FileText className="h-4 w-4 mr-1" />
                <span className="text-sm">Manual</span>
              </Link>
              <Link to="/contact" className="flex items-center hover:text-primary-foreground/80 transition-colors cursor-pointer">
                <Phone className="h-4 w-4 mr-1" />
                <span className="text-sm">Kontakt</span>
              </Link>
              <a 
                href="https://bit.ly/EENHelpdesk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center"
              >
                <div className="flex items-center space-x-1">
                  <div className="bg-green-500 rounded-full p-1.5 mr-1 text-white">
                    <HelpCircle className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm group-hover:text-primary-foreground/80 transition-colors">Hjälp</span>
                </div>
              </a>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to="/admin-login">
              <Button variant="ghost" size="sm" className="text-white hover:text-primary-foreground/80 hover:bg-primary-foreground/10">
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <header className="py-6 px-4 border-b flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Intäktsberäkning</h1>
          <p className="text-sm text-muted-foreground">Beräkna potentiella intäkter och kostnader baserat på din klinikstorlek och maskin från Erchonia Nordic - Sweden</p>
        </div>
      </header>
    </>
  );
};

export default Header;
