
// Fil: src/data/infoTexts.ts (v19 - Ovillkorlig Flatrate vid Kontant)
export interface InfoText { 
  title: string; 
  body: string; 
  link?: { text: string; href: string }; 
}

export type InfoTextKey =
  | 'DEFAULT' 
  | 'CREDITS_MACHINE_SELECTED' 
  | 'NON_CREDITS_MACHINE_SELECTED'
  | 'BAS_PACKAGE_CREDITS_LEASING' 
  | 'BAS_PACKAGE_CREDITS_CASH' // Skillnad här
  | 'SILVER_PACKAGE_LEASING_FLATRATE_ACTIVE' 
  | 'SILVER_PACKAGE_LEASING_FLATRATE_INACTIVE'
  | 'SILVER_PACKAGE_CASH' // Ny för kontant
  | 'GULD_PACKAGE_LEASING_FLATRATE_ACTIVE' 
  | 'GULD_PACKAGE_LEASING_FLATRATE_INACTIVE'
  | 'GULD_PACKAGE_CASH'   // Ny för kontant
  | 'FLATRATE_NEEDS_HIGHER_LEASE'; // Bara för Leasing

export const infoTexts: Record<InfoTextKey, InfoText | null> = {
  DEFAULT: null,
  CREDITS_MACHINE_SELECTED: { 
    title: "Info: Credits & Driftmodell", 
    body: "Denna maskin använder credits. Välj Driftmodell för service, garanti och anpassad användningskostnad.", 
    link: { text: "Jämför Driftmodellerna", href: "/link-to-sla-details" } 
  },
  NON_CREDITS_MACHINE_SELECTED: { 
    title: "Info: Service & Driftmodell", 
    body: "Denna maskin har inga kreditkostnader. Välj Driftmodell för service & garanti.", 
    link: { text: "Jämför Driftmodellerna", href: "/link-to-sla-details" } 
  },
  BAS_PACKAGE_CREDITS_LEASING: { 
    title: "Info: Modell Bas (Leasing)", 
    body: "Styckepris per credit gäller (påverkas av vald leasingmodell via slidern). Credits beställs i 25-pack. Flatrate (obegr. användning, 3 mån uppsägning) kan väljas via reglaget om du valt leasingmodell Standard eller högre.", 
    link: { text: "Läs mer om Credits", href: "/link-to-credits-info" } 
  },
  BAS_PACKAGE_CREDITS_CASH: { 
    title: "Info: Modell Bas (Kontant)", 
    body: "Fast styckepris per credit (creditMin) gäller. Credits beställs i 25-pack. Flatrate (obegr. användning, 3 mån uppsägning) kan väljas fritt via reglaget nedan.", 
    link: { text: "Läs mer om Credits", href: "/link-to-credits-info" } 
  },
  // Uppdaterade för Silver/Guld - skilj på Leasing och Kontant
  SILVER_PACKAGE_LEASING_FLATRATE_ACTIVE: { 
    title: "Info: Modell Silver (Leasing)", 
    body: "Utökad service (...) ingår. Flatrate Credits (obegr. användning, 3 mån uppsägningstid) ingår i modellpriset vid denna högre leasingnivå (Standard+).", 
    link: { text: "Se villkor", href: "/link-to-sla-details" } 
  },
  SILVER_PACKAGE_LEASING_FLATRATE_INACTIVE: { 
    title: "Info: Modell Silver (Leasing)", 
    body: "Utökad service ingår. OBS! För att Flatrate ska ingå krävs leasingmodell Standard eller högre (slider >= 50%). Styckepris för credits tillkommer nu utöver modellpriset.", 
    link: { text: "Se villkor", href: "/link-to-sla-details" } 
  },
  SILVER_PACKAGE_CASH: { 
    title: "Info: Modell Silver (Kontant)", 
    body: "Utökad service (...) ingår. Flatrate Credits (obegr. användning, 3 mån uppsägningstid) ingår automatiskt i modellpriset vid kontantköp.", 
    link: { text: "Se villkor", href: "/link-to-sla-details" } 
  },
  GULD_PACKAGE_LEASING_FLATRATE_ACTIVE: { 
    title: "Info: Modell Guld (Leasing)", 
    body: "Premium service (...) ingår. Flatrate Credits (obegr. användning, 3 mån uppsägningstid) ingår i modellpriset vid denna högre leasingnivå (Standard+).", 
    link: { text: "Se villkor", href: "/link-to-sla-details" } 
  },
  GULD_PACKAGE_LEASING_FLATRATE_INACTIVE: { 
    title: "Info: Modell Guld (Leasing)", 
    body: "Premium service ingår. OBS! För att Flatrate ska ingå krävs leasingmodell Standard eller högre (slider >= 50%). Styckepris för credits tillkommer nu utöver modellpriset.", 
    link: { text: "Se villkor", href: "/link-to-sla-details" } 
  },
  GULD_PACKAGE_CASH: { 
    title: "Info: Modell Guld (Kontant)", 
    body: "Premium service (...) ingår. Flatrate Credits (obegr. användning, 3 mån uppsägningstid) ingår automatiskt i modellpriset vid kontantköp.", 
    link: { text: "Se villkor", href: "/link-to-sla-details" } 
  },
  // Förklarar varför Flatrate toggle/benefit kan vara inaktiv (endast Leasing-fall)
  FLATRATE_NEEDS_HIGHER_LEASE: { 
    title: "Info: Välj Flatrate?", 
    body: "För att kunna välja/inkludera Flatrate behöver du välja en högre leasingmodell (Standard eller högre via slidern)." 
  }
};
