import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, CheckCircle, Mail, User, Building, MessageSquare, Star, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const ComingSoonPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-interest-notification', {
        body: {
          type: 'interest_signup',
          userInfo: formData,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "Tack för ditt intresse!",
        description: "Vi har mottagit din anmälan och kommer att kontakta dig snart.",
      });
    } catch (error) {
      console.error('Error sending interest notification:', error);
      toast({
        title: "Något gick fel",
        description: "Försök igen senare eller kontakta oss direkt.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-lg mx-auto text-center border-green-200 shadow-lg">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-700 mb-2">Tack för ditt intresse!</h1>
            <p className="text-slate-600">
              Vi har mottagit din anmälan och kommer att kontakta dig så snart KlinikOptimering är redo för lansering.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        {/* Huvudkort */}
        <Card className="text-center mb-8 border-primary/20 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="h-8 w-8 text-amber-500" />
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Star className="h-3 w-3 mr-1" />
                Exklusiv förhandsversion
              </Badge>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-slate-900">KlinikOptimering</h1>
            </div>
            
            <CardDescription className="text-xl text-slate-600 max-w-2xl mx-auto">
              Revolutionerande AI-driven klinikoptimering som maximerar din potential
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Kommande funktioner */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200">
                <Brain className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-700 mb-2">AI-Assistent</h3>
                <p className="text-sm text-blue-600">24/7 affärsrådgivning baserat på din kliniks data</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <Building className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-700 mb-2">Kapacitetsoptimering</h3>
                <p className="text-sm text-green-600">+30% högre utnyttjande av dina resurser</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
                <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-purple-700 mb-2">Smart analys</h3>
                <p className="text-sm text-purple-600">+25% ökad omsättning genom datadriven insights</p>
              </div>
            </div>

            {/* Intresseformulär */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Anmäl ditt intresse</h2>
              <p className="text-slate-600 mb-6">
                Få exklusiv tidig tillgång och specialerbjudande när vi lanserar
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-left">
                    <User className="h-4 w-4 inline mr-2" />
                    Namn *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ditt namn"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-left">
                    <Mail className="h-4 w-4 inline mr-2" />
                    E-post *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="din@klinik.se"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-left">
                    <Building className="h-4 w-4 inline mr-2" />
                    Klinik/Företag
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Klinikens namn"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-left">
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    Meddelande (valfritt)
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Berätta om dina behov eller frågor..."
                    className="w-full min-h-[100px]"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Skickar...' : 'Anmäl intresse'}
                </Button>
              </form>
            </div>

            <div className="text-sm text-slate-500">
              <p>🚀 Lansering planerad: Q2 2025</p>
              <p>💡 Gratis testperiod för de första 100 klinikerna</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};