import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string, email: string) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError('Vänligen fyll i alla fält');
      return;
    }

    if (!gdprConsent) {
      setError('Du måste godkänna behandling av personuppgifter');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulera kort delay för användarupplevelse
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSuccess(name, email);
      
      // Rensa formuläret
      setName('');
      setEmail('');
      setGdprConsent(false);
    } catch (error) {
      setError('Ett fel uppstod. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Registrera dig för att fortsätta
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-auto p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Namn</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ditt namn"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-postadress</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.se"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox
              id="gdpr"
              checked={gdprConsent}
              onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
              disabled={isSubmitting}
            />
            <Label htmlFor="gdpr" className="text-sm leading-4">
              Jag godkänner att mina personuppgifter behandlas enligt GDPR för att 
              få tillgång till kalkylatorn och relevanta uppdateringar.
            </Label>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !name.trim() || !email.trim() || !gdprConsent}
          >
            {isSubmitting ? 'Registrerar...' : 'Registrera och fortsätt'}
          </Button>
        </form>
        
        <div className="text-xs text-gray-500 text-center">
          Genom att registrera dig får du tillgång till alla funktioner i kalkylatorn
          och kan spara dina beräkningar.
        </div>
      </DialogContent>
    </Dialog>
  );
};