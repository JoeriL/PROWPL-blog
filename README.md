# PROWPL-blog

Een blog style logboek en accomplishments portfolio voor de graduaat stage bij **Aertssen**.

Gebouwd met **Next.js (App Router)**, **TypeScript**, **Drizzle ORM**, een lokale **SQLite database**, en **Tailwind CSS**.

---

## 🌟 Belangrijkste Functionaliteiten

1. **Professionele Welkomst- & Landingspagina (`/`)**:
   - Persoonlijke introductie over de stage bij Aertssen NV en het doel van de blog.
   - Opvallende "Lees de Blog" knop en directe link naar het CV.
   - Live KPI-statistieken (uren, dagen, realisaties, opdrachten).
   - Overzicht van de 4 kernstageopdrachten en de enterprise tech stack (C#, Azure, Next.js, EF Core).
   - Preview van de meest recente dagverslagen.

2. **Stage Logboek & Dagverslagen (`/blog`)**:
   - GitHub-achtige interactieve contribution heatmap matrix over de volledige stageperiode.
   - Uitgebreide blogposts met gestructureerde mijlpalen (bullet points), geleerde lessen, uitdagingen en reflecties.
   - Zoeken, sorteren en filteren op categorieën en vaardigheden.
   - Mogelijkheid om dagverslagen direct aan te maken, te bewerken en te verwijderen (volledige CRUD).

3. **Mijn CV & Vaardigheden Portfolio (`/cv`)**:
   - Beknopt, overzichtelijk rapport van verworven technische vaardigheden (Next.js, React, SQLite, Drizzle ORM, C#, Azure, EF Core).
   - Gedetailleerd overzicht van de belangrijkste realisaties bij Aertssen NV.
   - **Print- & PDF-vriendelijke lay-out** (@media print): met één klik exporteerbaar als PDF voor sollicitaties en de examencommissie.

4. **KPI & Voortgangsmetingen (Internship Analytics)**:
   - Totaal aantal geregistreerde stage-uren en gemiddelde uren per dag.
   - Totaal gedocumenteerde dagen en streak-indicatoren.
   - Aantal behaalde mijlpalen en top vaardigheden tag-cloud.

5. **Graduaat Leerdoelen & Competenties (Aertssen)**:
   - Voortgangsbalken en status voor officiële stage-eindtermen.
   - Mogelijkheid om de voortgang per competentie direct bij te werken.

6. **Officieel Print- & PDF-klaar Stageverslag**:
   - Ingebouwde export-functie voor de graduaatsjury en stagementor.
   - Inclusief samenvatting, urenoverzicht, competentiematrix en handtekeningenveld.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, Server Actions)
- **Taal**: [TypeScript](https://www.typescriptlang.org/) (Strikte modus)
- **Database & ORM**: [Drizzle ORM](https://orm.drizzle.team/) met lokale SQLite via `@libsql/client`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconen**: [Lucide React](https://lucide.dev/)
- **Datumverwerking**: [date-fns](https://date-fns.org/) met Nederlandse lokalisatie

---

## 🚀 Aan de slag

### 1. Repository klonen en afhankelijkheden installeren
```bash
npm install
```

### 2. Ontwikkelomgeving starten
De SQLite database (`sqlite.db`) is direct meegeleverd in de repository met alle geregistreerde verslagen en doelen:
```bash
npm run dev
```
Open vervolgens [http://localhost:3000](http://localhost:3000) in je browser.

---

## 🎓 Stagecontext & Beoordeling
Dit project is opgezet in het kader van het Graduaat Programmeren en documenteert de stageactiviteiten bij Aertssen NV.
Via de knop **"Stageverslag Exporteren"** kan op elk moment een formeel verslag worden geprint of opgeslagen als PDF voor tussentijdse evaluaties en de eindverdediging.
