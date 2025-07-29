/**
 * MASKIN API-KLIENT
 * 
 * Centraliserad hantering av API-anrop till machines-api edge function
 */

export interface Machine {
  id: string;
  name: string;
  price_eur: number;
  is_premium: boolean;
  uses_credits: boolean;
  credit_min: number;
  credit_max: number;
  flatrate_amount: number;
  default_customer_price: number;
  default_leasing_period: number;
  leasing_min: number;
  leasing_max: number;
  credits_per_treatment: number;
  description: string | null;
  category: string;
  is_active: boolean;
  leasing_tariffs: Record<string, number>;
  created_at: string;
}

export interface MachineRequest {
  name: string;
  price_eur: number;
  is_premium?: boolean;
  uses_credits?: boolean;
  credit_min?: number;
  credit_max?: number;
  flatrate_amount?: number;
  default_customer_price?: number;
  default_leasing_period?: number;
  leasing_min?: number;
  leasing_max?: number;
  credits_per_treatment?: number;
  description?: string;
  category?: string;
  is_active?: boolean;
  leasing_tariffs?: Record<string, number>;
}

const API_BASE_URL = `https://ejwbhvzmkmuimfqlishm.supabase.co/functions/v1/machines-api`;

class MachineApiClient {
  // Hämta alla maskiner
  async fetchMachines(): Promise<Machine[]> {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Hämta specifik maskin
  async fetchMachine(id: string): Promise<Machine> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Skapa ny maskin
  async createMachine(machineData: MachineRequest): Promise<Machine> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(machineData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create machine');
    }

    return response.json();
  }

  // Uppdatera maskin
  async updateMachine(id: string, updates: Partial<MachineRequest>): Promise<Machine> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update machine');
    }

    return response.json();
  }

  // Radera maskin
  async deleteMachine(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete machine');
    }
  }
}

export const machineApiClient = new MachineApiClient();