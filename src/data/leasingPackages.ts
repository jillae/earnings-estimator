/**
 * KUNDVÄNLIGA PAKETNAMN OCH BESKRIVNINGAR
 * 
 * Dessa paket låses vid köp och kan inte ändras under avtalstiden.
 */

export const LEASING_PACKAGES = {
  GRUNDLEASING: {
    id: 'grundleasing',
    name: 'Grundleasing',
    shortName: 'Grund',
    description: 'Lägsta månadsavgift för maskinen. Credits debiteras separat per behandling.',
    detailedDescription: 'Betala endast för det du använder. Ger dig full flexibilitet med rörlig driftskostnad.',
    sliderPosition: 0,
    icon: '💡',
    benefits: [
      'Lägsta månadskostnad',
      'Betala endast för använda credits',
      'Flexibel kostnad baserat på användning'
    ],
    bestFor: 'Låg eller varierande behandlingsvolym'
  },
  
  HYBRIDPAKET: {
    id: 'hybridmodell', 
    name: 'Hybridmodell',
    shortName: 'Hybrid',
    description: 'En flexibel investering som låter dig växa med din klinik. Du betalar en låg grundleasing för maskinen och anpassar enkelt din driftskostnad utifrån behov och volym.',
    detailedDescription: 'En smart investering som växer med din verksamhet. Full kontroll över driftskostnader med möjlighet att anpassa efter behov.',
    sliderPosition: 1,
    icon: '⚖️',
    benefits: [
      'Låg månadsavgift för maskinen',
      'Växla smidigt mellan styckpris och Flatrate när du vill',
      'Full kontroll över dina driftskostnader',
      'Investera smart: Betala endast för de credits du använder eller välj fastpris'
    ],
    bestFor: 'Låg eller varierande behandlingsvolym, och kliniker som vill anpassa sin investering över tid'
  },
  
  ALLT_INKLUDERAT: {
    id: 'strategimodell',
    name: 'Strategimodell', 
    shortName: 'Strategi',
    description: 'Den ultimata lösningen för total kostnadskontroll. Med denna modell betalar du **aldrig mer för credits** – du köper dig helt fri från all framtida debitering, oavsett användning.',
    detailedDescription: 'Alla credits inkluderade i priset. Perfekt för hög volym och förutsägbar budget.',
    sliderPosition: 2,
    icon: '🎯',
    benefits: [
      'Noll kostnad per credit, för alltid',
      'Fullständig frihet från credit-hantering',
      'Maximal enkelhet & förutsägbarhet',
      'Din modell innehåller ett exceptionellt värde som säkrar din framtida lönsamhet.',
      'Unikt erbjudande på marknaden (då vi fortfarande har egen kostnad för credits)'
    ],
    bestFor: 'Hög volym och total kostnadsfrihet'
  }
} as const;

export type LeasingPackageId = keyof typeof LEASING_PACKAGES;

/**
 * Hämta paketinformation baserat på slider-position
 */
export function getPackageBySliderPosition(position: number) {
  const packages = Object.values(LEASING_PACKAGES);
  return packages.find(pkg => pkg.sliderPosition === position) || LEASING_PACKAGES.GRUNDLEASING;
}

/**
 * Hämta paketinformation baserat på ID
 */
export function getPackageById(id: string) {
  return Object.values(LEASING_PACKAGES).find(pkg => pkg.id === id) || LEASING_PACKAGES.GRUNDLEASING;
}

/**
 * Kontrollera om ett paket inkluderar credits
 */
export function packageIncludesCredits(packageId: LeasingPackageId): boolean {
  return packageId === 'ALLT_INKLUDERAT';
}

/**
 * Kontrollera om ett paket är hybrid (delvis credits inkluderade)
 */
export function packageIsHybrid(packageId: LeasingPackageId): boolean {
  return packageId === 'HYBRIDPAKET';
}

/**
 * Varningstext för att valet låses vid köp
 */
export const PACKAGE_LOCK_WARNING = {
  title: 'Viktigt att veta',
  message: 'Den valda leasingmodellen låses vid köp och kan inte ändras under avtalstiden.',
  icon: '⚠️'
};