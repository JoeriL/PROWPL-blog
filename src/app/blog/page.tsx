import { Suspense } from "react";
import {
  getDailyLogs,
  getContributions,
  getInternshipGoals,
  getInternshipStats,
} from "@/lib/actions";
import { InternshipDashboard } from "@/components/InternshipDashboard";

export const metadata = {
  title: "Stage Logboek & Dagverslagen | Aertssen NV",
  description:
    "Volledig dagelijks logboek, interactieve bijdrage-heatmap en realisaties van mijn graduaat stage bij Aertssen.",
};

export default async function BlogPage() {
  const [logs, contributions, goals, stats] = await Promise.all([
    getDailyLogs(),
    getContributions(),
    getInternshipGoals(),
    getInternshipStats(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground text-sm animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Laden van stage logboek en bijdragen...
          </div>
        </div>
      }
    >
      <InternshipDashboard
        initialLogs={logs}
        initialContributions={contributions}
        initialGoals={goals}
        initialStats={stats}
      />
    </Suspense>
  );
}
