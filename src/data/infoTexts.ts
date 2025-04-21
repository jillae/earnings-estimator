// Fil: src/data/infoTexts.ts

export interface InfoText {
  title: string;
  body: string;
  link?: { text: string; href: string }; // Optional link
}

// Definierar nycklarna för olika informationskontexter
export type InfoTextKey =
  | 'DEFAULT' // Standard, ingen specifik info visas
  | 'CREDITS_MACHINE_SELECTED' // När en maskin MED credits väljs
  | 'NON_CREDITS_MACHINE_SELECTED' // När en maskin UTAN credits väljs
  | 'BAS_PACKAGE_CREDITS_LEASING' // När Paket Bas är valt + Leasing + Credits-maskin
  | 'BAS_PACKAGE_CREDITS_CASH' // När Paket Bas är valt + Kontant + Credits-maskin
  | 'SILVER_PACKAGE_SELECTED' // När Paket Silver är valt
  | 'GULD_PACKAGE_SELECTED' // När Paket Guld är valt
  | 'FLATRATE_UNLOCKED_OFF' // När Paket Bas + Credits + Flatrate är tillgängligt men AV
  | 'FLATRATE_LOCKED'; // När Paket Bas + Credits + Flatrate INTE är tillgängligt

// Mappar nycklar till specifika texter (eller null för att dölja rutan)
export const infoTexts: Record<InfoTextKey, InfoText | null> = {
  DEFAULT: null,

  CREDITS_MACHINE_SELECTED: {
    title: "Info: Credits & Driftpaket",
    body: "Denna maskin använder credits. Välj ett Driftpaket för att se din totala driftskostnad för service, garanti och användning.",
    // Uppdatera href till er faktiska info-sida/PDF
    link: { text: "Jämför Driftpaketen", href: "/link-to-sla-details" }
  },

  NON_CREDITS_MACHINE_SELECTED: {
    title: "Info: Service & Driftpaket",
    body: "Denna maskin har inga kreditkostnader. Välj ett Driftpaket för att se din fasta månadskostnad för service och garanti.",
    link: { text: "Jämför Driftpaketen", href: "/link-to-sla-details" } // Uppdatera href
  },

  BAS_PACKAGE_CREDITS_LEASING: {
    title: "Info: Paket Bas (Leasing)",
    body: "Styckepris per credit gäller (priset påverkas av vald leasingnivå). Ger kontroll över användning. Credits beställs separat i 25-pack. Flatrate (3 mån uppsägning) kan väljas nedan om villkor uppfylls.",
    link: { text: "Läs mer om Credits", href: "/link-to-credits-info" } // Uppdatera href
  },

  BAS_PACKAGE_CREDITS_CASH: {
    title: "Info: Paket Bas (Kontant)",
    body: "Fast styckepris per credit gäller. Ger kontroll över användning. Credits beställs separat i 25-pack. Flatrate (3 mån uppsägning) kan väljas nedan vid minst 3 beh/dag.",
    link: { text: "Läs mer om Credits", href: "/link-to-credits-info" } // Uppdatera href
  },

  SILVER_PACKAGE_SELECTED: {
    title: "Info: Paket Silver",
    body: "Utökad service (24m Garanti, Utökad Support, Lånemaskin) ingår. För kreditmaskiner ingår även Flatrate Credits (obegränsad användning, 3 mån uppsägningstid) i paketpriset.",
    link: { text: "Se fullständiga villkor", href: "/link-to-sla-details" } // Uppdatera href
  },

  GULD_PACKAGE_SELECTED: {
    title: "Info: Paket Guld",
    body: "Premium service (24m Garanti, Premium Support, Lånemaskin etc.) ingår. För kreditmaskiner ingår även Flatrate Credits (obegränsad användning, 3 mån uppsägningstid) i paketpriset.",
    link: { text: "Se fullständiga villkor", href: "/link-to-sla-details" } // Uppdatera href
  },

  FLATRATE_UNLOCKED_OFF: {
    title: "Info: Välj Flatrate?",
    body: "Du kan nu välja Flatrate via togglen för att få obegränsade credits till en fast månadskostnad (3 mån uppsägningstid)."
  },

  FLATRATE_LOCKED: {
    title: "Info: Flatrate Ej Tillgängligt",
    body: "För att kunna välja Flatrate behöver du ha minst 3 behandlingar per dag och valt leasingpaket 'Standard' eller högre (slider på minst 50%)."
  }
};
