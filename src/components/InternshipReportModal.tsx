"use client";

import React from "react";
import { DailyLog, InternshipGoal } from "@/db/schema";
import { InternshipStats } from "@/lib/types";
import { X, Printer, CheckCircle2, Award, Building2 } from "lucide-react";
import { formatDateDutch } from "@/lib/utils";

interface InternshipReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: DailyLog[];
  goals: InternshipGoal[];
  stats: InternshipStats;
}

export function InternshipReportModal({
  isOpen,
  onClose,
  logs,
  goals,
  stats,
}: InternshipReportModalProps) {
  const [printDate, setPrintDate] = React.useState("");

  React.useEffect(() => {
    setPrintDate(new Date().toLocaleDateString("nl-NL"));
  }, []);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="p-4 border-b border-border/60 flex items-center justify-between bg-muted/20 print:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-foreground">
              Officieel Stageverslag & Portfolio Preview
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Afdrukken / Opslaan als PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-foreground bg-card print:bg-white print:text-black print:p-0 print:overflow-visible">
          {/* Header */}
          <div className="border-b-2 border-emerald-600 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Graduaat Programmeren • Stage-logboek Portfolio
              </span>
              <h1 className="text-2xl font-black tracking-tight text-foreground print:text-black">
                Aertssen Stage Logboek & Prestaties
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Officieel overzicht van dagelijkse activiteiten, competenties en gerealiseerde uren.
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground print:text-gray-600">
              <p className="font-semibold text-foreground print:text-black">Stagebedrijf: Aertssen</p>
              <p>Project: PROWPL-blog & Web Platform</p>
              <p>Afdrukdatum: {printDate}</p>
            </div>
          </div>

          {/* Key Metrics Summary Cards */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
              <span className="block text-[11px] text-muted-foreground">Totaal Uren</span>
              <span className="text-lg font-bold text-foreground print:text-black">
                {stats.totalHours} uur
              </span>
            </div>
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
              <span className="block text-[11px] text-muted-foreground">Stagedagen</span>
              <span className="text-lg font-bold text-foreground print:text-black">
                {stats.totalDays} dagen
              </span>
            </div>
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
              <span className="block text-[11px] text-muted-foreground">Realisaties</span>
              <span className="text-lg font-bold text-foreground print:text-black">
                {stats.totalAccomplishments}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
              <span className="block text-[11px] text-muted-foreground">Behaalde Doelen</span>
              <span className="text-lg font-bold text-foreground print:text-black">
                {stats.completedGoals} / {stats.totalGoals}
              </span>
            </div>
          </div>

          {/* Goals & Competencies Checklist */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground print:text-black flex items-center gap-1.5 uppercase tracking-wide">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Verworven Competenties & Eindtermen</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className="p-2.5 rounded-lg border border-border/50 bg-background/50 flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-foreground print:text-black block">
                      {g.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">{g.category}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      g.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    {g.status === "completed" ? "Behaald" : `${g.progress}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Log Entries Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground print:text-black uppercase tracking-wide">
              Chronologisch Overzicht van Werkdagen
            </h3>
            <div className="border border-border/60 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-[11px] font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="p-2.5">Datum</th>
                    <th className="p-2.5">Uren</th>
                    <th className="p-2.5">Categorie</th>
                    <th className="p-2.5">Onderwerp & Realisaties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/10">
                      <td className="p-2.5 font-medium whitespace-nowrap align-top">{log.date}</td>
                      <td className="p-2.5 whitespace-nowrap align-top">{log.hoursWorked} u</td>
                      <td className="p-2.5 whitespace-nowrap align-top text-muted-foreground">
                        {log.category}
                      </td>
                      <td className="p-2.5 align-top">
                        <div className="font-semibold text-foreground print:text-black">
                          {log.title}
                        </div>
                        <div className="text-muted-foreground text-[11px] mt-0.5 line-clamp-1">
                          {log.summary}
                        </div>
                        {Array.isArray(log.accomplishments) && log.accomplishments.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {log.accomplishments.map((acc, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1.5 text-[11px] text-foreground/90"
                              >
                                <span className="text-emerald-500">•</span>
                                <span>{acc}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures Block for Internship Mentors */}
          <div className="pt-8 border-t border-border/60 grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-8">
              <p className="font-semibold text-foreground print:text-black">
                Handtekening Stagiair:
              </p>
              <div className="border-b border-border/80 w-3/4"></div>
              <p className="text-muted-foreground">Datum: ____________________</p>
            </div>

            <div className="space-y-8">
              <p className="font-semibold text-foreground print:text-black">
                Handtekening Stagementor Aertssen:
              </p>
              <div className="border-b border-border/80 w-3/4"></div>
              <p className="text-muted-foreground">Datum: ____________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
