# PROWPL-blog

Een blog style logboek en accomplishments portfolio voor de graduaat stage bij **Aertssen**.

Gebouwd met **Next.js (App Router)**, **TypeScript**, **Drizzle ORM**, een lokale **SQLite database**, en **Tailwind CSS**.

---

## 🌟 Belangrijkste Functionaliteiten

1. **GitHub-achtige Contribution Heatmap Matrix**:
   - Visualiseert de activiteit over 18 weken met 5 intensiteitsniveaus (0 t/m 4).
   - Dynamische hover tooltips met uren, aantal prestaties en dagelijkse samenvattingen.
   - Klik op een specifieke dag om direct alle logboekberichten naar die datum te filteren.

2. **Dagelijkse Stageverslagen & Realisaties (Daily Logs)**:
   - Uitgebreide blogposts met gestructureerde mijlpalen (bullet points), geleerde lessen, uitdagingen en reflecties.
   - Categorisering (Onboarding, Feature Development, Architecture, Testing, DevOps, Mentoring).
   - Gemoedstoestand / flow tracking (Enthousiast 🚀, Productief ⚡, Tevreden ✨, etc.).
   - Stagementor feedback sectie met speciale badges.

3. **KPI & Voortgangsmetingen (Internship Analytics)**:
   - Totaal aantal geregistreerde stage-uren en gemiddelde uren per dag.
   - Totaal gedocumenteerde dagen en streak-indicatoren.
   - Aantal behaalde mijlpalen en top vaardigheden tag-cloud.

4. **Graduaat Leerdoelen & Competenties (Aertssen)**:
   - Voortgangsbalken en status voor officiële stage-eindtermen.
   - Mogelijkheid om de voortgang per competentie direct bij te werken.

5. **Officieel Print- & PDF-klaar Stageverslag**:
   - Ingebouwde export-functie voor de graduaatsjury en stagementor.
   - Inclusief samenvatting, urenoverzicht, competentiematrix en handtekeningenveld.

6. **Volledige CRUD met Drizzle ORM**:
   - Aanmaken, bewerken, bekijken en verwijderen van dagverslagen.
   - Automatische synchronisatie van de `contributions` tabel en intensiteitsberekening.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, Server Actions)
- **Taal**: [TypeScript](https://www.typescriptlang.org/) (Strikte modus)
- **Database & ORM**: [Drizzle ORM](https://orm.drizzle.team/) met lokale SQLite via `@libsql/client`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconen**: [Lucide React](https://lucide.dev/)
- **Datumverwerking**: [date-fns](https://date-fns.org/) met Nederlandse lokalisatie

---

## 🗄️ Database Schema

Het datamodel is gedefinieerd in [`src/db/schema.ts`](src/db/schema.ts):

- **`daily_logs`**:
  - `id`: Unieke primaire sleutel (autoincrement)
  - `date`: Unieke datum (`YYYY-MM-DD`)
  - `title`: Titel van het verslag
  - `summary`: Beknopte samenvatting
  - `content`: Volledig logboekbericht (Markdown ondersteund)
  - `hoursWorked`: Gewerkte uren (bijv. 8.0)
  - `category`: Categorie van de werkzaamheden
  - `mood`: Gemoedstoestand van de stagedag
  - `accomplishments`: JSON-array van voltooide taken en mijlpalen
  - `skills`: JSON-array van gebruikte technologieën
  - `challenges`: Uitdagingen en obstakels
  - `learnings`: Geleerde lessen en reflectie
  - `mentorFeedback`: Feedback van de Aertssen stagementor
  - `isPublished`: Publicatiestatus
  - `createdAt`, `updatedAt`: Tijdstempels

- **`contributions`**:
  - `id`: Primaire sleutel
  - `date`: Unieke datum (`YYYY-MM-DD`)
  - `activityCount`: Aantal activiteiten / commits / taken
  - `intensityLevel`: Niveau 0 t/m 4 voor heatmap kleuring
  - `hoursLogged`: Geregistreerde uren
  - `highlight`: Belangrijkste prestatie of titel voor de tooltip
  - `dailyLogId`: Foreign key naar `daily_logs.id`

- **`internship_goals`**:
  - `id`: Primaire sleutel
  - `title`: Doelstelling / competentie
  - `description`: Beschrijving
  - `category`: Categorie (Technisch, Architectuur, Soft Skills, etc.)
  - `status`: Status (`not_started`, `in_progress`, `completed`)
  - `progress`: Voortgangspercentage (0-100%)
  - `targetDate`, `completedDate`: Datums

---

## 🚀 Aan de slag

### 1. Repository klonen en afhankelijkheden installeren
```bash
npm install
```

### 2. Ontwikkelomgeving starten (Zero-Setup Auto-Import)
Wanneer je het project voor de eerste keer start na een `git clone` of `git pull`, wordt de SQLite database **automatisch aangemaakt** en worden alle verslagen (`import-data.json`) en doelen (`import-goals.json`) **automatisch geïmporteerd**:
```bash
npm run dev
```
Open vervolgens [http://localhost:3000](http://localhost:3000) in je browser. Er zijn geen handmatige migraties of importcommando's nodig!

---

## 📜 Beschikbare Scripts

| Script | Beschrijving |
| :--- | :--- |
| `npm run dev` | Start de ontwikkelomgeving (voert automatisch `db:init` uit) |
| `npm run build` | Bouwt de productiebundel (voert automatisch `db:init` uit) |
| `npm run start` | Start de gebouwde productie applicatie |
| `npm run db:init` | Initialiseert tabellen en importeert direct `import-data.json` en `import-goals.json` |
| `npm run db:clear` | Maakt alle dagverslagen en contributies leeg uit de database |
| `npm run db:import` | Importeert/synchroniseert handmatig vanuit `import-data.json` |
| `npm run db:import:goals` | Importeert handmatig de stageleerdoelen vanuit `import-goals.json` |
| `npm run db:generate` | Genereert SQL migratiebestanden via Drizzle Kit |
| `npm run db:push` | Past het schema rechtstreeks toe op de SQLite database |
| `npm run db:studio` | Start Drizzle Studio GUI om de database visueel te bekijken |
| `npm run test:db` | Voert de geautomatiseerde end-to-end verificatietest uit |

---

## 🎓 Stagecontext & Beoordeling
Dit project is opgezet in het kader van het Graduaat Programmeren en documenteert de stageactiviteiten bij Aertssen NV.
Via de knop **"Stageverslag Exporteren"** kan op elk moment een formeel verslag worden geprint of opgeslagen als PDF voor tussentijdse evaluaties en de eindverdediging.
