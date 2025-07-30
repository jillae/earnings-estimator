import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export const QuoteRequestButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const { 
    selectedMachine,
    clinicSize,
    paymentOption,
    selectedLeasingPeriodId,
    selectedInsuranceId,
    selectedSlaLevel,
    selectedDriftpaket,
    treatmentsPerDay,
    customerPrice,
    leasingCost,
    netResults
  } = useCalculator();
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInfo.name || !userInfo.email) {
      toast({
        title: "Obligatoriska fält saknas",
        description: "Namn och e-post är obligatoriska.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-quote-request', {
        body: {
          userInfo: {
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone || undefined,
            company: userInfo.company || undefined,
          },
          configuration: {
            selectedMachine: selectedMachine?.name || '',
            clinicSize,
            paymentOption,
            leasingPeriod: selectedLeasingPeriodId,
            insurance: selectedInsuranceId,
            slaLevel: selectedSlaLevel,
            driftpaket: selectedDriftpaket,
            treatmentsPerDay,
            customerPrice,
            leasingCost: paymentOption === 'leasing' ? leasingCost : undefined,
            netPerMonth: Math.round(netResults.netPerMonthExVat),
            netPerYear: Math.round(netResults.netPerYearExVat),
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Offertförfrågan skickad",
        description: "Vi kommer att kontakta dig inom kort med en offert.",
      });

      setIsOpen(false);
      setUserInfo({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });

    } catch (error) {
      console.error('Error sending quote request:', error);
      toast({
        title: "Fel vid skickande",
        description: "Kunde inte skicka offertförfrågan. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
          <Mail size={18} />
          Begär offert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Begär offert på denna konfiguration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Namn *</Label>
            <Input
              id="name"
              value={userInfo.name}
              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-post *</Label>
            <Input
              id="email"
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input
              id="phone"
              value={userInfo.phone}
              onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Företag</Label>
            <Input
              id="company"
              value={userInfo.company}
              onChange={(e) => setUserInfo(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Meddelande</Label>
            <Textarea
              id="message"
              value={userInfo.message}
              onChange={(e) => setUserInfo(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Eventuella tillägg eller frågor..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center gap-2"
            >
              <Send size={16} />
              {isSubmitting ? 'Skickar...' : 'Skicka'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};