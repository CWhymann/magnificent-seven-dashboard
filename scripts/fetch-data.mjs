/**
 * Fetches quarterly financials of the seven companies from a public Google Sheet
 * and writes them to src/data/financials.json.
 *
 * Run with: npm run fetch-data
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** ID of the Google Sheet (taken from the sheet URL). */
const SHEET_ID = "1m3h9Xce3SRMaq20li2Qg4HuSZowwxQSd9FkQmeuI7Dw";

/** Absolute path of the JSON file the script writes. */
const OUTPUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/data/financials.json",
);

/**
 * @typedef {Object} CompanySource
 * @property {string} name - Display name of the company.
 * @property {string} gid - Sheet tab ID (the number after `gid=` in the URL).
 * @property {string[]} revenue - Row labels that contain total revenue, first match wins.
 * @property {string[]} netIncome - Row labels that contain net income, first match wins.
 * @property {string[]} grossMargin - Row labels that contain gross margin in percent, first match wins.
 */

/**
 * One entry per company. Row labels differ between tabs, so rows are found by name.
 * @type {CompanySource[]}
 */
export const SOURCES = [
  {
    name: "Alphabet",
    gid: "561150333",
    revenue: ["Revenues"],
    netIncome: ["Net Income"],
    grossMargin: ["Gross Margin"],
  },
  {
    name: "Apple",
    gid: "1248043629",
    revenue: ["Total Revenue"],
    netIncome: ["Net Profit"],
    grossMargin: ["Gross Margin"],
  },
  {
    name: "Amazon",
    gid: "1790479069",
    revenue: ["Total net sales"],
    netIncome: ["Net Income"],
    grossMargin: ["Gross Margin"],
  },
  {
    name: "Meta",
    gid: "1277615936",
    revenue: ["Revenue"],
    netIncome: ["Net Income"],
    grossMargin: ["Gross Profit Margin"],
  },
  {
    name: "Microsoft",
    gid: "244946188",
    revenue: ["Total Revenue"],
    netIncome: ["Net income", "Net Income"],
    grossMargin: ["Gross Margin"],
  },
  {
    name: "Nvidia",
    gid: "838783939",
    revenue: ["Revenue"],
    netIncome: ["Net Income (GAAP)", "Net Income"],
    grossMargin: ["Gross Profit Margin"],
  },
  {
    name: "Tesla",
    gid: "674086900",
    revenue: ["Total Revenues"],
    netIncome: ["Net Income"],
    grossMargin: ["Gross Margin"],
  },
];

/**
 * Converts a quarter label into a sortable key.
 *
 * Supported formats: "Q1 2019", "Q1-2019", "Q1-19", "19Q1".
 *
 * @example parseQuarter('Q1-19') // '2019Q1'
 * @param {unknown} label - Raw cell content.
 * @returns {string | null} Key like '2019Q1', or null if the label is not a quarter.
 */
export function parseQuarter(label) {
  const s = String(label ?? "").trim();
  let m = s.match(/^Q([1-4])[\s-]+(\d{4})$/);
  if (m) return `${m[2]}Q${m[1]}`;
  m = s.match(/^Q([1-4])[\s-]+(\d{2})$/);
  if (m) return `20${m[2]}Q${m[1]}`;
  m = s.match(/^(\d{2})Q([1-4])$/);
  if (m) return `20${m[1]}Q${m[2]}`;
  return null;
}

/**
 * Parses a number from a sheet cell.
 *
 * Handles thousands separators, parentheses as negatives, percent signs and
 * spreadsheet errors such as "#DIV/0!".
 *
 * @example parseNumber('(5)') // -5
 * @example parseNumber('38.0%') // 38
 * @param {unknown} raw - Raw cell content.
 * @returns {number | null} The parsed number, or null if the cell is empty or an error.
 */
export function parseNumber(raw) {
  if (raw === undefined || raw === null) return null;
  let s = String(raw).trim();
  if (!s || s.startsWith("#")) return null;
  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1);
  }
  s = s.replace(/[$,%\s]/g, "");
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

/**
 * Parses CSV text. Handles quoted fields, escaped quotes and line breaks inside fields.
 *
 * @param {string} text - Raw CSV content.
 * @returns {string[][]} Rows, each row is an array of cell strings.
 */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * Finds the header row, which is the row with the most quarter labels,
 * and maps each quarter key to its column index.
 *
 * @param {string[][]} rows - Parsed sheet rows.
 * @returns {Map<string, number>} Quarter key to column index.
 */
function findQuarterColumns(rows) {
  let best = { index: -1, columns: new Map() };
  rows.forEach((row, index) => {
    const columns = new Map();
    row.forEach((cell, col) => {
      const q = parseQuarter(cell);
      if (q && !columns.has(q)) columns.set(q, col);
    });
    if (columns.size > best.columns.size) best = { index, columns };
  });
  return best.columns;
}

/**
 * Returns the first row whose label (column A) matches one of the given labels.
 *
 * @param {string[][]} rows - Parsed sheet rows.
 * @param {string[]} labels - Candidate labels, checked in order.
 * @param {string} firmName - Company name, used in the error message.
 * @param {string} what - Description of the value, used in the error message.
 * @returns {string[]} The matching row.
 * @throws {Error} If no row matches any label.
 */
function findRow(rows, labels, firmName, what) {
  for (const label of labels) {
    const row = rows.find((r) => (r[0] ?? "").trim() === label);
    if (row) return row;
  }
  throw new Error(
    `${firmName}: Zeile für ${what} nicht gefunden (gesucht: ${labels.join(" / ")})`,
  );
}

/**
 * Converts millions of USD into billions, rounded to three decimals.
 *
 * @param {number | null} value - Value in millions.
 * @returns {number | null} Value in billions, or null if the input is null.
 */
function toBillions(value) {
  return value === null ? null : Math.round((value / 1000) * 1000) / 1000;
}

/**
 * Builds the quarterly data for one company from its parsed sheet.
 *
 * @param {CompanySource} source - Source definition of the company.
 * @param {string[][]} rows - Parsed rows of the company's tab.
 * @returns {Record<string, { revenue: number | null, netIncome: number | null, grossMargin: number | null }>}
 *   Values keyed by quarter. Revenue and net income are in billions USD, gross margin in percent.
 * @throws {Error} If no quarter header or no required row can be found.
 */
export function buildCompany(source, rows) {
  const columns = findQuarterColumns(rows);
  if (columns.size === 0)
    throw new Error(`${source.name}: keine Quartale in der Kopfzeile gefunden`);

  const revenueRow = findRow(rows, source.revenue, source.name, "Umsatz");
  const netIncomeRow = findRow(
    rows,
    source.netIncome,
    source.name,
    "Net Income",
  );
  const marginRow = findRow(rows, source.grossMargin, source.name, "Rohmarge");

  const data = {};
  for (const [quarter, col] of columns) {
    data[quarter] = {
      revenue: toBillions(parseNumber(revenueRow[col])),
      netIncome: toBillions(parseNumber(netIncomeRow[col])),
      grossMargin: parseNumber(marginRow[col]),
    };
  }
  return data;
}

/**
 * Returns the quarters for which every company has revenue, net income and gross margin.
 * Quarters with missing values, for example estimates in only some tabs, are excluded.
 *
 * @param {{ name: string, data: Record<string, object> }[]} companies - Parsed data per company.
 * @returns {string[]} Sorted quarter keys, oldest first.
 */
export function completeQuarters(companies) {
  const all = new Set(companies.flatMap((c) => Object.keys(c.data)));
  return [...all]
    .filter((q) =>
      companies.every((c) => {
        const v = c.data[q];
        return (
          v &&
          v.revenue !== null &&
          v.netIncome !== null &&
          v.grossMargin !== null
        );
      }),
    )
    .sort();
}

/**
 * Downloads all tabs, builds the dataset and writes it to OUTPUT.
 *
 * @returns {Promise<void>}
 * @throws {Error} If a tab cannot be downloaded or a required row is missing.
 */
async function main() {
  const companies = [];
  for (const source of SOURCES) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${source.gid}`;
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(
        `${source.name}: Abruf fehlgeschlagen (HTTP ${res.status})`,
      );
    const rows = parseCsv(await res.text());
    companies.push({ name: source.name, data: buildCompany(source, rows) });
    console.log(`${source.name}: ${rows.length} Zeilen gelesen`);
  }

  const quarters = completeQuarters(companies);
  if (quarters.length === 0)
    throw new Error("Kein Quartal ist in allen Tabs vollständig");

  const output = {
    updatedAt: new Date().toISOString(),
    latestQuarter: quarters[quarters.length - 1],
    companies: companies.map((c) => ({
      name: c.name,
      quarters: quarters.map((q) => ({ quarter: q, ...c.data[q] })),
    })),
  };

  await writeFile(OUTPUT, JSON.stringify(output, null, 2) + "\n", "utf8");
  console.log(`Geschrieben: ${OUTPUT}`);
  console.log(`Neuestes vollständiges Quartal: ${output.latestQuarter}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}
