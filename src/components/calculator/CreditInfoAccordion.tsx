import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CreditInfoAccordion: React.FC = () => {
  return (
    <div className="w-full mb-6">
      <Accordion type="single" collapsible defaultValue="credits-info" className="w-full">
        <AccordionItem value="credits-info" className="border border-slate-200 rounded-lg bg-white/50">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="text-lg font-semibold text-slate-900">Vad är Credits?</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Alla våra golvmaskiner använder ett digitalt kreditsystem, godkänt för medicinskt bruk.
                  Varje <strong>credit motsvarar en behandling</strong> och är själva grunden i din <strong>driftskostnad</strong>. Credits beställs i 25-pack till ditt avtalspris och fylls på direkt i maskinens display med en voucher – ingen internetuppkoppling krävs.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Du väljer själv hur du vill betala för drift:<br />
                  👉 Antingen <strong>styckepris</strong> – betala per behandling<br />
                  👉 Eller <strong>Fastpris</strong> – obegränsat användande till fast kostnad
                </p>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  <strong>Fastpris är mest lönsamt för dig som gör fler än 2 behandlingar per dag.</strong>
                </p>
              </div>
              
              <div>
                <h5 className="font-semibold text-slate-900 mb-3 text-sm">Dina tre största fördelar</h5>
                <div className="grid gap-3">
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5 flex-shrink-0">💰</span>
                    <div>
                      <div className="font-medium text-blue-900 text-sm">Förutsägbara kostnader</div>
                      <div className="text-blue-700 text-xs">Creditsystemet ger dig full koll på vad varje behandling kostar – perfekt för budget och lönsamhet. Välj mellan styckepris eller Fastpris-abonnemang.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5 flex-shrink-0">🔒</span>
                    <div>
                      <div className="font-medium text-green-900 text-sm">Säker och kontrollerad användning</div>
                      <div className="text-green-700 text-xs">Endast behörig personal kan använda maskinen. Du undviker missbruk och har alltid trygg drift.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5 flex-shrink-0">🤝</span>
                    <div>
                      <div className="font-medium text-purple-900 text-sm">Dela och tjäna extra</div>
                      <div className="text-purple-700 text-xs">Hyr ut maskinen per behandling – precis som en frisör hyr ut en stol. Enkelt, lönsamt och spårbart med credits.</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed mb-2">
                  ✅ <strong>Credits = din driftskostnad</strong> – välj det upplägg som bäst passar din verksamhetsvolym och arbetssätt.
                  Vill du behandla obegränsat? Då är vårt <strong>Fastpris-abonnemang det självklara valet</strong> för kliniker med 2+ kunder per dag.
                </p>
              </div>
              
              <div className="pt-2 border-t border-slate-100">
                <a 
                  href="#" 
                  className="text-primary hover:text-primary/80 text-xs font-medium transition-colors duration-200"
                >
                  Läs mer om kreditmodellen här →
                </a>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CreditInfoAccordion;