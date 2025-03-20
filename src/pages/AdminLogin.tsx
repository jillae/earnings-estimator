
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AdminLoginForm from '@/components/AdminLoginForm';

const AdminLogin = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till kalkylator
            </Button>
          </Link>
        </div>
        
        <AdminLoginForm />
      </div>
    </div>
  );
};

export default AdminLogin;
