"use client";

import React from "react";
import { DailyLog } from "@/db/schema";
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  MessageSquare,
  Tag,
  Edit2,
  Share2,
} from "lucide-react";
import { formatDateDutch, getCategoryBadge, getMoodBadge } from "@/lib/utils";

interface LogDetailModalProps {
  log: DailyLog | null;
  onClose: () => void;
  onEdit: (log: DailyLog) => void;
}

export function LogDetailModal({ log, onClose, onEdit }: LogDetailModalProps) {
  if (!log) return null;

  const mood = getMoodBadge(log.mood);
  const cat = getCategoryBadge(log.category);
  const accomplishments = Array.isArray(log.accomplishments) ? log.accomplishments : [];
  const skills = Array.isArray(log.skills) ? log.skills : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-border/60 flex items-start justify-between gap-3 bg-muted/20">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-background px-2.5 py-1 rounded-md border border-border/60">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                {formatDateDutch(log.date)}
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${cat.color}`}>
                {cat.label}
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-md border flex items-center gap-1 font-medium ${mood.color}`}
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-background px-2 py-0.5 rounded-md border border-border/60">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {log.hoursWorked} uur
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {log.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Summary */}
          <div className="p-3.5 rounded-xl bg-background border border-border/60">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Beknopte Samenvatting
            </h4>
            <p className="text-foreground leading-relaxed">{log.summary}</p>
          </div>

          {/* Accomplishments */}
          {accomplishments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Concrete Realisaties & Mijlpalen</span>
              </h4>
              <div className="space-y-1.5 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                {accomplishments.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Content */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Uitgebreid Logboekverslag
            </h4>
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-xl bg-background border border-border/60 whitespace-pre-wrap font-sans leading-relaxed text-foreground/90">
              {log.content}
            </div>
          </div>

          {/* Learnings & Challenges Grid */}
          {(log.learnings || log.challenges) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {log.learnings && (
                <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Geleerde Lessen & Inzichten</span>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed">{log.learnings}</p>
                </div>
              )}

              {log.challenges && (
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Uitdagingen & Oplossingen</span>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed">{log.challenges}</p>
                </div>
              )}
            </div>
          )}

          {/* Mentor Feedback */}
          {log.mentorFeedback && (
            <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Stagementor Feedback (Aertssen)</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed italic">
                &ldquo;{log.mentorFeedback}&rdquo;
              </p>
            </div>
          )}

          {/* Skills / Tags */}
          {skills.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Gebruikte Vaardigheden & Technologieën</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-muted/60 text-foreground border border-border/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onEdit(log);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted text-foreground transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Verslag Bewerken</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-foreground text-background hover:opacity-90 transition-all cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}
