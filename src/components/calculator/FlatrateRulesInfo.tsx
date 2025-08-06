import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle, XCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { useCalculator } from "@/context/CalculatorContext";
import { calculateFlatrateEconomics, getFlatrateRecommendationText } from "@/utils/credits/flatrateEconomics";

export function FlatrateRulesInfo() {
  const { 
    selectedMachine, 
    paymentOption, 
    currentSliderStep, 
    selectedDriftpaket,
    isFlatrateViable,
    isLeasingFlatrateViable,
    treatmentsPerDay,
    creditPrice,
    selectedSlaLevel
  } = useCalculator();

  // Visa bara för credit-maskiner
  if (!selectedMachine?.usesCredits) {
    return null;
  }

  const isLeasing = paymentOption === 'leasing';
  const isCash = paymentOption === 'cash';
  const sliderAboveStandard = currentSliderStep >= 1;

  // KRITISK EKONOMISK ANALYS
  const flatrateEconomics = selectedMachine ? calculateFlatrateEconomics(
    treatmentsPerDay,
    selectedMachine,
    creditPrice || 0,
    selectedSlaLevel
  ) : null;
  
  const recommendation = flatrateEconomics ? getFlatrateRecommendationText(flatrateEconomics) : null;

  return (
    <div className="space-y-3">
      {/* Huvudregel för betalningsform */}
      <Alert className={isCash ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Flatrate-regler för {isCash ? 'Kontantköp' : 'Leasing'}:</strong>
          <div className="mt-2 space-y-1">
            {isCash ? (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Flatrate alltid tillgängligt vid kontantköp</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className={`flex items-center gap-2 ${sliderAboveStandard ? 'text-green-700' : 'text-orange-600'}`}>
                  {sliderAboveStandard ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  <span>
                    Flatrate kräver leasingmodell "Standard" eller högre (slider ≥ 50%)
                  </span>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  Nuvarande position: {currentSliderStep === 0 ? 'Billig' : 
                                     currentSliderStep === 1 ? 'Låg' :
                                     currentSliderStep === 2 ? 'Standard' :
                                     currentSliderStep === 3 ? 'Hög' : 'Premium'}
                  {!sliderAboveStandard && ' - för låg för flatrate'}
                </div>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Driftpaket-specifika regler */}
      <Alert className="border-slate-200 bg-slate-50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Driftpaket-regler:</strong>
          <div className="mt-2 space-y-1">
            {selectedDriftpaket === 'Bas' && (
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span>Bas: Flatrate kan väljas manuellt om villkoren uppfylls</span>
              </div>
            )}
            {(selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') && (
              <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span><strong>{selectedDriftpaket}-paket:</strong> Flatrate ingår automatiskt och aktiveras när villkoren uppfylls (≥Standard leasing)</span>
              </div>
                {isLeasing && !sliderAboveStandard && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <XCircle className="h-4 w-4" />
                    <span>För låg leasingnivå - styckpris tillkommer</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* KRITISK EKONOMISK STATUS MED GRÄNSVÄRDE */}
      {flatrateEconomics && recommendation && (
        <Alert className={
          recommendation.type === 'positive' ? "border-green-200 bg-green-50" : 
          recommendation.type === 'negative' ? "border-orange-200 bg-orange-50" : 
          "border-blue-200 bg-blue-50"
        }>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            <strong>Ekonomisk analys (gränsvärde: 2+ behandlingar/dag):</strong>
            <div className="mt-2 space-y-2">
              <div className={`flex items-center gap-2 ${
                recommendation.type === 'positive' ? 'text-green-700' : 
                recommendation.type === 'negative' ? 'text-orange-600' : 
                'text-blue-600'
              }`}>
                {recommendation.type === 'positive' ? <CheckCircle className="h-4 w-4" /> : 
                 recommendation.type === 'negative' ? <AlertTriangle className="h-4 w-4" /> : 
                 <Info className="h-4 w-4" />}
                <span className="font-medium">{recommendation.title}</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                {recommendation.description}
              </div>
              <div className="text-xs text-muted-foreground ml-6">
                Brytpunkt: {flatrateEconomics.breakEvenPoint.toFixed(1)} behandlingar/dag | 
                Nuvarande volym: {treatmentsPerDay} behandlingar/dag
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Aktuell status */}
      <Alert className={isFlatrateViable ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
        <AlertDescription>
          <strong>Aktuell status:</strong>
          <div className="mt-2">
            {isFlatrateViable ? (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Flatrate är tillgängligt med nuvarande inställningar</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-600">
                <XCircle className="h-4 w-4" />
                <span>Flatrate ej tillgängligt - {isLeasing ? 'höj leasingnivån' : 'kontrollera inställningar'}</span>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}