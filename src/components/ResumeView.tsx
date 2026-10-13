"use client";

import React from "react";
import Link from "next/link";
import { Header } from "./Header";
import {
  Printer,
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  Cloud,
  Workflow,
  Sparkles,
  Award,
  Calendar,
  Building2,
  MapPin,
} from "lucide-react";
import { InternshipStats } from "@/lib/types";
import { InternshipGoal } from "@/db/schema";

interface ResumeViewProps {
  stats: InternshipStats;
  goals: InternshipGoal[];
}

export function ResumeView({ stats, goals }: ResumeViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-emerald-500/20 selection:text-emerald-500">
      <Header />

      {/* Action Toolbar (Hidden during Print) */}
      <div className="border-b border-border/40 bg-muted/40 backdrop-blur-md py-3 px-4 sm:px-8 print:hidden sticky top-[69px] z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Print- & PDF-Klaar CV
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Afdrukken / Download als PDF</span>
          </button>
        </div>
      </div>

      {/* Main CV Container */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10 flex-1">
        <div className="bg-card border border-border/70 rounded-2xl p-6 sm:p-12 shadow-md print:shadow-none print:border-none print:p-0 print:bg-white print:text-black space-y-8">

          {/* Header & Personal Info */}
          <div className="border-b-2 border-emerald-600/80 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Curriculum Vitae & Stage Portfolio
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground print:text-black mt-0.5">
                Joeri L.
              </h1>
              <p className="text-sm sm:text-base font-semibold text-muted-foreground print:text-gray-700 mt-1">
                Full-Stack Software Developer • Graduaat Programmeren
              </p>
            </div>

            <div className="text-xs text-muted-foreground print:text-gray-600 space-y-1 sm:text-right">
              <div className="flex items-center sm:justify-end gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Stagebedrijf: <strong>Aertssen NV</strong></span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Antwerpen, België</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Stageperiode: Sept 2026 – Heden</span>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Professioneel Profiel & Samenvatting</span>
            </h2>
            <p className="text-xs sm:text-sm text-foreground/90 print:text-gray-900 leading-relaxed">
              Gemotiveerde en leergierige softwareontwikkelaar met een passie voor robuuste backend architecturen, cloud integraties en moderne full-stack webapplicaties.
              Tijdens mijn graduaatstage bij <strong>Aertssen NV</strong> focus ik op het automatiseren van datastromen, cloud resource management in Azure, en het ontwikkelen van performante gebruikersinterfaces.
              Ervaren in zowel het .NET-ecosysteem (C#, Entity Framework Core, Serverless Azure Functions) als de moderne JavaScript/TypeScript stack (Next.js, React, SQLite).
            </p>
          </section>

          {/* Key Internship Metrics (Badge row) */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 print:grid-cols-4">
            <div className="p-3 rounded-xl border border-border/60 bg-muted/30 print:bg-gray-50 print:border-gray-300 text-center">
              <span className="block text-[10px] text-muted-foreground print:text-gray-600 font-medium">Geregistreerde Uren</span>
              <span className="text-base sm:text-lg font-bold text-foreground print:text-black">{stats.totalHours} uur</span>
            </div>
            <div className="p-3 rounded-xl border border-border/60 bg-muted/30 print:bg-gray-50 print:border-gray-300 text-center">
              <span className="block text-[10px] text-muted-foreground print:text-gray-600 font-medium">Werkdagen Gedocumenteerd</span>
              <span className="text-base sm:text-lg font-bold text-foreground print:text-black">{stats.totalDays} dagen</span>
            </div>
            <div className="p-3 rounded-xl border border-border/60 bg-muted/30 print:bg-gray-50 print:border-gray-300 text-center">
              <span className="block text-[10px] text-muted-foreground print:text-gray-600 font-medium">Concrete Realisaties</span>
              <span className="text-base sm:text-lg font-bold text-foreground print:text-black">{stats.totalAccomplishments}+ mijlpalen</span>
            </div>
            <div className="p-3 rounded-xl border border-border/60 bg-muted/30 print:bg-gray-50 print:border-gray-300 text-center">
              <span className="block text-[10px] text-muted-foreground print:text-gray-600 font-medium">Stageopdrachten</span>
              <span className="text-base sm:text-lg font-bold text-foreground print:text-black">{stats.completedGoals} / {stats.totalGoals} voltooid</span>
            </div>
          </section>

          {/* Core Technical Skills Matrix */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Technische Vaardigheden & Technologieën</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Backend & Cloud */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/60 print:bg-transparent print:border-gray-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-foreground print:text-black">
                  <Cloud className="w-4 h-4 text-blue-500" />
                  <span>Backend & Cloud Architectuur</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "C#",
                    ".NET",
                    "Entity Framework Core",
                    "Azure Functions",
                    "Azure Logic Apps",
                    "Azure Resources",
                    "REST APIs",
                    "Serverless",
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Frontend & Web */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/60 print:bg-transparent print:border-gray-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-foreground print:text-black">
                  <Code2 className="w-4 h-4 text-emerald-500" />
                  <span>Frontend & Webontwikkeling</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Next.js 16 (App Router)",
                    "React 19",
                    "TypeScript",
                    "Tailwind CSS v4",
                    "Responsive UI/UX",
                    "Component Architecture",
                    "State Management",
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data & ORM */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/60 print:bg-transparent print:border-gray-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-foreground print:text-black">
                  <Database className="w-4 h-4 text-purple-500" />
                  <span>Databases & Datamodellering</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "SQLite",
                    "Drizzle ORM",
                    "Relational Modeling (M2M)",
                    "Database Migrations",
                    "Data Synchronization",
                    "Query Optimalisatie",
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tooling & DevOps */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/60 print:bg-transparent print:border-gray-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-foreground print:text-black">
                  <Workflow className="w-4 h-4 text-amber-500" />
                  <span>DevOps, Tooling & Methodologieën</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Git & GitHub",
                    "Azure DevOps",
                    "CI/CD Pipelines",
                    "NuGet Package Management",
                    "draw.io Diagramming",
                    "Agile / Scrum",
                    "Unit & Integration Testing",
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Internship Experience & Projects at Aertssen */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span>Stage-ervaring & Realisaties bij Aertssen NV</span>
              </h2>
              <span className="text-[11px] text-muted-foreground print:text-gray-600">
                Sept 2026 – Heden
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-xl border border-border/60 bg-background/40 print:bg-transparent print:border-gray-300 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-bold text-foreground print:text-black">
                      Software Engineering Stagiair (Werkplekleren WPL)
                    </h3>
                    <p className="text-xs text-muted-foreground print:text-gray-600">
                      Aertssen NV • Monitoring & Cloud Automation Platform
                    </p>
                  </div>
                  <span className="self-start sm:self-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
                    Actieve Stageopdracht
                  </span>
                </div>

                <div className="space-y-2 text-foreground/90 print:text-gray-900 leading-relaxed">
                  <p>
                    Verantwoordelijk voor de uitbreiding en automatisering van interne monitoring tools en cloud infrastructuurkoppelingen:
                  </p>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="p-2.5 rounded-lg border border-border/50 bg-muted/20 print:border-gray-200 print:bg-gray-50 flex items-start gap-2.5"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 mt-0.5 shrink-0 ${goal.status === "completed" ? "text-emerald-500" : "text-blue-500"
                            }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-foreground print:text-black">
                              {goal.title}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${goal.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-blue-500/10 text-blue-600"
                                }`}
                            >
                              {goal.status === "completed" ? "Voltooid" : `${goal.progress}%`}
                            </span>
                          </div>
                          {goal.description && (
                            <p className="text-[11px] text-muted-foreground print:text-gray-600 mt-0.5">
                              {goal.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>Opleiding & Kennisbasis</span>
            </h2>

            <div className="p-3.5 rounded-xl border border-border/60 bg-background/40 print:bg-transparent print:border-gray-300 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground print:text-black">
                  Graduaat Programmeren (WPL - Werkplekleren)
                </span>
                <span className="text-muted-foreground print:text-gray-600">2024 – 2026</span>
              </div>
              <p className="text-muted-foreground print:text-gray-700">
                Hogeschool Opleidingstraining • Focus op praktijkgericht softwareontwikkeling, webapplicaties, databases en teamprojecten.
              </p>
            </div>
          </section>

          {/* Sign-off & Verification footer for future job applications / school defense */}
          <div className="pt-6 border-t border-border/60 print:border-gray-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-muted-foreground print:text-gray-600">
            <div>
              <p className="font-medium text-foreground print:text-black">
                Geverifieerd via PROWPL Stage Blog Platform
              </p>
              <p>Alle verslagen en git-commits zijn digitaal geregistreerd.</p>
            </div>
            <div className="text-left sm:text-right">
              <p>Handtekening / Goedkeuring Stagementor Aertssen NV:</p>
              <div className="mt-2 border-b border-border/80 print:border-gray-400 w-48 h-4"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground bg-card/40 print:hidden mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Joeri L. • Aertssen NV Stage Portfolio & CV</p>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>•</span>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Stage Logboek
            </Link>
            <span>•</span>
            <Link href="/cv" className="hover:text-foreground transition-colors">
              Mijn CV
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
