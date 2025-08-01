
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface WhitePaper {
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'external';
}

const whitePapers: WhitePaper[] = [{
  title: "Erchonia Product Book Pain",
  description: "Komplett produktbok om laserbehandling av smärta.",
  url: "https://d11n7da8rpqbjy.cloudfront.net/erchoniaemea/1113018725768__Erchonia_Product_Book_Pain_2ex_GH.pdf",
  type: "pdf"
}, {
  title: "Fördelarna med Leasing",
  description: "Hur leasing fungerar och dess fördelar för din klinik.",
  url: "/public/Whitepaper_FÖRDELARNA MED LEASING.pdf",
  type: "pdf"
}, {
  title: "Kreditmodellen för Golvmaskiner",
  description: "Detaljer om kreditmodeller och betalningsalternativ.",
  url: "/lovable-uploads/Whitepaper_Kreditmodellen%20f%C3%B6r%20Golvmaskiner.pdf",
  type: "pdf"
}, {
  title: "Erchonia Nordics",
  description: "Information om Erchonia produkter för nordiska marknaden.",
  url: "/public/Whitepaper_Erchonia Nordics.pdf",
  type: "pdf"
}, {
  title: "Choosing the Right Laser",
  description: "Guide för att välja rätt laserbehandling - maj 2024.",
  url: "/public/Choosing the Right Laser A4 - May 2024.pdf",
  type: "pdf"
}, {
  title: "Erchonia Pricing Brochure",
  description: "Prislista och information om Erchonia produkter (Euro).",
  url: "/public/Erchonia Pricing Brochure (Euros).pdf",
  type: "pdf"
}, {
  title: "Utbildning",
  description: "Information om certifiering och utbildning vid köp.",
  url: "/public/Whitepaper_UTBILDNING.pdf",
  type: "pdf"
}, {
  title: "ArchAcademy",
  description: "Utbildningsportalen för Erchonia produkter.",
  url: "https://archacademy.se",
  type: "external"
}, {
  title: "Erchonia EMEA",
  description: "Officiell hemsida för Erchonia i Europa.",
  url: "https://www.erchonia-emea.com",
  type: "external"
}];

const WhitePaperLibrary: React.FC = () => {
  return (
    <section id="whitepapers" className="container max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-8 animate-fade-in">
      <div className="glass-card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Resurser och Whitepapers</h2>
          <p className="text-slate-600 mt-2">Ladda ner eller besök dessa resurser för att lära dig mer om våra produkter och tjänster</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whitePapers.map((paper, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  {paper.title}
                </CardTitle>
                <CardDescription>{paper.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="default" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700" 
                  onClick={() => window.open(paper.url, '_blank')}
                >
                  {paper.type === 'pdf' ? (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Ladda ner PDF
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Besök webbplats
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-600">Erchonia är världsledande med icke-termisk medicinsklaser och driver idag forskningen bakom tekniken. Kontakta oss för mer information om våra produkter och tjänster.</p>
        </div>
      </div>
    </section>
  );
};

export default WhitePaperLibrary;
