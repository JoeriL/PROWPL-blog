import { Suspense } from "react";
import {
  getDailyLogs,
  getContributions,
  getInternshipGoals,
  getInternshipStats,
} from "@/lib/actions";
import { InternshipDashboard } from "@/components/InternshipDashboard";

export default async function Home() {
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
          <div className="text-muted-foreground text-sm animate-pulse">
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
