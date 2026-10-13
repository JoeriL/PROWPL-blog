"use client";

import React, { useState, useMemo } from "react";
import { DailyLog } from "@/db/schema";
import {
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Tag,
  Edit2,
  Trash2,
  Eye,
  MessageSquare,
  Sparkles,
  ArrowUpDown,
  FilterX,
} from "lucide-react";
import { formatDateDutch, getCategoryBadge, getMoodBadge } from "@/lib/utils";
import { CategoryOption } from "@/lib/types";

interface LogListProps {
  logs: DailyLog[];
  selectedDate: string | null;
  onClearDateFilter: () => void;
  selectedSkill: string | null;
  onClearSkillFilter: () => void;
  onViewLog: (log: DailyLog) => void;
  onEditLog: (log: DailyLog) => void;
  onDeleteLog: (id: number) => void;
  onNewLog: () => void;
}

const CATEGORIES: CategoryOption[] = [
  "All",
  "Feature Development",
  "Architecture & Planning",
  "Onboarding",
  "Testing & QA",
  "DevOps & CI/CD",
  "Meetings & Mentoring",
  "Bug Fixing",
];

export function LogList({
  logs,
  selectedDate,
  onClearDateFilter,
  selectedSkill,
  onClearSkillFilter,
  onViewLog,
  onEditLog,
  onDeleteLog,
  onNewLog,
}: LogListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>("All");
  const [sortAsc, setSortAsc] = useState(false);

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        // Date filter
        if (selectedDate && log.date !== selectedDate) {
          return false;
        }

        // Skill filter
        if (selectedSkill) {
          const hasSkill = Array.isArray(log.skills) && log.skills.includes(selectedSkill);
          if (!hasSkill) return false;
        }

        // Category filter
        if (selectedCategory !== "All" && log.category !== selectedCategory) {
          return false;
        }

        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = log.title.toLowerCase().includes(q);
          const matchSummary = log.summary.toLowerCase().includes(q);
          const matchContent = log.content.toLowerCase().includes(q);
          const matchAccomplishments =
            Array.isArray(log.accomplishments) &&
            log.accomplishments.some((a) => a.toLowerCase().includes(q));
          const matchSkills =
            Array.isArray(log.skills) && log.skills.some((s) => s.toLowerCase().includes(q));

          return matchTitle || matchSummary || matchContent || matchAccomplishments || matchSkills;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortAsc) {
          return a.date.localeCompare(b.date);
        }
        return b.date.localeCompare(a.date);
      });
  }, [logs, selectedDate, selectedSkill, selectedCategory, searchTerm, sortAsc]);

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Zoek in dagverslagen, technologieën of prestaties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border/80 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Wis
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="flex items-center gap-1.5 px-3 py-2 bg-background border border-border/80 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer whitespace-nowrap"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortAsc ? "Oudste eerst" : "Nieuwste eerst"}</span>
            </button>

            {(selectedDate || selectedSkill || selectedCategory !== "All" || searchTerm) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  onClearDateFilter();
                  onClearSkillFilter();
                }}
                className="flex items-center gap-1 px-3 py-2 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl text-xs font-medium hover:bg-rose-500/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-background/80 hover:bg-muted/80 text-muted-foreground hover:text-foreground border-border/70"
                }`}
              >
                {cat === "All" ? "Alle Categorieën" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(selectedDate || selectedSkill) && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          {selectedDate && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Datum: {formatDateDutch(selectedDate)}</span>
              <button onClick={onClearDateFilter} className="ml-1 hover:text-emerald-800 cursor-pointer">
                ×
              </button>
            </div>
          )}

          {selectedSkill && (
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 px-2.5 py-1 rounded-md text-xs font-medium">
              <Tag className="w-3.5 h-3.5" />
              <span>Vaardigheid: {selectedSkill}</span>
              <button onClick={onClearSkillFilter} className="ml-1 hover:text-blue-800 cursor-pointer">
                ×
              </button>
            </div>
          )}
        </div>
      )}

      {/* Log Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>{filteredLogs.length} verslag(en) gevonden</span>
      </div>

      {/* Log Cards List */}
      {filteredLogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Geen dagverslagen gevonden</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            Er zijn geen verslagen die overeenkomen met je huidige zoekopdracht of datumfilters.
          </p>
          <button
            onClick={onNewLog}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <span>Nieuw Verslag Maken</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredLogs.map((log) => {
            const mood = getMoodBadge(log.mood);
            const cat = getCategoryBadge(log.category);
            const accomplishmentsList = Array.isArray(log.accomplishments)
              ? log.accomplishments
              : [];
            const skillsList = Array.isArray(log.skills) ? log.skills : [];

            return (
              <article
                key={log.id}
                className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md p-4 sm:p-5 shadow-xs hover:border-border hover:shadow-md transition-all group"
              >
                {/* Header row: Date, Category, Mood, Hours */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      {formatDateDutch(log.date)}
                    </span>

                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${cat.color}`}
                    >
                      {cat.label}
                    </span>

                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md border flex items-center gap-1 font-medium ${mood.color}`}
                    >
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/70">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      {log.hoursWorked} uur
                    </span>
                  </div>
                </div>

                {/* Title & Summary */}
                <div className="mb-3">
                  <h3
                    onClick={() => onViewLog(log)}
                    className="text-base sm:text-lg font-bold text-foreground hover:text-emerald-500 transition-colors cursor-pointer tracking-tight"
                  >
                    {log.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {log.summary}
                  </p>
                </div>

                {/* Key Accomplishments preview */}
                {accomplishmentsList.length > 0 && (
                  <div className="mb-3.5 p-3 rounded-xl bg-background/60 border border-border/50 space-y-1.5">
                    <div className="text-[11px] font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span>Belangrijkste Realisaties:</span>
                    </div>
                    <ul className="space-y-1">
                      {accomplishmentsList.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="text-xs text-foreground flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {accomplishmentsList.length > 3 && (
                        <li className="text-[11px] text-muted-foreground pl-5 italic">
                          + nog {accomplishmentsList.length - 3} andere prestaties...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Skills & Action Buttons footer */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border/40">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {skillsList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {log.mentorFeedback && (
                      <span
                        title="Stagementor heeft feedback toegevoegd"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-600 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20 mr-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Mentor Feedback</span>
                      </span>
                    )}

                    <button
                      onClick={() => onViewLog(log)}
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium border border-border/70 hover:bg-muted text-foreground transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Lees volledig verslag"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Lezen</span>
                    </button>

                    <button
                      onClick={() => onEditLog(log)}
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium border border-border/70 hover:bg-muted text-foreground transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Verslag bewerken"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      <span className="hidden sm:inline">Bewerken</span>
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Weet je zeker dat je het verslag van "${log.title}" wilt verwijderen?`
                          )
                        ) {
                          onDeleteLog(log.id);
                        }
                      }}
                      className="p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs font-medium border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-all flex items-center gap-1 cursor-pointer"
                      title="Verslag verwijderen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
