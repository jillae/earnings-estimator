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
  title: "Information före beställning",
  description: "Viktig information om maskiner, priser och utbildning.",
  url: "https://example.com/information-fore-bestallning.pdf",
  type: "pdf"
}, {
  title: "Kreditmodellen för Golvmaskiner",
  description: "Detaljer om kreditmodeller och betalningsalternativ.",
  url: "https://example.com/kreditmodellen.pdf",
  type: "pdf"
}, {
  title: "Fördelarna med Leasing",
  description: "Hur leasing fungerar och dess fördelar för din klinik.",
  url: "https://example.com/fordelarna-med-leasing.pdf",
  type: "pdf"
}, {
  title: "Heltäckande Utbildning",
  description: "Information om certifiering och utbildning vid köp.",
  url: "https://example.com/heltackande-utbildning.pdf",
  type: "pdf"
}, {
  title: "Villkor för Fastpris",
  description: "Villkor och fördelar med fastprisprisplaner.",
  url: "https://example.com/villkor-fastpris.pdf",
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
  return <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-8 animate-fade-in">
      <div className="glass-card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Resurser och Whitepapers</h2>
          <p className="text-slate-600 mt-2">Ladda ner eller besök dessa resurser för att lära dig mer om våra produkter och tjänster</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whitePapers.map((paper, index) => <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  {paper.title}
                </CardTitle>
                <CardDescription>{paper.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => window.open(paper.url, '_blank')}>
                  {paper.type === 'pdf' ? <>
                      <Download className="h-4 w-4 mr-2" />
                      Ladda ner PDF
                    </> : <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Besök webbplats
                    </>}
                </Button>
              </CardContent>
            </Card>)}
        </div>
        
        <div className="mt-10 text-center">
          <div className="inline-block">
            <img src="/lovable-uploads/cd40681e-4fda-4789-b9a9-196b4ab2ded2.png" alt="Erchonia Logo" className="h-16 mx-auto mb-4" />
          </div>
          <p className="text-sm text-slate-600 mt-4">Erchonia är världsledande med icke-termisk medicinsklaser och driver idag forskningen bakom tekniken. Kontakta oss för mer information om våra produkter och tjänster.</p>
        </div>
      </div>
    </div>;
};
export default WhitePaperLibrary;