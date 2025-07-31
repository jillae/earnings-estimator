
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, HelpCircle, Info, FileText, Settings, Download } from 'lucide-react';

const Manual = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Manual | Intäktsberäkning</title>
        <meta name="description" content="Utförlig guide och manual för att använda vår Intäktsberäkning för laserkliniker. Lär dig hur du maximerar lönsamheten för din klinik." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
            <h1 className="text-3xl font-bold mb-4 text-primary">Manual för Intäktsberäkning</h1>
            <p className="text-lg text-gray-700 mb-6">
              Välkommen till vår uppdaterade manual för Intäktsberäkningen. Här hittar du allt du behöver veta för att få ut maximalt av verktyget.
            </p>
            
            <Tabs defaultValue="komma-igang" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="komma-igang" className="text-sm">Komma igång</TabsTrigger>
                <TabsTrigger value="funktioner" className="text-sm">Funktioner</TabsTrigger>
                <TabsTrigger value="resultat" className="text-sm">Tolka resultat</TabsTrigger>
                <TabsTrigger value="tips" className="text-sm">Tips & tricks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="komma-igang" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-primary" />
                      Grundläggande steg
                    </CardTitle>
                    <CardDescription>
                      Följ dessa enkla steg för att komma igång med kalkylatorn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal pl-5 space-y-4">
                      <li className="pl-2">
                        <span className="font-medium">Välj laserutrustning</span>
                        <p className="text-gray-600 mt-1">Bläddra i gallerivy eller använd rullgardinsmenyn för att välja den utrustning du vill beräkna för.</p>
                      </li>
                      <li className="pl-2">
                        <span className="font-medium">Ange behandlingar per dag</span>
                        <p className="text-gray-600 mt-1">Justera antalet förväntade behandlingar per dag med hjälp av reglaget eller direkt inmatning.</p>
                      </li>
                      <li className="pl-2">
                        <span className="font-medium">Anpassa kundpriser</span>
                        <p className="text-gray-600 mt-1">För varje behandlingstyp kan du justera priserna för att matcha din marknad.</p>
                      </li>
                      <li className="pl-2">
                        <span className="font-medium">Justera leasingkostnad</span>
                        <p className="text-gray-600 mt-1">Dra i leasingreglaget för att se hur olika leasingnivåer påverkar din lönsamhet.</p>
                      </li>
                      <li className="pl-2">
                        <span className="font-medium">Välj driftpaket</span>
                        <p className="text-gray-600 mt-1">Välj mellan Bas, Silver eller Guld driftpaket beroende på dina behov.</p>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="funktioner" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-primary" />
                      Avancerade funktioner
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="kliniktillganglighet">
                        <AccordionTrigger>Kliniktillgänglighet</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-2">Kalkylatorn låter dig välja klinikstorlek:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Liten:</strong> Mindre kliniker med begränsad kapacitet</li>
                            <li><strong>Mellan:</strong> Medelstora kliniker med god kapacitet</li>
                            <li><strong>Stor:</strong> Större kliniker med hög kapacitet</li>
                          </ul>
                          <p className="mt-2">Din valda klinikstorlek påverkar beräkningarna för maximalt antal behandlingar och kapacitetsutnyttjande.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="flatrate">
                        <AccordionTrigger>Flatrate-modell</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-2">För maskiner som använder credits kan du aktivera flatrate-modellen:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Ger obegränsade credits mot en fast månadskostnad</li>
                            <li>Aktiveras när leasingkostnaden når minst 80% av maxvärdet</li>
                            <li>Kräver minst 3 behandlingar per dag för att vara tillgänglig</li>
                            <li>Ingår automatiskt i både Silver- och Guld-driftpaketet</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="leasing">
                        <AccordionTrigger>Leasingperioder och tariffer</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-2">Välj mellan olika leasingperioder för att optimera din månadskostnad:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>24 månader:</strong> Kortare bindningstid, högre månadskostnad</li>
                            <li><strong>36 månader:</strong> Balanserad period, standard för de flesta kliniker</li>
                            <li><strong>48 månader:</strong> Längre period för lägre månadskostnad</li>
                            <li><strong>60 månader:</strong> Längsta perioden, lägst månadskostnad</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="driftpaket">
                        <AccordionTrigger>Driftpaket och SLA-nivåer</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-2">Välj mellan tre olika driftpaket för din utrustning:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Bas:</strong> Grundläggande support och garanti</li>
                            <li><strong>Silver:</strong> Utökad support med snabbare responstider och flatrate-credits inkluderade</li>
                            <li><strong>Guld:</strong> Premium-support med flatrate-credits inkluderade och prioriterad service</li>
                          </ul>
                          <p className="mt-2">För varje driftpaket kan du välja olika SLA-nivåer som påverkar svarstider och servicenivå.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="forsakring">
                        <AccordionTrigger>Försäkringsalternativ</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-2">Du kan välja att inkludera försäkring i dina beräkningar:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Försäkringspremien baseras på maskinens värde</li>
                            <li>Högre värde ger en lägre procentuell premie</li>
                            <li>Försäkringen täcker oförutsedda skador</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="resultat" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Tolka resultaten
                    </CardTitle>
                    <CardDescription>
                      Så här förstår du de beräknade resultaten
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">Intäktsöversikt</h3>
                        <p className="text-gray-600">I resultatvyn kan du se intäkter per dag, vecka, månad och år baserat på dina inställningar.</p>
                      </div>
                      
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">Kostnadsanalys</h3>
                        <p className="text-gray-600">Se alla kostnader uppdelade i leasingkostnad, driftskostnader och eventuella kreditkostnader.</p>
                      </div>
                      
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">Nettoresultat</h3>
                        <p className="text-gray-600">Det slutliga resultatet visar din förväntade vinst per månad och år efter att alla kostnader dragits av.</p>
                      </div>
                      
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">Beläggningsgrader</h3>
                        <p className="text-gray-600">Se projektioner för olika beläggningsgrader (50%, 75% och 100%) för att planera för olika scenarier.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Flytande resultatsummering</h3>
                        <p className="text-gray-600">Den nya flytande resultatvyn ger dig snabb överblick över de viktigaste siffrorna när du scrollar.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tips" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                      Tips för effektiv användning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-1 mr-2" />
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">Optimera prissättning</h3>
                            <p className="text-sm text-blue-700">Experimentera med olika prismodeller för att hitta den optimala balansen mellan volym och marginal.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-1 mr-2" />
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">Jämför maskiner</h3>
                            <p className="text-sm text-blue-700">Använd kalkylatorn för att jämföra olika maskiner och hitta den som bäst passar din verksamhet.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-1 mr-2" />
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">Flatrate vs. Pay-per-credit</h3>
                            <p className="text-sm text-blue-700">Analysera om flatrate-modellen är lönsam baserat på din behandlingsvolym.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-1 mr-2" />
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">Driftpaketval</h3>
                            <p className="text-sm text-blue-700">Överväg Silver eller Guld-paketet om du har hög behandlingsvolym då flatrate ingår i båda.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-1 mr-2" />
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">Leasingperioder</h3>
                            <p className="text-sm text-blue-700">Jämför olika leasingperioder för att hitta den bästa balansen mellan månadsbetalning och bindningstid.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-1 mr-2" />
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">Scenarioplanering</h3>
                            <p className="text-sm text-blue-700">Använd de olika beläggningsgraderna för att planera för bästa, troliga och sämsta scenario.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Download className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Ladda ner resultatet</h3>
                      </div>
                      <p className="text-gray-600 mb-3">Du kan spara dina beräkningar genom att använda utskriftsfunktionen i din webbläsare (Ctrl+P eller Cmd+P).</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Manual;
