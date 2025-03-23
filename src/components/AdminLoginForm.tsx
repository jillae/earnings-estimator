
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Obs: I en produktionsmiljö skulle detta vara implementerat på ett säkrare sätt,
// med korrekt autentisering mot en backend
const AdminLoginForm = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Detta är bara en enkel demo-lösning
    // I en riktig app skulle detta anrop gå till en backend med säker autentisering
    if (password === 'admin123') {
      // Spara en token eller markör för att visa att användaren är inloggad
      localStorage.setItem('adminLoggedIn', 'true');
      toast.success('Inloggning lyckades!');
      navigate('/admin');
    } else {
      toast.error('Felaktigt lösenord');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin-inloggning</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Lösenord</Label>
          <Input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Ange adminlösenord"
            required
          />
        </div>
        
        <Button type="submit" className="w-full">Logga in</Button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Detta är en demo-applikation.</p>
        <p>Lösenord: admin123</p>
      </div>
    </div>
  );
};

export default AdminLoginForm;
