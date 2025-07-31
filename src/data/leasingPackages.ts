/**
 * KUNDVÄNLIGA PAKETNAMN OCH BESKRIVNINGAR
 * 
 * Dessa paket låses vid köp och kan inte ändras under avtalstiden.
 */

export const LEASING_PACKAGES = {
  GRUNDLEASING: {
    id: 'grundleasing',
    primaryTitle: 'Grundleasing',
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
    primaryTitle: 'Hybridmodell',
    name: 'Flexibilitet att växa med din klinik',
    shortName: 'Hybrid',
    description: 'Betala låg grundleasing för maskinen, och styr driften separat.',
    detailedDescription: 'Lägre månadsavgift, full valfrihet mellan styckepris och flatrate, enkel att skala upp eller ned.',
    sliderPosition: 1,
    icon: '⚖️',
    benefits: [
      'Lägre månadsavgift',
      'Full valfrihet mellan styckepris och flatrate',
      'Växla smidigt mellan avtalsmodellerna styckpris och Flatrate när du vill. Notera att Flatrate-abonnemanget har en löpande uppsägningstid på tre månader.',
      'Enkel att skala upp eller ned'
    ],
    bestFor: 'dig som vill hålla låg fast kostnad – och ha total kontroll över användningen'
  },
  
  ALLT_INKLUDERAT: {
    id: 'strategimodell',
    primaryTitle: 'Strategimodell',
    name: 'Säkra framtiden – köp dig fri från administration och prishöjningar', 
    shortName: 'Strategi',
    description: 'Du betalar en fast summa och slipper framtida driftkostnader helt. Ingen mer hantering av credits, avtal eller beställningar – oavsett användning.',
    detailedDescription: 'Alltid noll kronor per behandling, inga fler påfyllningar eller fakturor – all drift ingår, ingen administrativ belastning – och skydd mot framtida prisjusteringar.',
    sliderPosition: 2,
    icon: '🎯',
    benefits: [
      'Alltid noll kronor per behandling',
      'Detta ger dig frihet att maximera maskinens användning! Erbjud fler behandlingspaket per kund, håll öppna hus, demos och events – även personalen kan behandla sig utan extra kostnad.',
      'Inga fler påfyllningar eller fakturor – all drift ingår',
      'Ingen administrativ belastning – och skydd mot framtida prishöjningar'
    ],
    bestFor: 'kliniker med hög och stabil behandlingsvolym som vill ha full kostnadskontroll över tid'
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