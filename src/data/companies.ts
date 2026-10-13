import financials from "./financials.json";

/** One reported quarter as shown in a card. */
export interface QuarterValue {
  label: string;
  revenue: number;
}

/** Data for one card: all reported quarters, oldest first. */
export interface Company {
  name: string;
  logo: string;
  quarters: QuarterValue[];
}

/** Order and display names of the cards, as in the Figma design. */
const DISPLAY: { name: string; source: string; logo: string }[] = [
  { name: "Apple", source: "Apple", logo: "/logos/apple.svg" },
  { name: "Meta", source: "Meta", logo: "/logos/meta.svg" },
  { name: "Microsoft", source: "Microsoft", logo: "/logos/microsoft.svg" },
  { name: "Google", source: "Alphabet", logo: "/logos/google.svg" },
  { name: "Amazon", source: "Amazon", logo: "/logos/amazon.svg" },
  { name: "Tesla", source: "Tesla", logo: "/logos/tesla.svg" },
  { name: "Nvidia", source: "Nvidia", logo: "/logos/nvidia.svg" },
];

/** Converts "2026Q2" into "Q2 2026". */
function formatQuarter(key: string): string {
  return `Q${key.slice(5)} ${key.slice(0, 4)}`;
}

/** Builds one card per company with all of its reported quarters. */
function buildCompanies(): Company[] {
  return DISPLAY.map((item) => {
    const source = financials.companies.find((c) => c.name === item.source);
    if (!source || source.quarters.length === 0) {
      throw new Error(`Keine Daten für ${item.name} in financials.json`);
    }
    return {
      name: item.name,
      logo: import.meta.env.BASE_URL + item.logo.slice(1),
      quarters: source.quarters.map((q) => ({
        label: formatQuarter(q.quarter),
        revenue: q.revenue,
      })),
    };
  });
}

export const companies: Company[] = buildCompanies();
