# Magnificent Seven Dashboard

Dashboard für die sieben großen Tech-Unternehmen: Apple, Meta, Microsoft, Google, Amazon, Tesla und Nvidia. Es zeigt Umsatz, Nettogewinn, Rohmarge und Umsatzwachstum als Diagramme. Die Daten stammen aus einem Google Sheet.

**Live:** https://cwhymann.github.io/magnificent-seven-dashboard/

Das Design ist aus Figma übernommen. Die Anforderungen kommen aus der Checkliste der Developer Akademie.

## Funktionen

- Kachelleiste mit den sieben Firmen. Pro Kachel lässt sich das Quartal wechseln, und ein Klick öffnet die Detailansicht mit den letzten zwölf Quartalen.
- Liniendiagramm: Umsatz der letzten drei Jahre, eine Linie pro Firma.
- Ringdiagramm: Umsatzanteile der Firmen auf Basis des TTM-Umsatzes (die letzten vier Quartale).
- Balkendiagramme für Nettogewinn (TTM), Rohmarge (letztes Quartal) und Umsatzwachstum (YoY, letzte vier Quartale).
- Tooltips in allen Diagrammen.
- Responsives Layout von 320 px bis Desktop.

## Technik

- Vue 3 mit TypeScript und `<script setup>`
- Vite als Build-Tool
- Tailwind CSS mit den Figma-Farben und der Schrift Rubik
- chart.js mit vue-chartjs für die Diagramme
- GitHub Actions für die Datenaktualisierung und die Veröffentlichung auf GitHub Pages

## Lokal starten

Voraussetzung: Node.js 22 oder neuer.

```bash
npm install
npm run dev
```

Danach ist die Seite unter `http://localhost:5173/magnificent-seven-dashboard/` erreichbar.

Weitere Befehle:

```bash
npm run build      # Typprüfung und Produktionsbuild nach dist/
npm run preview    # Produktionsbuild lokal ansehen
npm run fetch-data # Daten aus dem Google Sheet neu laden
```

## Daten

Die Zahlen stehen im Google Sheet „Doppelgänger.io: Stock Earnings Overview“, je Firma ein eigener Tab. Das Skript `scripts/fetch-data.mjs` liest alle Tabs als CSV, rechnet die Werte in Milliarden US-Dollar um und schreibt sie nach `src/data/financials.json`.

- Zeilen werden anhand ihres Namens gefunden, weil die Tabs unterschiedlich aufgebaut sind.
- Quartale, die noch nicht veröffentlicht sind (etwa 45 Tage nach Quartalsende), werden ausgelassen.
- Die Diagramme zeigen nur Quartale, für die alle sieben Firmen vollständige Werte haben.

Der Workflow `update-data.yml` führt das Skript jeden Montag um 06:00 UTC aus und committet eine geänderte `financials.json`. Danach wird die Seite über `deploy.yml` neu veröffentlicht.

## Veröffentlichung

`deploy.yml` baut die Seite bei jedem Push auf `main` und nach jedem erfolgreichen Datenupdate und veröffentlicht sie auf GitHub Pages. Voraussetzung ist, dass unter **Settings → Pages** als Source **GitHub Actions** gewählt ist.

## Projektstruktur

```
src/
├── App.vue                  Seitenlayout und Abschnitte
├── components/
│   ├── CompanyCard.vue      Firmenkachel mit Quartalswechsel
│   ├── CompanyDetail.vue    Detailansicht einer Firma
│   ├── ChartPanel.vue       Rahmen für ein Diagramm
│   └── charts/              Die fünf Diagramme
├── composables/useNarrow.ts Erkennt schmale Bildschirme (unter 640 px)
├── data/
│   ├── companies.ts         Reihenfolge und Anzeigenamen der Kacheln
│   ├── metrics.ts           Farben, Quartalsformat, Berechnungen (TTM, YoY)
│   └── financials.json      Daten aus dem Google Sheet
scripts/fetch-data.mjs       Holt die Daten aus dem Sheet
docs/PLAN.md                 Projektplan und Entscheidungen
```
