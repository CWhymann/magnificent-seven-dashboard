import financials from "./financials.json";

/** One reported quarter of a company, values in billions USD (gross margin in percent). */
export interface Quarter {
  quarter: string;
  revenue: number;
  netIncome: number;
  grossMargin: number;
}

/** Data shown in one card of the company strip. */
export interface Company {
  name: string;
  logo: string;
  quarterLabel: string;
  revenue: number;
  change: number;
  changePercent: number;
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

/**
 * Builds one card per company: latest reported quarter, and the change
 * against the quarter before it.
 */
function buildCompanies(): Company[] {
  return DISPLAY.map((item) => {
    const source = financials.companies.find((c) => c.name === item.source);
    if (!source || source.quarters.length < 2) {
      throw new Error(`Keine Daten für ${item.name} in financials.json`);
    }
    const quarters = source.quarters;
    const latest = quarters[quarters.length - 1];
    const previous = quarters[quarters.length - 2];
    const change = latest.revenue - previous.revenue;
    return {
      name: item.name,
      logo: item.logo,
      quarterLabel: formatQuarter(latest.quarter),
      revenue: latest.revenue,
      change,
      changePercent: (change / previous.revenue) * 100,
    };
  });
}

export const companies: Company[] = buildCompanies();
