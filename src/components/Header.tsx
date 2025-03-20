
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="py-4 px-4 border-b flex justify-between items-center">
      <h1 className="text-xl font-bold">Kalkylator för laserutrustning</h1>
      <Link to="/admin-login">
        <Button variant="outline" size="sm">Admin</Button>
      </Link>
    </header>
  );
};

export default Header;
