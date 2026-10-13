# Magnificent Seven Dashboard: Projektplan

Stand: 13.10.2026

## Ziel

Ein Dashboard für die sieben großen Tech-Unternehmen (Apple, Meta, Microsoft, Google, Amazon, Tesla, Nvidia). Es zeigt Umsatz, Gewinn, Rohmarge und Wachstum aus einem Google Sheet. Das Design kommt aus Figma, die Anforderungen aus der Checkliste der Developer Akademie.

Die festen Zahlen aus dem Figma-Design sind nur Platzhalter. Die echten Werte kommen aus dem Sheet.

## Quellen

- Figma (Node 2-2): https://www.figma.com/design/VvV00Qnwgs9uQLytzXGxg2/Vue-JSA-Dashboard---The-Magnificent%C2%A0Seven-Companies?node-id=2-2&m=dev
  - fileKey: VvV00Qnwgs9uQLytzXGxg2, nodeId: 2:2
- Checkliste: Datei Kopie*von_Magnificent_Seven*.pdf (Developer Akademie)
- Datenquelle Google Sheet "Doppelgänger.io: Stock Earnings Overview":
  https://docs.google.com/spreadsheets/d/1m3h9Xce3SRMaq20li2Qg4HuSZowwxQSd9FkQmeuI7Dw
  - Apple-Tab: gid=1248043629
  - Übersichtstab: gid=2097954137 (nur Ticker-Liste, keine Zahlen)
  - Tabs der übrigen Firmen: noch unbekannt

## Stand des Projekts

Das Repo ist ein frisches Vite-Projekt mit Vue 3 und TypeScript. Es gibt einen einzigen Commit: "Initial Vite Vue TypeScript setup with chart dependencies".

Installierte Abhängigkeiten laut package.json:

- vue 3.5.42
- chart.js 4.5.1
- vue-chartjs 5.3.4
- vite 8.3.0
- typescript 6.0.2
- vue-tsc 3.3.11
- @vitejs/plugin-vue 6.0.8

Noch nicht vorhanden:

- Tailwind (Entscheidung offen)
- Schrift Rubik
- Logos der Firmen
- Datenanbindung
- Eigene Komponenten (es liegt nur die Vorlage HelloWorld.vue da)

## Figma-Werte

Die Werte stammen aus dem Figma-Code von Node 2-2. Frame-Größe laut Hintergrund: 1440 x 1122 px.

### Farben

- Hintergrund: radialer Verlauf von rgba(2,2,4,1) über rgba(2,9,16,1) und rgba(1,17,28,1) bis rgba(1,31,53,1), Mitte oben
- Kachel-Container: rgba(2,58,98,0.2), Radius 20px, Padding 24px, Gap 24px
- Karten: #011f35, Radius 16px
- Titel-Pille: #39daff
- Titel-Text: #f9f9f9
- Text: #ffffff
- Veränderung positiv: #3ba752
- Veränderung negativ: #c41c1c
- Balken-Rand: 1px weiß

### Firmenfarben (Reihenfolge der Legende)

| Firma     | Farbe   |
| --------- | ------- |
| Meta      | #39daff |
| Tesla     | #31bfe2 |
| Nvidia    | #29a5c5 |
| Microsoft | #218aa8 |
| Apple     | #196f8c |
| Google    | #11546f |
| Amazon    | #093a52 |

### Quartalsfarben (Growth-Diagramm)

| Quartal | Farbe   |
| ------- | ------- |
| Q1 2024 | #39daff |
| Q4 2023 | #31bfe2 |
| Q3 2023 | #29a5c5 |
| Q2 2023 | #218aa8 |

### Schrift

- Rubik Regular 400, Medium 500, SemiBold 600 (Google Fonts)
- Ausnahme: Achsenbeschriftung im Net-Income-Diagramm in Arial
- Titel Seite: Rubik Medium 36px, Farbe #f9f9f9
- Kartentitel: Rubik SemiBold 20px
- Firmenname in Kachel: Rubik Medium 20px
- Label "Revenue Q1 2024": Rubik Regular 12px
- Umsatzwert in Kachel: Rubik Medium 24px
- Veränderung in Kachel: Rubik Medium 13px
- Einheit "In Bill USD": Rubik Regular 8px
- Legenden: Rubik Regular 10px
- Achsenbeschriftung: Rubik Regular 8px

### Maße und Layout

- Titel-Pille: 96 x 32 px, abgerundet rechts (100px), Position left 0, top 64px
- Titel-Gruppe: Gap 24px
- Kachel-Leiste: oben bei top 155px, zentriert, Breite 1223.6px
- Einzelkachel: Padding 20px horizontal und 24px vertikal (laut Figma px-24 py-20 bei Umsatzkarte), Gap 8px, Höhe ca. 110 px
- Obere Diagrammreihe: top 378px, Gap 32px
  - Liniendiagramm: Breite 714px, Höhe 352px, Padding 20px
  - Ringdiagramm: Padding 49px horizontal, Höhe 352px
- Untere Reihe: top 762px, Gap 32px, Höhe 296px, Padding 20px
  - Net Income: Breite nicht fest, ca. Hälfte
  - Gross Margin: Breite 293px
  - Revenue Growth: Breite 491px
- Ringdiagramm: Durchmesser 260px
- Donut-Legende: rechts neben dem Ring, Gap 16px, Farbfeld 32 x 12px

## Offene Entscheidungen (von dir)

1. Styling: Tailwind installieren oder normales CSS?
2. Logos: Apple, Meta, Microsoft, Google, Amazon, Tesla als SVG aus Figma exportieren und in `src/assets/logos/` ablegen. Bis dahin Platzhalter.
3. Platzhalterwerte: aus dem Design übernehmen oder leer lassen?
4. Zeitraum: Checkliste sagt Q1 2021 bis Q4 2023, Design zeigt bis Q1 2024. Welcher gilt?
5. Tooltips: Checkliste verlangt sie, Design zeigt keine. Zusätzlich zum Design?
6. Revenue-Zeile: Zeile 9 (Total Revenue) statt Zeile 5 (nur Product Revenue) bestätigt?
7. Einheit im Sheet: Werte in Millionen USD (z. B. 84,310 = 84,3 Mrd.)? Der Hinweis im Sheet nennt Tausend. Bitte bestätigen.
8. Tabs der übrigen sechs Firmen: Links oder CSV-Dateien.
9. Aktualisierung: Wie oft soll sich das Dashboard aktualisieren? Das Sheet wird von einem Dritten gepflegt und enthält Schätzungen für zukünftige Quartale (laut Hinweis), die ausgeschlossen werden sollten.
10. Figma-Auffälligkeit: Die Nvidia-Karte im Figma-Design hat dieselben Werte wie Apple (38,52 / +1,06 / 2,83 %). Vermutlich ist das ein Platzhalter. Bitte bestätigen, welche Werte für Nvidia gelten.
11. Name "Tsla" in Figma: Soll es "Tesla" heißen?

## Umsetzungsschritte

Jeder Schritt wird vom Nutzer geprüft, bevor der nächste beginnt. Vorab wird immer die Umsetzung beschrieben, dann erst der Code.

### Schritt 1: Layout nach Figma

- Titel-Pille und Titel
- Kachelleiste mit sechs Firmen (Platzhalterwerte aus Datei `src/data/companies.ts`)
- Sieben Diagrammflächen als Platzhalter im Layout
- Schrift Rubik, Farben, Responsive bis 320 px

Dateien:

- `src/App.vue`
- `src/components/CompanyCard.vue`
- `src/components/ChartPanel.vue`
- `src/data/companies.ts`
- `src/style.css` oder Tailwind-Konfiguration (je nach Entscheidung)

### Schritt 2: Diagramme mit Chart.js

- Liniendiagramm mit sieben Linien (Checkliste Punkt 2)
- Ringdiagramm TTM (Punkt 3)
- Net Income TTM (Punkt 4)
- Gross Margin (Punkt 5)
- Revenue Growth YoY (Punkt 6)

### Schritt 3: Datenanbindung

- Sheet einlesen (CSV-Export oder Build-Zeit)
- Umrechnung in Mrd. $
- Berechnung TTM und YoY
- Ausschluss von Schätzungen

### Schritt 4: Tooltips und Feinschliff

- Mouseover mit Quartal und Werten (Checkliste Punkt 2 und 3)
- Kontextinfo bei Gross Margin (Punkt 5)
- Test und Prüfung gegen die Checkliste

## Checkliste (Kurzform)

1. Aktueller Umsatz: Wert, Quartal, absolute und relative Veränderung
2. Liniendiagramm, drei Jahre, Tooltip
3. Ringdiagramm TTM, Tooltip mit Quartal
4. Net Income TTM in Mrd. $
5. Gross Margin mit Quartal
6. Revenue Growth YoY, vier Quartale, Blautöne

## Arbeitsregeln

- Vor jedem Code: Plan erklären, was gebaut wird und welche Dateien betroffen sind.
- Code immer als vollständige, kopierbare Datei im Chat, keine Diffs.
- Keine Downloads oder Patch-Dateien.
- Commit-Nachrichten auf Englisch.
- Keine eigenen Entscheidungen zwischendurch, Unklarheiten zuerst klären.
- Figma-Werte exakt übernehmen, Abweichungen vorher ansprechen.
