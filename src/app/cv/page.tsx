import { Suspense } from "react";
import { getInternshipStats, getInternshipGoals } from "@/lib/actions";
import { ResumeView } from "@/components/ResumeView";

export const metadata = {
  title: "Mijn CV & Stage Portfolio | Joeri L. - Aertssen NV",
  description:
    "Curriculum Vitae en overzicht van verworven technische vaardigheden, C#, Azure, Next.js, SQLite, Drizzle ORM en realisaties tijdens de stage bij Aertssen NV.",
};

export default async function CvPage() {
  const [stats, goals] = await Promise.all([
    getInternshipStats(),
    getInternshipGoals(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground text-sm animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Laden van CV en portfolio...
          </div>
        </div>
      }
    >
      <ResumeView stats={stats} goals={goals} />
    </Suspense>
  );
}
