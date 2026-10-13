import financials from "./financials.json";

/** One reported quarter of a firm. Revenue and net income in billions USD, gross margin in percent. */
export interface QuarterData {
  quarter: string;
  revenue: number;
  netIncome: number;
  grossMargin: number;
}

/** A firm with its reported quarters, oldest first. */
export interface Firm {
  label: string;
  color: string;
  quarters: QuarterData[];
}

/** Display names, sheet names and colors, as in the Figma design. */
const FIRM_STYLE = [
  { label: "Apple", source: "Apple", color: "#196f8c" },
  { label: "Meta", source: "Meta", color: "#39daff" },
  { label: "Microsoft", source: "Microsoft", color: "#218aa8" },
  { label: "Google", source: "Alphabet", color: "#11546f" },
  { label: "Amazon", source: "Amazon", color: "#093a52" },
  { label: "Tesla", source: "Tesla", color: "#31bfe2" },
  { label: "Nvidia", source: "Nvidia", color: "#29a5c5" },
];

/** All seven firms in the order of the design. */
export const FIRMS: Firm[] = FIRM_STYLE.map((style) => {
  const source = financials.companies.find((c) => c.name === style.source);
  if (!source)
    throw new Error(`Keine Daten für ${style.label} in financials.json`);
  return { label: style.label, color: style.color, quarters: source.quarters };
});

/** Converts "2026Q2" into "Q2 26" for axis labels. */
export function shortQuarter(key: string): string {
  return `Q${key.slice(5)} ${key.slice(2, 4)}`;
}

/** Converts "2026Q2" into "Q2 2026" for tooltips and labels. */
export function longQuarter(key: string): string {
  return `Q${key.slice(5)} ${key.slice(0, 4)}`;
}

/** Looks up one firm's quarter by key, or null if the firm has no data for it. */
export function quarterOf(firm: Firm, key: string): QuarterData | null {
  return firm.quarters.find((q) => q.quarter === key) ?? null;
}

/** The newest quarter of any firm, for example "2026Q2". */
export function newestQuarter(): string {
  const all = FIRMS.flatMap((f) => f.quarters.map((q) => q.quarter));
  return all.sort().at(-1) ?? "";
}

/** The last `count` quarters that exist for any firm, oldest first. */
export function lastQuarterKeys(count: number): string[] {
  const all = [
    ...new Set(FIRMS.flatMap((f) => f.quarters.map((q) => q.quarter))),
  ].sort();
  return all.slice(-count);
}

/** Sum of the last four reported quarters of a firm, or null if fewer than four exist. */
export function ttm(firm: Firm, field: "revenue" | "netIncome"): number | null {
  if (firm.quarters.length < 4) return null;
  return firm.quarters.slice(-4).reduce((sum, q) => sum + q[field], 0);
}

/** Year-over-year revenue growth in percent for one quarter, or null if the year before is missing. */
export function yoyGrowth(firm: Firm, key: string): number | null {
  const previousKey = `${Number(key.slice(0, 4)) - 1}${key.slice(4)}`;
  const current = quarterOf(firm, key);
  const previous = quarterOf(firm, previousKey);
  if (!current || !previous) return null;
  return (current.revenue / previous.revenue - 1) * 100;
}
