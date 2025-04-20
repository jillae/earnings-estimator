
export interface InfoText {
  title: string;
  body: string;
}

export type InfoTextKey = 
  | 'DEFAULT'
  | 'CREDITS_MACHINE_SELECTED'
  | 'NON_CREDITS_MACHINE_SELECTED'
  | 'BAS_PACKAGE_CREDITS_LEASING'
  | 'BAS_PACKAGE_CREDITS_CASH'
  | 'SILVER_PACKAGE_CREDITS'
  | 'GULD_PACKAGE_CREDITS'
  | 'FLATRATE_UNLOCKED_OFF'
  | 'FLATRATE_LOCKED';

export const infoTexts: Record<InfoTextKey, InfoText | null> = {
  DEFAULT: null, // Ingen ruta visas initialt
  
  CREDITS_MACHINE_SELECTED: { 
    title: "Info: Credits & Driftpaket", 
    body: "Denna maskin använder credits. Driftskostnaden beror på valt paket och ev. leasingnivå (i Bas). Silver/Guld inkluderar obegränsade credits (Flatrate)." 
  },
  
  NON_CREDITS_MACHINE_SELECTED: { 
    title: "Info: Service & Driftpaket", 
    body: "Denna maskin har inga kreditkostnader. Välj ett paket för service & garanti." 
  },
  
  BAS_PACKAGE_CREDITS_LEASING: { 
    title: "Info: Paket Bas", 
    body: "Du betalar per credit. Priset justeras med slidern (Låg leasing = Högt pris per credit). Flatrate kan väljas om villkor uppfylls." 
  },
  
  BAS_PACKAGE_CREDITS_CASH: { 
    title: "Info: Paket Bas", 
    body: "Du betalar ett fast pris per credit. Flatrate kan väljas vid minst 3 behandlingar per dag." 
  },
  
  SILVER_PACKAGE_CREDITS: { 
    title: "Info: Paket Silver", 
    body: "Utökad service och Flatrate Credits ingår i paketpriset. Du får obegränsad användning av maskinen." 
  },
  
  GULD_PACKAGE_CREDITS: { 
    title: "Info: Paket Guld", 
    body: "Premium service och Flatrate Credits ingår i paketpriset. Du får obegränsad användning av maskinen med prioriterad support." 
  },
  
  FLATRATE_UNLOCKED_OFF: { 
    title: "Info: Flatrate Tillgängligt", 
    body: "Du kan nu välja Flatrate för obegränsade credits till fast pris via togglen." 
  },
  
  FLATRATE_LOCKED: { 
    title: "Info: Flatrate Ej Tillgängligt", 
    body: "Flatrate kräver minst 3 behandlingar per dag och leasingpaket 'Standard' eller högre." 
  }
};
