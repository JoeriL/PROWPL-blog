"use client";

import React, { useState, useMemo } from "react";
import { DailyLog, Contribution, InternshipGoal } from "@/db/schema";
import { InternshipStats } from "@/lib/types";
import { Header } from "./Header";
import { StatsCards } from "./StatsCards";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { GoalsSection } from "./GoalsSection";
import { LogList } from "./LogList";
import { LogDetailModal } from "./LogDetailModal";
import { LogFormModal } from "./LogFormModal";
import { InternshipReportModal } from "./InternshipReportModal";
import { deleteDailyLog } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface InternshipDashboardProps {
  initialLogs: DailyLog[];
  initialContributions: Contribution[];
  initialGoals: InternshipGoal[];
  initialStats: InternshipStats;
}

export function InternshipDashboard({
  initialLogs,
  initialContributions,
  initialGoals,
  initialStats,
}: InternshipDashboardProps) {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Extract all existing tags from logs dynamically
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    initialLogs.forEach((log) => {
      if (Array.isArray(log.skills)) {
        log.skills.forEach((s) => {
          if (typeof s === "string" && s.trim()) {
            set.add(s.trim());
          }
        });
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [initialLogs]);

  // Modals state
  const [viewingLog, setViewingLog] = useState<DailyLog | null>(null);
  const [editingLog, setEditingLog] = useState<DailyLog | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleNewLog = () => {
    setEditingLog(null);
    setIsFormOpen(true);
  };

  const handleEditLog = (log: DailyLog) => {
    setEditingLog(log);
    setIsFormOpen(true);
  };

  const handleDeleteLog = async (id: number) => {
    await deleteDailyLog(id);
    router.refresh();
  };

  const handleSaved = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-emerald-500/20 selection:text-emerald-500">
      <Header onNewLog={handleNewLog} onOpenReport={() => setIsReportOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1 w-full">
        {/* Key KPI Stats */}
        <StatsCards
          stats={initialStats}
          selectedSkill={selectedSkill}
          onSkillClick={(skill) => setSelectedSkill(selectedSkill === skill ? null : skill)}
        />

        {/* Contribution Heatmap */}
        <ContributionHeatmap
          contributions={initialContributions}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Goals & Competencies */}
        <GoalsSection goals={initialGoals} />

        {/* Daily Logs Feed */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Stage Logboekberichten
            </h2>
          </div>

          <LogList
            logs={initialLogs}
            selectedDate={selectedDate}
            onClearDateFilter={() => setSelectedDate(null)}
            selectedSkill={selectedSkill}
            onClearSkillFilter={() => setSelectedSkill(null)}
            onViewLog={(log) => setViewingLog(log)}
            onEditLog={handleEditLog}
            onDeleteLog={handleDeleteLog}
            onNewLog={handleNewLog}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground bg-card/40 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 PROWPL Stage Logboek • Aertssen NV Stage Portfolio</p>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>•</span>
            <Link href="/blog" className="hover:text-foreground transition-colors font-medium text-emerald-600">
              Stage Logboek
            </Link>
            <span>•</span>
            <Link href="/cv" className="hover:text-foreground transition-colors">
              Mijn CV
            </Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LogDetailModal
        log={viewingLog}
        onClose={() => setViewingLog(null)}
        onEdit={(log) => handleEditLog(log)}
      />

      <LogFormModal
        isOpen={isFormOpen}
        editingLog={editingLog}
        availableTags={availableTags}
        onClose={() => setIsFormOpen(false)}
        onSaved={handleSaved}
      />

      <InternshipReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        logs={initialLogs}
        goals={initialGoals}
        stats={initialStats}
      />
    </div>
  );
}
