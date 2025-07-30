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
    id: 'hybridpaket', 
    name: 'Hybridpaket',
    shortName: 'Hybrid',
    description: 'Lägsta månadsavgift för maskinen. Credits debiteras separat per behandling.',
    detailedDescription: 'Betala endast för det du använder. Ger dig full flexibilitet med rörlig driftskostnad.',
    sliderPosition: 1,
    icon: '⚖️',
    benefits: [
      'Lägsta månadskostnad',
      'Credits debiteras separat',
      'Full flexibilitet med valfrihet hur credits betalas'
    ],
    bestFor: 'Låg eller varierande behandlingsvolym'
  },
  
  ALLT_INKLUDERAT: {
    id: 'allt-inkluderat',
    name: 'Allt-inkluderat', 
    shortName: 'Allt-ink',
    description: 'Den ultimata lösningen för total kostnadskontroll. Med detta paket betalar du aldrig mer för credits – du köper dig helt fri från all framtida debitering.',
    detailedDescription: 'Alla credits inkluderade i priset. Perfekt för hög volym och förutsägbar budget.',
    sliderPosition: 2,
    icon: '📦',
    benefits: [
      'Noll kostnad per credit, för alltid',
      'Precis som att äga en "rå" maskin', 
      'Maximal enkelhet & förutsägbarhet',
      'Unikt erbjudande på marknaden'
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