export interface Company {
  name: string;
  logo: string;
  revenue: number;
  change: number;
  changePercent: number;
}

// Platzhalterwerte aus dem Figma-Design. Werden in Schritt 3 durch die Daten aus dem Sheet ersetzt.
export const companies: Company[] = [
  {
    name: "Apple",
    logo: "/logos/apple.svg",
    revenue: 38.52,
    change: 1.06,
    changePercent: 2.83,
  },
  {
    name: "Meta",
    logo: "/logos/meta.svg",
    revenue: 435.57,
    change: -5.81,
    changePercent: -1.32,
  },
  {
    name: "Microsoft",
    logo: "/logos/microsoft.svg",
    revenue: 409.05,
    change: 1.7,
    changePercent: 2.51,
  },
  {
    name: "Google",
    logo: "/logos/google.svg",
    revenue: 29.87,
    change: 1.7,
    changePercent: 6.04,
  },
  {
    name: "Amazon",
    logo: "/logos/amazon.svg",
    revenue: 117.89,
    change: 4.22,
    changePercent: 2.43,
  },
  {
    name: "Tesla",
    logo: "/logos/tesla.svg",
    revenue: 177.89,
    change: 4.22,
    changePercent: 2.43,
  },
];
