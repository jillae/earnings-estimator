
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { 
  VAT_RATE, 
  WORKING_DAYS_PER_MONTH, 
  MONTHS_PER_YEAR, 
  FLATRATE_THRESHOLD,
  FLATRATE_THRESHOLD_PERCENTAGE,
  SHIPPING_COST_EUR_CREDITS,
  SHIPPING_COST_EUR_NO_CREDITS,
  DEFAULT_EXCHANGE_RATE,
  SMALL_CLINIC_TREATMENTS,
  MEDIUM_CLINIC_TREATMENTS,
  LARGE_CLINIC_TREATMENTS,
  DEFAULT_CUSTOMER_PRICE,
  INSURANCE_RATES,
  LEASING_TARIFFS,
  FLATRATE_AMOUNTS
} from '@/utils/constants';

const Admin = () => {
  const form = useForm({
    defaultValues: {
      // Grundläggande konstanter
      vat_rate: VAT_RATE,
      working_days_per_month: WORKING_DAYS_PER_MONTH,
      months_per_year: MONTHS_PER_YEAR,
      flatrate_threshold: FLATRATE_THRESHOLD,
      flatrate_threshold_percentage: FLATRATE_THRESHOLD_PERCENTAGE,
      default_exchange_rate: DEFAULT_EXCHANGE_RATE,
      
      // Prisrelaterade konstanter
      shipping_cost_eur_credits: SHIPPING_COST_EUR_CREDITS,
      shipping_cost_eur_no_credits: SHIPPING_COST_EUR_NO_CREDITS,
      default_customer_price: DEFAULT_CUSTOMER_PRICE,
      
      // Klinikstorlekar och behandlingar
      small_clinic_treatments: SMALL_CLINIC_TREATMENTS,
      medium_clinic_treatments: MEDIUM_CLINIC_TREATMENTS,
      large_clinic_treatments: LARGE_CLINIC_TREATMENTS,
      
      // Försäkringspriser
      insurance_rate_10k_or_less: INSURANCE_RATES.RATE_10K_OR_LESS,
      insurance_rate_20k_or_less: INSURANCE_RATES.RATE_20K_OR_LESS,
      insurance_rate_50k_or_less: INSURANCE_RATES.RATE_50K_OR_LESS,
      insurance_rate_above_50k: INSURANCE_RATES.RATE_ABOVE_50K,
      
      // Leasing tariff värden
      leasing_tariff_24: LEASING_TARIFFS.find(t => t.Löptid === 24)?.Faktor || 4.566,
      leasing_tariff_36: LEASING_TARIFFS.find(t => t.Löptid === 36)?.Faktor || 3.189,
      leasing_tariff_48: LEASING_TARIFFS.find(t => t.Löptid === 48)?.Faktor || 2.504,
      leasing_tariff_60: LEASING_TARIFFS.find(t => t.Löptid === 60)?.Faktor || 2.095,
      
      // Flatrate-belopp för olika maskintyper
      flatrate_amount_emerald: FLATRATE_AMOUNTS.EMERALD,
      flatrate_amount_zerona: FLATRATE_AMOUNTS.ZERONA,
      flatrate_amount_fx_635: FLATRATE_AMOUNTS.FX_635,
      flatrate_amount_fx_405: FLATRATE_AMOUNTS.FX_405,
    }
  });
  
  const onSubmit = (data: any) => {
    // I en riktig app skulle vi spara värdena till en databas eller localStorage
    // men här visar vi bara ett meddelande
    console.log("Sparade konfigurationsvärden:", data);
    toast.success("Konfigurationen har uppdaterats");
    
    // Här kan du lägga till logik för att spara inställningarna
    // Till exempel genom att använda en API-anrop eller localStorage
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till kalkylator
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold">Administration - Kalkylatorinställningar</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Grundläggande inställningar</h2>
              
              <FormField
                control={form.control}
                name="vat_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Momssats (t.ex. 0.25 för 25%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Momssatsen som används i beräkningar</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="working_days_per_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbetsdagar per månad</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="months_per_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Månader per år</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="default_exchange_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard valutakurs (EUR till SEK)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Standardkursen för omvandling mellan EUR och SEK</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Flatrate & Threshold</h2>
              
              <FormField
                control={form.control}
                name="flatrate_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flatrate tröskel (behandlingar per dag)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormDescription>Antal behandlingar per dag där flatrate aktiveras</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="flatrate_threshold_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flatrate tröskel (procent)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Procent av vägen från min till max där flatrate-tröskeln placeras (t.ex. 0.8 för 80%)</FormDescription>
                  </FormItem>
                )}
              />
              
              <h3 className="text-lg font-medium mt-6 mb-2">Flatrate-belopp för maskintyper</h3>
              
              <FormField
                control={form.control}
                name="flatrate_amount_emerald"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emerald Flatrate (SEK)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="flatrate_amount_zerona"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zerona Flatrate (SEK)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="flatrate_amount_fx_635"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FX 635 Flatrate (SEK)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="flatrate_amount_fx_405"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FX 405 Flatrate (SEK)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Klinik & Fraktinställningar</h2>
              
              <FormField
                control={form.control}
                name="small_clinic_treatments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liten klinik (behandlingar per dag)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="medium_clinic_treatments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mellanstor klinik (behandlingar per dag)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="large_clinic_treatments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stor klinik (behandlingar per dag)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shipping_cost_eur_credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fraktkostnad med krediter (EUR)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shipping_cost_eur_no_credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fraktkostnad utan krediter (EUR)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="default_customer_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard kundpris (SEK)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Försäkringspriser</h2>
              
              <FormField
                control={form.control}
                name="insurance_rate_10k_or_less"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>≤ 10 000 SEK (procent)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Försäkringssats för maskiner ≤ 10 000 SEK (t.ex. 0.04 för 4%)</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="insurance_rate_20k_or_less"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>≤ 20 000 SEK (procent)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Försäkringssats för maskiner ≤ 20 000 SEK (t.ex. 0.03 för 3%)</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="insurance_rate_50k_or_less"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>≤ 50 000 SEK (procent)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Försäkringssats för maskiner ≤ 50 000 SEK (t.ex. 0.025 för 2.5%)</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="insurance_rate_above_50k"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`> 50 000 SEK (procent)`}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Försäkringssats för maskiner {`> 50 000 SEK (t.ex. 0.015 för 1.5%)`}</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Leasing Tariff Värden</h2>
              
              <FormField
                control={form.control}
                name="leasing_tariff_24"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>24 månader (faktor %)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Faktor för 24 månaders period (t.ex. 4.566)</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="leasing_tariff_36"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>36 månader (faktor %)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Faktor för 36 månaders period (t.ex. 3.189)</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="leasing_tariff_48"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>48 månader (faktor %)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Faktor för 48 månaders period (t.ex. 2.504)</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="leasing_tariff_60"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>60 månader (faktor %)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Faktor för 60 månaders period (t.ex. 2.095)</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" size="lg">Spara konfiguration</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Admin;
