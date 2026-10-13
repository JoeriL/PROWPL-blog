"use client";

import React from "react";
import Link from "next/link";
import { Header } from "./Header";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Sparkles,
  Clock,
  CalendarCheck,
  Award,
  Target,
  CheckCircle2,
  Code2,
  Cloud,
  Database,
  Building2,
  Layers,
  Terminal,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { DailyLog, InternshipGoal } from "@/db/schema";
import { InternshipStats } from "@/lib/types";
import { formatDateDutch } from "@/lib/utils";

interface LandingPageProps {
  stats: InternshipStats;
  goals: InternshipGoal[];
  recentLogs: DailyLog[];
}

export function LandingPage({ stats, goals, recentLogs }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-emerald-500/20 selection:text-emerald-500">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 via-background to-background py-16 sm:py-24">
          {/* Subtle Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Graduaat Programmeren • WPL Stage 2026</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
                Welkom op mijn Stage Logboek bij{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  Aertssen
                </span>
              </h1>

              {/* Personal Intro */}
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Hallo! Ik ben <strong>Joeri</strong>, stagiair Software Engineering bij{" "}
                <strong>Aertssen NV</strong>. Op dit platform documenteer ik dagelijks mijn
                werkzaamheden, de technische uitdagingen die ik tegenkom, en mijn verworven
                competenties binnen het enterprise IT-landschap.
              </p>

              {/* Prominent Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <Link
                  href="/blog"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer group"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Lees de Blog & Bekijk Logboek</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/cv"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold border border-border/80 bg-card/60 hover:bg-muted text-foreground transition-all cursor-pointer shadow-xs"
                >
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span>Bekijk Mijn CV & Skills</span>
                </Link>
              </div>

              {/* Company Note */}
              <div className="pt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Stagebedrijf: Aertssen NV • Software & Monitoring Team</span>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE STATS HIGHLIGHT BAR */}
        <section className="border-b border-border/40 bg-card/40 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl">
                <span className="block text-2xl sm:text-3xl font-black text-foreground">
                  {stats.totalHours} u
                </span>
                <span className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Totaal Stage-uren
                </span>
              </div>

              <div className="p-3 rounded-xl">
                <span className="block text-2xl sm:text-3xl font-black text-foreground">
                  {stats.totalDays}
                </span>
                <span className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Dagen Gedocumenteerd
                </span>
              </div>

              <div className="p-3 rounded-xl">
                <span className="block text-2xl sm:text-3xl font-black text-foreground">
                  {stats.totalAccomplishments}+
                </span>
                <span className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Behaalde Mijlpalen
                </span>
              </div>

              <div className="p-3 rounded-xl">
                <span className="block text-2xl sm:text-3xl font-black text-foreground">
                  {goals.length}
                </span>
                <span className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                  <Target className="w-3.5 h-3.5 text-purple-500" />
                  Stageopdrachten
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PURPOSE OF THE BLOG (WAAROM DEZE BLOG?) */}
        <section className="py-14 sm:py-20 border-b border-border/40 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Transparantie & Reflectie
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Waarom dit Stage Logboek?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Een digitaal platform dat verder gaat dan een traditioneel verslagboek.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs space-y-3 hover:border-border transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Continue Voortgang & Transparantie
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Zowel mijn stagementor bij Aertssen als de hogeschool stagebegeleiders kunnen te
                  allen tijde de dagelijkse vooruitgang, gewerkte uren en behandelde taken inzien.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs space-y-3 hover:border-border transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Zelfreflectie & Leerervaringen
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Elk verslag bevat concrete realisaties, overwonnen uitdagingen en reflecties. Dit
                  stimuleert doelgericht leren en helpt technische inzichten te borgen.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs space-y-3 hover:border-border transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Professioneel Afstudeerportfolio
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dient als basis voor mijn eindrapport en mondelinge verdediging, compleet met een
                  GitHub-achtige heatmap, competentiematrix en exporteerbare rapportages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OVER AERTSSEN & MIJN OPDRACHTEN */}
        <section className="py-14 sm:py-20 border-b border-border/40 bg-card/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Projecten & Scope
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Mijn Stageopdrachten bij Aertssen NV
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Binnen het Monitoring project werk ik aan vier kernopdrachten ter ondersteuning van
                  het development en infrastructuur team.
                </p>
              </div>

              <div className="space-y-3">
                {goals.map((goal, idx) => (
                  <div
                    key={goal.id}
                    className="p-4 sm:p-5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xs hover:border-border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-600">
                          Opdracht {idx + 1}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-md bg-muted text-muted-foreground border border-border/60">
                          {goal.category}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                          {goal.description}
                        </p>
                      )}
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                          goal.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : goal.status === "in_progress"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-muted text-muted-foreground border-border/60"
                        }`}
                      >
                        {goal.status === "completed" ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Voltooid (100%)</span>
                          </>
                        ) : goal.status === "in_progress" ? (
                          <>
                            <span>In Uitvoering ({goal.progress}%)</span>
                          </>
                        ) : (
                          <span>Gepland (0%)</span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CORE TECH STACK */}
        <section className="py-14 sm:py-20 border-b border-border/40 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Skills & Ecosysteem
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Gebruikte Technologieën
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tijdens de stage combineer ik enterprise .NET en Azure met moderne full-stack webtechnologieën.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              {[
                { name: "C# / .NET", desc: "Backend & DTOs", icon: Code2, color: "text-purple-500" },
                { name: "Azure Cloud", desc: "Functions & LogicApps", icon: Cloud, color: "text-blue-500" },
                { name: "EF Core", desc: "Database Sync", icon: Database, color: "text-amber-500" },
                { name: "Next.js 16", desc: "App Router & SSR", icon: Sparkles, color: "text-emerald-500" },
                { name: "TypeScript", desc: "Strict Type Safety", icon: Code2, color: "text-cyan-500" },
                { name: "Drizzle & SQLite", desc: "Local Persistence", icon: Database, color: "text-rose-500" },
              ].map((tech) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="p-4 rounded-xl border border-border/60 bg-card/50 hover:border-border transition-all"
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${tech.color}`} />
                    <span className="block text-xs font-bold text-foreground">{tech.name}</span>
                    <span className="text-[10px] text-muted-foreground">{tech.desc}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-6">
              <Link
                href="/cv"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                <span>Bekijk de volledige vaardighedenmatrix op mijn CV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* RECENT BLOG POSTS PREVIEW */}
        {recentLogs.length > 0 && (
          <section className="py-14 sm:py-20 border-b border-border/40 bg-card/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Recente Updates
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                    Laatste Dagverslagen
                  </h2>
                </div>

                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors self-start sm:self-auto"
                >
                  <span>Bekijk alle verslagen in de blog</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentLogs.slice(0, 3).map((log) => (
                  <Link
                    key={log.id}
                    href={`/blog`}
                    className="p-5 rounded-2xl border border-border/60 bg-card/70 hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">{formatDateDutch(log.date)}</span>
                        <span>{log.hoursWorked} uur</span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-emerald-500 transition-colors line-clamp-1">
                        {log.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {log.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                        {log.category}
                      </span>
                      <span className="text-emerald-600 font-medium group-hover:translate-x-0.5 transition-transform">
                        Lezen →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BOTTOM FINAL CALL TO ACTION */}
        <section className="py-16 sm:py-20 bg-gradient-to-tr from-emerald-950/20 via-background to-background text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Klaar om alle dagverslagen en de interactieve heatmap te bekijken?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Duik in de volledige tijdlijn van mijn stage bij Aertssen NV, filter op datum of vaardigheid,
              en ontdek de details van elk verslag.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Naar het Stage Logboek</span>
              </Link>
              <Link
                href="/cv"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all"
              >
                <Briefcase className="w-4 h-4 text-emerald-500" />
                <span>Mijn CV Bekijken</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground bg-card/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="font-bold text-foreground">Aertssen NV Stage Logboek</p>
            <p className="text-[11px] text-muted-foreground">
              Graduaat Programmeren • Werkplekleren (WPL) 2026
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors font-medium">
              Stage Logboek
            </Link>
            <Link href="/cv" className="hover:text-foreground transition-colors font-medium">
              Mijn CV
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
