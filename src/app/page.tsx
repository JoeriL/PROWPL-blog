import { Suspense } from "react";
import {
  getDailyLogs,
  getInternshipGoals,
  getInternshipStats,
} from "@/lib/actions";
import { LandingPage } from "@/components/LandingPage";

export const metadata = {
  title: "Welkom bij Aertssen Stage Logboek | Joeri L. - WPL 2026",
  description:
    "Persoonlijke introductie, overzicht van stageopdrachten bij Aertssen NV en dagelijks blog logboek voor het Graduaat Programmeren.",
};

export default async function Home() {
  const [logs, goals, stats] = await Promise.all([
    getDailyLogs(),
    getInternshipGoals(),
    getInternshipStats(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground text-sm animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Laden van landingspagina...
          </div>
        </div>
      }
    >
      <LandingPage
        stats={stats}
        goals={goals}
        recentLogs={logs}
      />
    </Suspense>
  );
}
