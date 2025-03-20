
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Settings, Phone, FileText, HelpCircle } from 'lucide-react';

const Header = () => {
  return (
    <>
      <div className="bg-primary text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center hover:text-primary-foreground/80 transition-colors">
              <Home className="h-4 w-4 mr-1" />
              <span className="text-sm">Hem</span>
            </Link>
            <Link to="/contact" className="flex items-center hover:text-primary-foreground/80 transition-colors">
              <Phone className="h-4 w-4 mr-1" />
              <span className="text-sm">Kontakt</span>
            </Link>
            <Link to="/manual" className="flex items-center hover:text-primary-foreground/80 transition-colors">
              <FileText className="h-4 w-4 mr-1" />
              <span className="text-sm">Manual</span>
            </Link>
            <Link to="/help" className="flex items-center hover:text-primary-foreground/80 transition-colors">
              <HelpCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Hjälp</span>
            </Link>
          </div>
          <div>
            <span className="text-sm font-medium">Laser Calculator Pro</span>
          </div>
        </div>
      </div>
      <header className="py-4 px-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Kalkylator för laserutrustning</h1>
        <Link to="/admin-login">
          <Button variant="outline" size="sm">Admin</Button>
        </Link>
      </header>
    </>
  );
};

export default Header;
