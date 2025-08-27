
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
  url: "https://ejwbhvzmkmuimfqlishm.supabase.co/storage/v1/object/sign/Files%20EEN%20Calc/Whitepaper_LEASING.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82YTBkMWJmNC1hZGI5LTQwNTctODI5ZS1lZDg2ZDgyM2IyZTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJGaWxlcyBFRU4gQ2FsYy9XaGl0ZXBhcGVyX0xFQVNJTkcucGRmIiwiaWF0IjoxNzU2MzAxMTE0LCJleHAiOjE4NDI2MTQ3MTR9.WiFxJGAbJ2fKfhegmEK5Ft7EPkZB3kmDnAeGqWD0Do8",
  type: "pdf"
}, {
  title: "Kreditmodellen för Golvmaskiner",
  description: "Detaljer om kreditmodeller och betalningsalternativ.",
  url: "https://ejwbhvzmkmuimfqlishm.supabase.co/storage/v1/object/sign/Files%20EEN%20Calc/Whitepaper_credid%20model.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82YTBkMWJmNC1hZGI5LTQwNTctODI5ZS1lZDg2ZDgyM2IyZTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJGaWxlcyBFRU4gQ2FsYy9XaGl0ZXBhcGVyX2NyZWRpZCBtb2RlbC5wZGYiLCJpYXQiOjE3NTYzMDEwODUsImV4cCI6MjYyMDIxNDY4NX0.7oPfNKCskYAVRBKA4h0eRtHrIMaBfj8HoJB-0vUfGPc",
  type: "pdf"
}, {
  title: "Erchonia Nordics",
  description: "Information om Erchonia produkter för nordiska marknaden.",
  url: "https://ejwbhvzmkmuimfqlishm.supabase.co/storage/v1/object/sign/Files%20EEN%20Calc/Whitepaper_Erchonia%20Nordics.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82YTBkMWJmNC1hZGI5LTQwNTctODI5ZS1lZDg2ZDgyM2IyZTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJGaWxlcyBFRU4gQ2FsYy9XaGl0ZXBhcGVyX0VyY2hvbmlhIE5vcmRpY3MucGRmIiwiaWF0IjoxNzU2MzAxMTA2LCJleHAiOjI2MjAyMTQ3MDZ9.vi5jpo0UbSgX6NeeKd1tseJGkIC86aCQTWmr414VbU0",
  type: "pdf"
}, {
  title: "Choosing the Right Laser",
  description: "Guide för att välja rätt laserbehandling - maj 2024.",
  url: "https://ejwbhvzmkmuimfqlishm.supabase.co/storage/v1/object/sign/Files%20EEN%20Calc/Choosing%20the%20Right%20Laser%20A4%20-%20May%202024.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82YTBkMWJmNC1hZGI5LTQwNTctODI5ZS1lZDg2ZDgyM2IyZTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJGaWxlcyBFRU4gQ2FsYy9DaG9vc2luZyB0aGUgUmlnaHQgTGFzZXIgQTQgLSBNYXkgMjAyNC5wZGYiLCJpYXQiOjE3NTYzMDExNDYsImV4cCI6MTg0MjYxNDc0Nn0.YP4Ls6DdcnSTaeFQX5ddszlByoi_9MmXUwMIBcizlHU",
  type: "pdf"
}, {
  title: "Erchonia Pricing Brochure",
  description: "Prislista och information om Erchonia produkter (Euro).",
  url: "/public/Erchonia Pricing Brochure (Euros).pdf",
  type: "pdf"
}, {
  title: "Utbildning",
  description: "Information om certifiering och utbildning vid köp.",
  url: "https://ejwbhvzmkmuimfqlishm.supabase.co/storage/v1/object/sign/Files%20EEN%20Calc/Whitepaper_UTBILDNING.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82YTBkMWJmNC1hZGI5LTQwNTctODI5ZS1lZDg2ZDgyM2IyZTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJGaWxlcyBFRU4gQ2FsYy9XaGl0ZXBhcGVyX1VUQklMRE5JTkcucGRmIiwiaWF0IjoxNzU2MzAxMTI1LCJleHAiOjI2MjAyMTQ3MjV9.ypG8PShxYUyx0ImP0cGe-dGjUzD78dZ2sjz5LIhoSIo",
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
