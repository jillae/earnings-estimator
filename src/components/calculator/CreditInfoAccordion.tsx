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
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="credits-info" className="border-2 border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md hover:shadow-lg transition-all duration-300">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-100/50 transition-colors duration-200 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-lg">💳</span>
              </div>
              <span className="text-xl font-bold text-blue-900">Vad är Credits?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 bg-white rounded-b-xl">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 mb-5">
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  Alla våra golvmaskiner använder ett digitalt kreditsystem, godkänt för medicinskt bruk.
                  Varje <strong className="text-blue-800">credit motsvarar en behandling</strong> och är själva grunden i din <strong className="text-blue-800">driftskostnad</strong>. Credits beställs i 25-pack till ditt avtalspris och fylls på direkt i maskinens display med en voucher – ingen internetuppkoppling krävs.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Du väljer själv hur du vill betala för drift:<br />
                    <span className="inline-flex items-center gap-2 mt-2 mb-1"><span className="text-emerald-600">👉</span> Antingen <strong className="text-emerald-700">styckepris</strong> – betala per behandling</span><br />
                    <span className="inline-flex items-center gap-2"><span className="text-blue-600">👉</span> Eller <strong className="text-blue-700">Fastpris</strong> – obegränsat användande till fast kostnad</span>
                  </p>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-sm text-emerald-800 leading-relaxed font-semibold">
                    <span className="text-emerald-600 text-lg mr-2">⭐</span>
                    <strong>Fastpris är mest lönsamt för dig som gör fler än 2 behandlingar per dag.</strong>
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h5 className="font-bold text-slate-900 mb-4 text-base flex items-center gap-2">
                  <span className="text-blue-500">✨</span>
                  Dina tre största fördelar
                </h5>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white text-lg">💰</span>
                    </div>
                    <div>
                      <div className="font-semibold text-emerald-900 text-sm mb-2">Förutsägbara kostnader</div>
                      <div className="text-emerald-700 text-xs leading-relaxed">Creditsystemet ger dig full koll på vad varje behandling kostar – perfekt för budget och lönsamhet. Välj mellan styckepris eller Fastpris-abonnemang.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white text-lg">🔒</span>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-900 text-sm mb-2">Säker och kontrollerad användning</div>
                      <div className="text-blue-700 text-xs leading-relaxed">Endast behörig personal kan använda maskinen. Du undviker missbruk och har alltid trygg drift.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white text-lg">🤝</span>
                    </div>
                    <div>
                      <div className="font-semibold text-purple-900 text-sm mb-2">Dela och tjäna extra</div>
                      <div className="text-purple-700 text-xs leading-relaxed">Hyr ut maskinen per behandling – precis som en frisör hyr ut en stol. Enkelt, lönsamt och spårbart med credits.</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-blue-200">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-5 border border-blue-300">
                  <p className="text-sm text-blue-800 leading-relaxed font-medium flex items-start gap-3">
                    <span className="text-blue-600 text-lg flex-shrink-0 mt-0.5">✅</span>
                    <span>
                      <strong className="text-blue-900">Credits = din driftskostnad</strong> – välj det upplägg som bäst passar din verksamhetsvolym och arbetssätt.
                      Vill du behandla obegränsat? Då är vårt <strong className="text-blue-900">Fastpris-abonnemang det självklara valet</strong> för kliniker med 2+ kunder per dag.
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-blue-200">
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-300"
                >
                  <span>📖</span>
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