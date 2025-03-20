
import { Machine } from './types';

export const handheldMachines: Machine[] = [
  {
    id: "xlr8",
    name: "XLR8",
    description: "Instegsmodell av handhållen behandlingsutrustning",
    priceEur: 9900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 500,
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop"
  },
  {
    id: "evrl",
    name: "EVRL",
    description: "Specialanpassad utrustning för särskilda behandlingar",
    priceEur: 17900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 800,
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop"
  },
  {
    id: "gvl",
    name: "GVL",
    description: "Senaste modellen av handhållen behandlingsutrustning",
    priceEur: 19900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1200,
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop"
  }
];
