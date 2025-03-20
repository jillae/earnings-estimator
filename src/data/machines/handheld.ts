
import { Machine } from './types';

export const handheldMachines: Machine[] = [
  {
    id: "xlr8",
    name: "XLR8",
    fullName: "XLaser Laser",
    shortName: "XLR8",
    modelCode: "HLS",
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
    imageUrl: "/lovable-uploads/a2cbbb39-639e-4041-bac6-ca7ef5c1c329.png#xywh=249,0,83,341"
  },
  {
    id: "evrl",
    name: "EVRL",
    fullName: "Erchonia Violet & Red Laser",
    shortName: "EVRL",
    modelCode: "EVRL",
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
    imageUrl: "/lovable-uploads/a2cbbb39-639e-4041-bac6-ca7ef5c1c329.png#xywh=332,0,83,341"
  },
  {
    id: "gvl",
    name: "GVL",
    fullName: "GVL",
    shortName: "GVL",
    modelCode: "GVL",
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
    imageUrl: "/lovable-uploads/a2cbbb39-639e-4041-bac6-ca7ef5c1c329.png#xywh=415,0,83,341"
  }
];
