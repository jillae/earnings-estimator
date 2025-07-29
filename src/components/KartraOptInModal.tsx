import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface KartraOptInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string, email: string) => void;
}

export const KartraOptInModal: React.FC<KartraOptInModalProps> = ({
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
      setError('Vänligen fyll i både namn och e-post');
      return;
    }
    
    if (!gdprConsent) {
      setError('Du måste godkänna behandling av personuppgifter');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Integrera med Kartra API här
      // För nu simulerar vi en lyckad registrering
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess(name, email);
      
      // Rensa formuläret
      setName('');
      setEmail('');
      setGdprConsent(false);
      
    } catch (err) {
      setError('Något gick fel. Vänligen försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-xl font-semibold">
            Lås upp kalkylatorn
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            För att använda kalkylatorn fullt ut behöver vi dina kontaktuppgifter. 
            Du får värdefulla insikter om din potentiella lönsamhet!
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Namn *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ditt fullständiga namn"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-post *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.se"
                required
              />
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="gdpr"
                checked={gdprConsent}
                onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
              />
              <Label htmlFor="gdpr" className="text-sm leading-tight">
                Jag godkänner att mina personuppgifter behandlas enligt{' '}
                <a href="/privacy" className="text-primary underline" target="_blank">
                  integritetspolicyn
                </a>
                . Du kan när som helst avregistrera dig. *
              </Label>
            </div>
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrerar...' : 'Lås upp kalkylatorn'}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center">
            Genom att registrera dig får du tillgång till alla beräkningar och kan 
            spara dina preferenser för framtida besök.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};