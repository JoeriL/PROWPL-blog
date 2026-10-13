import { db } from "./index";
import { dailyLogs, contributions, internshipGoals } from "./schema";
import { format, subDays } from "date-fns";

async function seed() {
  console.log("🌱 Seeding internship blog database...");

  // Clear existing records to ensure clean state
  await db.delete(contributions);
  await db.delete(dailyLogs);
  await db.delete(internshipGoals);

  const today = new Date();

  // Seed Internship Goals
  console.log("Inserting internship goals...");
  await db.insert(internshipGoals).values([
    {
      title: "Full-Stack Web Architecture with Next.js & TypeScript",
      description:
        "Master the App Router, server-side data fetching, typed server actions, and component modularity.",
      category: "Technical",
      status: "completed",
      progress: 100,
      targetDate: format(subDays(today, 10), "yyyy-MM-dd"),
      completedDate: format(subDays(today, 12), "yyyy-MM-dd"),
    },
    {
      title: "Relational Data Modeling with Drizzle ORM & SQLite",
      description:
        "Design typed schemas, implement foreign key relationships, migrations, and efficient queries for daily tracking.",
      category: "Technical",
      status: "completed",
      progress: 100,
      targetDate: format(subDays(today, 7), "yyyy-MM-dd"),
      completedDate: format(subDays(today, 7), "yyyy-MM-dd"),
    },
    {
      title: "Interactive Data Visualization (Contribution Heatmap)",
      description:
        "Build a GitHub-style activity matrix that dynamically calculates activity density, streaks, and day tooltips.",
      category: "Technical",
      status: "completed",
      progress: 100,
      targetDate: format(today, "yyyy-MM-dd"),
      completedDate: format(today, "yyyy-MM-dd"),
    },
    {
      title: "Internship Project Presentation for Aertssen Mentors",
      description:
        "Prepare documentation, accomplishments portfolio, and live demonstration for the graduate internship jury.",
      category: "Process & CI/CD",
      status: "in_progress",
      progress: 80,
      targetDate: format(subDays(today, -14), "yyyy-MM-dd"),
    },
  ]);

  // Seed sample logs spanning the past 4 weeks (workdays)
  const sampleLogs = [
    {
      daysAgo: 24,
      title: "Stage Onboarding & Kennismaking bij Aertssen",
      summary:
        "Eerste stagedag bij Aertssen. Introductie tot het IT-team, inrichting van ontwikkelomgeving en bespreking van de stageopdracht.",
      content: `### Eerste stagedag bij Aertssen

Vandaag was de officiële start van mijn graduaat stage bij Aertssen. Ik werd hartelijk ontvangen door mijn stagementor en het software engineering team.

#### Uitgevoerde taken:
- Toegang gekregen tot interne repositories, Jira en communicatiekanalen.
- Werkstation ingericht met Node.js, Git, VS Code en vereiste extensies.
- Intakegesprek over de scope van het afstudeerproject: het ontwikkelen van een gecentraliseerd logboek en dashboard voor stage-prestaties.
- Doelen voor de eerste maand vastgelegd volgens de stagedoelstellingen van het graduaat.`,
      hoursWorked: 8.0,
      category: "Onboarding",
      mood: "excited",
      accomplishments: [
        "Werkstation geconfigureerd en Git SSH-sleutels ingesteld",
        "Kennismakingsgesprek met stagementor en team voltooid",
        "Projectplan en doelen vastgelegd",
      ],
      skills: ["Git", "Onboarding", "Agile", "Linux/Windows"],
      challenges:
        "Enkele rechten voor interne repositories moesten nog goedgekeurd worden door IT-security.",
      learnings:
        "Goed inzicht gekregen in hoe grote industriële organisaties zoals Aertssen software projecten structureren.",
      mentorFeedback:
        "Goede proactieve houding op dag 1. Werkplek vlot zelfstandig ingericht.",
      activityCount: 3,
      intensityLevel: 2,
    },
    {
      daysAgo: 23,
      title: "Requirements Analyse & Architectuurvoorstel",
      summary:
        "Onderzoek gedaan naar de ideale tech stack voor het blog- en prestatie-dashboard: Next.js App Router, TypeScript en SQLite.",
      content: `### Architectuuranalyse

Na overleg met het team heb ik de technische vereisten uitgeschreven voor het logboek. We kozen voor:
- **Next.js met TypeScript**: Biedt snelle server rendering en robuuste type-veiligheid.
- **SQLite met Drizzle ORM**: Lichtgewicht, zero-setup, lokale persistentie en type-safe queries.
- **Tailwind CSS**: Snelle styling met een professioneel, modern design.`,
      hoursWorked: 7.5,
      category: "Architecture & Planning",
      mood: "productive",
      accomplishments: [
        "Technisch analyse-document opgesteld",
        "Wireframes getekend voor het dashboard en heatmap overzicht",
        "Database entiteiten (DailyLogs, Contributions, Goals) in kaart gebracht",
      ],
      skills: ["Software Architecture", "TypeScript", "Database Design"],
      challenges:
        "Kiezen tussen PostgreSQL of SQLite; gekozen voor SQLite vanwege lokale portabiliteit en eenvoud voor individuele logboeken.",
      learnings:
        "Drizzle ORM biedt enorme voordelen ten opzichte van zware ORMs door minimale overhead.",
      mentorFeedback: "Duidelijke keuzes met goede onderbouwing.",
      activityCount: 4,
      intensityLevel: 3,
    },
    {
      daysAgo: 22,
      title: "Next.js Scaffolding & TypeScript Configuratie",
      summary:
        "Het basisproject opgezet met de nieuwste Next.js App Router, Tailwind CSS en TypeScript strikte modus.",
      content: `### Project Opzet & Structuur

Vandaag de repository opgezet en de Next.js applicatiestructuur ingericht volgens de best practices.

#### Belangrijke mijlpalen:
- Mappenstructuur ingericht: \`src/app\`, \`src/components\`, \`src/db\`, \`src/lib\`.
- TypeScript strict mode ingeschakeld om runtime fouten te voorkomen.
- Tailwind CSS geverifieerd voor responsieve layout op zowel desktop als mobiel.`,
      hoursWorked: 8.0,
      category: "Feature Development",
      mood: "satisfied",
      accomplishments: [
        "Next.js App Router gescaffold met TypeScript",
        "Tailwind CSS v4 en icon bibliotheek geconfigureerd",
        "Clean folder structuur voor schaalbaarheid opgezet",
      ],
      skills: ["Next.js", "TypeScript", "Tailwind CSS"],
      challenges:
        "Aanpassen aan de nieuwste Tailwind v4 importsyntax en Next.js App Router layout conventies.",
      learnings:
        "De voordelen van Server Components voor snelle initial page loads.",
      mentorFeedback: "Mooi opgezet project met nette bestandsstructuur.",
      activityCount: 3,
      intensityLevel: 2,
    },
    {
      daysAgo: 21,
      title: "Drizzle ORM Setup & SQLite Database Integratie",
      summary:
        "Drizzle ORM geconfigureerd met local LibSQL/SQLite, database schema gedefinieerd en eerste migraties uitgevoerd.",
      content: `### Database Laag met Drizzle ORM

De databaselaag is het hart van dit logboek. Vandaag is Drizzle ORM volledig geïntegreerd.

#### Technische realisaties:
- \`src/db/schema.ts\` aangemaakt met tabellen voor \`daily_logs\`, \`contributions\` en \`internship_goals\`.
- Relaties tussen logs en bijhorende dagcontributies gelegd.
- Drizzle Kit scripts toegevoegd aan package.json voor \`generate\`, \`push\` en \`seed\`.
- Getest met lokale SQLite database; instant queries zonder netwerklatentie.`,
      hoursWorked: 8.5,
      category: "Feature Development",
      mood: "excited",
      accomplishments: [
        "Drizzle ORM en SQLite client geïnstalleerd",
        "Type-safe schema ontworpen met autoincrement ID's, JSON types en indexes",
        "Succesvol migraties gegenereerd en toegepast",
      ],
      skills: ["Drizzle ORM", "SQLite", "Database Migrations", "TypeScript"],
      challenges:
        "Zorgen dat JSON velden (accomplishments, skills) automatisch getyped worden in TypeScript.",
      learnings:
        "Drizzle's \`.$type<string[]>()\` helper zorgt voor naadloze type hinting bij JSON kolommen.",
      mentorFeedback:
        "Knap werk om Drizzle direct goed in te richten met migratie-scripts.",
      activityCount: 5,
      intensityLevel: 4,
    },
    {
      daysAgo: 20,
      title: "Contribution Heatmap Algoritme & Visualisatie",
      summary:
        "Implementatie van het GitHub-achtige heatmap algoritme dat dagelijkse prestaties visualiseert over alle stageweken.",
      content: `### Bouwen van de Contribution Heatmap

Een belangrijk visueel onderdeel van de stage-portfolio is het aantonen van regelmaat en toewijding.

#### Uitwerking:
- Weken en dagen berekenen over een periode van 3 maanden.
- Kleur-intensiteit toewijzen op basis van gewerkte uren en voltooide activiteiten (niveau 0 t/m 4).
- Hover tooltips voorzien van de datum, aantal prestaties en beknopte samenvatting.
- Klikbare cellen waarmee je direct kunt filteren naar de betreffende blogpost!`,
      hoursWorked: 8.0,
      category: "Feature Development",
      mood: "excited",
      accomplishments: [
        "Heatmap raster berekend over alle werkdagen en weekenden",
        "Kleurgradaties geïmplementeerd (emerald/groen tinten zoals GitHub)",
        "Interactiviteit met klik- en hover-statistieken toegevoegd",
      ],
      skills: ["React", "Date-fns", "Data Visualization", "Tailwind CSS"],
      challenges:
        "Correct uitlijnen van de startdag van de week (maandag vs zondag) zonder datumfouten.",
      learnings:
        "Gebruik van \`date-fns\` helpers zoals \`eachDayOfInterval\` en \`startOfWeek\`.",
      mentorFeedback:
        "De visualisatie geeft direct een professionele indruk van het logboek.",
      activityCount: 4,
      intensityLevel: 3,
    },
    {
      daysAgo: 17,
      title: "CRUD Functionaliteit voor Dagelijkse Logs",
      summary:
        "Server Actions en API routes gebouwd om nieuwe stage-berichten aan te maken, bewerken en verwijderen met automatische heatmap synchronisatie.",
      content: `### Full-Stack CRUD Workflow

Vandaag de backend en frontend gekoppeld voor het beheer van stageverslagen.

#### Functionaliteiten:
- Modal formulier om een nieuwe daglog toe te voegen (titel, uren, categorie, mood, bullet points).
- Automatische berekening van de heatmap \`intensityLevel\` bij het opslaan van een log.
- Real-time validatie op verplichte velden (datum, titel, samenvatting).`,
      hoursWorked: 8.0,
      category: "Feature Development",
      mood: "productive",
      accomplishments: [
        "Next.js Server Actions voor CREATE, UPDATE en DELETE geïmplementeerd",
        "Automatische synchronisatie tussen daily_logs en contributions tabel",
        "Formulier met dynamische tags voor vaardigheden en prestaties",
      ],
      skills: ["Server Actions", "Full-Stack React", "Drizzle ORM", "CRUD"],
      challenges:
        "Bij het verwijderen van een log moest de bijhorende contribution entry ook opgeschoond worden.",
      learnings:
        "Database foreign keys met \`onDelete: 'cascade'\` of programmatische synchronisatie in transacties.",
      mentorFeedback: "Formulier werkt intuïtief en snel.",
      activityCount: 4,
      intensityLevel: 3,
    },
    {
      daysAgo: 16,
      title: "Zoekfunctie, Filteren op Categorie & Tags",
      summary:
        "Zoekbalk en dynamische filters gebouwd zodat mentoren snel kunnen filteren op vaardigheden zoals Next.js, Drizzle, of categorieën.",
      content: `### Zoeken en Filteren

Om het logboek overzichtelijk te houden naarmate er meer dagen bijkomen:
- Zoekbalk met debounced filtering op titel, samenvatting en geleerde lessen.
- Categorie-knoppen (Onboarding, Feature Development, Architecture, Bug Fixing).
- Filteren op specifieke vaardigheden/technologieën via klikbare tags.`,
      hoursWorked: 7.5,
      category: "Feature Development",
      mood: "satisfied",
      accomplishments: [
        "Direct zoekveld met directe frontend updates",
        "Filter chips voor categorieën met aantal-tellers",
        "Vaardighedencloud met snelle selectie",
      ],
      skills: ["React State", "Filtering", "UI/UX", "Tailwind CSS"],
      challenges: "Gecombineerde filters (zoekwoord + categorie + tag) soepel laten samenwerken.",
      learnings: "Afgeleide state in React zonder overbodige re-renders.",
      mentorFeedback: "Erg handig voor tussentijdse evaluatiegesprekken.",
      activityCount: 3,
      intensityLevel: 2,
    },
    {
      daysAgo: 15,
      title: "KPI Dashboard & Stage Voortgangsmetingen",
      summary:
        "Dashboard widgets ontworpen voor totaal aantal gewerkte uren, huidige streak, behaalde doelstellingen en technologie verdeling.",
      content: `### KPI & Statistieken Widget

Voor de stagebegeleiding is het essentieel om kwantitatieve voortgang in te zien.

#### Toegevoegde metrics:
- Totaal gewerkte stage-uren (bijv. 160+ uren geregistreerd).
- Dagen op rij actief (consecutive streak counter).
- Voortgangspercentages van de officiële graduaat leerdoelen.
- Verdeling van uren over verschillende categorieën.`,
      hoursWorked: 8.0,
      category: "Feature Development",
      mood: "excited",
      accomplishments: [
        "Statistieken kaarten met icoontjes en trend-indicatoren",
        "Berekening van streak en gemiddelde uren per dag",
        "Voortgangsbalken voor stagecompetenties",
      ],
      skills: ["Analytics", "Data Aggregation", "UI Design", "Lucide Icons"],
      challenges: "Edge cases bij weekends in de streak berekening correct opvangen.",
      learnings: "Verschil tussen kalenderdagen en officiële stagedagen.",
      mentorFeedback: "Uitstekend overzicht, heel overtuigend voor de examencommissie.",
      activityCount: 5,
      intensityLevel: 4,
    },
    {
      daysAgo: 14,
      title: "Stage Doelen & Competenties Beheer",
      summary:
        "Sectie toegevoegd voor het bijhouden en afvinken van de officiële graduaat stageleerdoelen bij Aertssen.",
      content: `### Leerdoelen & Competentiematrix

Vandaag een specifieke weergave gebouwd voor de stage-eindtermen:
- Doelen categoriseren op Technisch, Architectuur, Soft Skills en CI/CD.
- Status badges: Niet gestart, In uitvoering, Voltooid.
- Mogelijkheid om de voortgang per doel bij te werken met een progress bar slider.`,
      hoursWorked: 8.0,
      category: "Feature Development",
      mood: "productive",
      accomplishments: [
        "Doelen overzicht met progressie indicatoren",
        "Koppeling met de internship_goals databasetabel",
        "Direct bijwerken van status en voltooiingsdatum",
      ],
      skills: ["Drizzle ORM", "React Forms", "TypeScript"],
      challenges: "Duidelijke scheiding tussen dagelijkse taken en overkoepelende doelen.",
      learnings: "Doelgericht werken bevordert focus tijdens de stage.",
      mentorFeedback: "Ziet er zeer gestructureerd uit.",
      activityCount: 3,
      intensityLevel: 2,
    },
    {
      daysAgo: 13,
      title: "Detailweergave van Berichten & Markdown Opmaak",
      summary:
        "Elegante lezersweergave voor blogposts gemaakt met overzichtelijke secties voor prestaties, uitdagingen en mentor feedback.",
      content: `### Gedetailleerde Blogpost Weergave

Elke daglog kan nu in detail worden bekeken in een overzichtelijke leesmodus:
- Gestructureerde weergave van prestaties met checkmark bullet points.
- Aparte callout boxes voor 'Wat ging goed', 'Geleerde lessen' en 'Uitdagingen'.
- Badge voor stagementor feedback met datum en status.`,
      hoursWorked: 8.0,
      category: "Feature Development",
      mood: "satisfied",
      accomplishments: [
        "Modal en detailview voor individuele logboekberichten",
        "Visuele onderscheiding voor positieve leerervaringen vs blokkades",
        "Knoppen voor bewerken en exporteren",
      ],
      skills: ["Component Design", "UI/UX", "Tailwind CSS"],
      challenges: "Responsiviteit op kleinere schermen waar tabellen en lange lijsten breken.",
      learnings: "Gebruik van grid en flex wrap utilities in Tailwind.",
      mentorFeedback: "Fijn leesbaar formaat.",
      activityCount: 4,
      intensityLevel: 3,
    },
    {
      daysAgo: 10,
      title: "Dark Mode & Moderne Aertssen Theming",
      summary:
        "Ondersteuning voor donkere en lichte weergave toegevoegd, met professionele accentkleuren en strakke typografie.",
      content: `### Theming & Visuele Verfijning

De gebruikerservaring naar een hoger niveau getild:
- Subtiele donkere modus met hoog contrast en rustige slate tinten.
- Visuele status indicatoren (groen voor voltooide taken, oranje voor in uitvoering).
- Geoptimaliseerde typografie en spacing voor lange technische verslagen.`,
      hoursWorked: 7.5,
      category: "Feature Development",
      mood: "productive",
      accomplishments: [
        "CSS variables aangepast voor optimale dark/light balans",
        "Card borders en shadow-subtiliteiten gepolijst",
        "Hover effecten en transitions toegevoegd aan alle interactieve elementen",
      ],
      skills: ["CSS Variables", "Tailwind CSS v4", "Design Systems"],
      challenges: "Zorgen dat de heatmap kleuren in zowel light als dark mode duidelijk leesbaar blijven.",
      learnings: "Kleurcontrast standaarden (WCAG AA/AAA) toepassen in UI dashboards.",
      mentorFeedback: "Ziet er heel modern en professioneel uit.",
      activityCount: 3,
      intensityLevel: 2,
    },
    {
      daysAgo: 9,
      title: "PDF / Print Export Functie voor Stageverslag",
      summary:
        "Functie gebouwd om met één klik een formeel PDF / print-klaar stageverslag te genereren voor de graduaatsbeoordeling.",
      content: `### Export & Rapportage Functionaliteit

Om het logboek in te dienen voor de schoolbeoordeling:
- Print-geoptimaliseerde CSS (@media print) die navigatieknoppen verbergt en een nette pagina-indeling maakt.
- Samenvattend overzicht met gewerkte uren per week en lijst van behaalde leerdoelen.
- Handtekening/goedkeuringsveld voor de stagementor van Aertssen.`,
      hoursWorked: 8.5,
      category: "Feature Development",
      mood: "excited",
      accomplishments: [
        "Print stylesheet en export-knop toegevoegd",
        "Automatische generatie van samenvattingsblad met handtekeningregel",
        "PDF-preview getest in Chrome en Edge",
      ],
      skills: ["Print CSS", "Reporting", "PDF Generation", "Documentation"],
      challenges: "Pagina-overgangen (page-break-inside: avoid) correct instellen.",
      learnings: "Print media queries effectief toepassen in moderne webapplicaties.",
      mentorFeedback: "Dit bespaart ons veel tijd bij het opstellen van het eindrapport!",
      activityCount: 4,
      intensityLevel: 3,
    },
    {
      daysAgo: 8,
      title: "Database Indexen & Query Optimalisatie",
      summary:
        "Indexen toegevoegd op datumkolommen in SQLite en Drizzle queries geoptimaliseerd voor directe laadtijden.",
      content: `### Performance & Database Tuning

Optimalisaties doorgevoerd in de datalaag:
- Unieke indexen op \`date\` kolommen gecontroleerd.
- Snelle selecties met limieten en sorteringen op datum aflopend.
- Benchmarks uitgevoerd; querytijd onder 2ms voor alle dagelijkse logs en heatmap data.`,
      hoursWorked: 7.5,
      category: "Architecture & Planning",
      mood: "productive",
      accomplishments: [
        "Database indexering geanalyseerd met EXPLAIN QUERY PLAN",
        "Queryfuncties gemodulariseerd in herbruikbare data access helpers",
        "Laadtijden gemeten: sub-milliseconde respons op lokale SQLite",
      ],
      skills: ["SQLite Tuning", "Indexing", "Performance", "Drizzle ORM"],
      challenges: "LibSQL caching op warme versus koude starts meten.",
      learnings: "Het belang van B-tree indexering op datumreeksen bij tijdreeks-data.",
      mentorFeedback: "Fijn om te zien dat er ook aandacht is voor performance en schone code.",
      activityCount: 3,
      intensityLevel: 2,
    },
    {
      daysAgo: 7,
      title: "Tussentijdse Evaluatie met Stagementor",
      summary:
        "Eerste officiële tussentijdse evaluatiegesprek bij Aertssen. Het logboek gepresenteerd en positieve feedback ontvangen.",
      content: `### Tussentijdse Stage Evaluatie

Vandaag het tussentijdse evaluatiegesprek gehad met mijn stagementor bij Aertssen.

#### Besproken punten:
- Technische vooruitgang op het project: alle geplande features lopen voor op schema.
- Communicatie binnen het team en zelfstandigheid in probleemoplossing.
- Feedback op het logboek: stagementor was zeer te spreken over de overzichtelijke bijdrage-heatmap en de heldere dagverslagen.
- Doelen voor de tweede helft van de stage vastgesteld.`,
      hoursWorked: 8.0,
      category: "Meetings & Mentoring",
      mood: "excited",
      accomplishments: [
        "Tussentijdse evaluatie met vlag en wimpel behaald",
        "Logboek live gedemonstreerd aan teamleden",
        "Feedbackpunten verwerkt in de backlog",
      ],
      skills: ["Presentatie", "Communicatie", "Zelfreflectie", "Feedbackverwerking"],
      challenges: "Geen noemenswaardige obstakels; planning verloopt volgens schema.",
      learnings: "Regelmatige feedback loops voorkomen verrassingen bij eindbeoordelingen.",
      mentorFeedback:
        "Uitstekende prestaties tot nu toe. Zowel technisch als qua communicatie zeer tevreden.",
      activityCount: 3,
      intensityLevel: 2,
    },
    {
      daysAgo: 3,
      title: "Stageopdracht Integratie & E2E Testen",
      summary:
        "Integratietesten uitgevoerd op formulieren, validaties, heatmap klikacties en datapersistentie.",
      content: `### Integratie & Kwaliteitsborging

Grondige testronde uitgevoerd op de complete webapplicatie:
- Invoeren van logs met verschillende datums en validatie van invoervelden.
- Verificatie dat het heatmap raster accuraat update bij nieuwe invoer.
- Responsiviteit getest op mobiele resoluties en tablets.`,
      hoursWorked: 8.0,
      category: "Testing & QA",
      mood: "satisfied",
      accomplishments: [
        "Testscenario's opgesteld voor alle gebruikersstromen",
        "Input sanitatie en edge-case datums gevalideerd",
        "Zero warnings in TypeScript compilation",
      ],
      skills: ["Testing", "Quality Assurance", "Form Validation", "TypeScript"],
      challenges: "Zorgen voor soepele overgangen bij het openen en sluiten van modals.",
      learnings: "Robuuste foutafhandeling voorkomt onverwachte crashes.",
      mentorFeedback: "Goede focus op betrouwbaarheid.",
      activityCount: 4,
      intensityLevel: 3,
    },
    {
      daysAgo: 2,
      title: "Automatisering & CI/CD Pipeline Verkenning",
      summary:
        "Onderzoek gedaan naar geautomatiseerde linting, build checks en deployment opties voor het blog dashboard.",
      content: `### Build Processen & Linting

Vandaag het build-proces geoptimaliseerd:
- ESLint en TypeScript checks geïntegreerd in het project script.
- \`next build\` verificatie uitgevoerd; alle routes succesvol gepre-rendered.
- Documentatie bijgewerkt met instructies om lokaal te starten en de database te beheren.`,
      hoursWorked: 8.0,
      category: "DevOps & CI/CD",
      mood: "productive",
      accomplishments: [
        "Geautomatiseerde npm scripts voor build en database beheer",
        "README.md geactualiseerd met setup gids",
        "Productie-bundel geoptimaliseerd",
      ],
      skills: ["CI/CD", "Next.js Build", "ESLint", "Documentation"],
      challenges: "Optimaliseren van client-side bundles voor snellere interactietijden.",
      learnings: "Vroegtijdig builden voorkomt verrassingen vlak voor de oplevering.",
      mentorFeedback: "Strakke discipline qua codekwaliteit.",
      activityCount: 4,
      intensityLevel: 3,
    },
    {
      daysAgo: 1,
      title: "Finaliseren van de Stageblog & Documentatie",
      summary:
        "Puntjes op de i gezet voor het stage-logboek: visuele polish, statistieken controle en voorbereiding van de presentatie.",
      content: `### Afronding & Documentatie

De laatste hand gelegd aan de gebruikersinterface en het datamodel:
- Statistieken geverifieerd (gewerkte uren, voltooide taken, competenties).
- Handleiding voor de stagementor geschreven voor het toevoegen van beoordelingen.
- Volledige flow getest van aanmaken tot exporteren.`,
      hoursWorked: 8.5,
      category: "Feature Development",
      mood: "excited",
      accomplishments: [
        "Complete applicatie getest en gepolijst",
        "Documentatie voor mentor en schoolcomité geschreven",
        "Alle stagedagen accuraat in kaart gebracht in de heatmap",
      ],
      skills: ["Full-Stack Engineering", "Documentation", "Project Management"],
      challenges: "Geen; project bevindt zich in uitstekende staat.",
      learnings: "Trots op het resultaat: een volwaardig, modern logboekplatform.",
      mentorFeedback:
        "Indrukwekkend eindresultaat! Dit project dient als voorbeeld voor toekomstige stagiaires.",
      activityCount: 5,
      intensityLevel: 4,
    },
  ];

  console.log(`Inserting ${sampleLogs.length} daily logs and contribution records...`);

  for (const log of sampleLogs) {
    const logDate = format(subDays(today, log.daysAgo), "yyyy-MM-dd");

    const [insertedLog] = await db
      .insert(dailyLogs)
      .values({
        date: logDate,
        title: log.title,
        summary: log.summary,
        content: log.content,
        hoursWorked: log.hoursWorked,
        category: log.category,
        mood: log.mood,
        accomplishments: log.accomplishments,
        skills: log.skills,
        challenges: log.challenges,
        learnings: log.learnings,
        mentorFeedback: log.mentorFeedback,
        isPublished: true,
      })
      .returning();

    // Insert associated contribution heatmap record
    await db.insert(contributions).values({
      date: logDate,
      activityCount: log.activityCount,
      intensityLevel: log.intensityLevel,
      hoursLogged: log.hoursWorked,
      highlight: log.title,
      dailyLogId: insertedLog.id,
    });
  }

  // Also seed some lighter contribution days (e.g. minor tasks or review days) to give realistic heatmap variation
  const additionalContributionDays = [5, 6, 11, 12, 18, 19];
  for (const daysAgo of additionalContributionDays) {
    const contribDate = format(subDays(today, daysAgo), "yyyy-MM-dd");
    try {
      await db.insert(contributions).values({
        date: contribDate,
        activityCount: 1,
        intensityLevel: 1,
        hoursLogged: 4.0,
        highlight: "Zelfstudie & code review sessie",
      });
    } catch {
      // Ignore if exists
    }
  }

  console.log("✅ Seeding completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
