
export interface Machine {
  id: string;
  name: string;
  description?: string;
  price?: string | number;
  usesCredits: boolean;
  creditMin?: number;
  creditMax?: number;
  leasingMin?: number;
  leasingMax?: number;
  flatrateAmount?: number;
  defaultCustomerPrice?: number;
  defaultLeasingPeriod?: string;
}
