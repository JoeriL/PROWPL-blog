"use client";

import React from "react";
import { Plus, FileText, Sparkles, BookOpen } from "lucide-react";

interface HeaderProps {
  onNewLog: () => void;
  onOpenReport: () => void;
}

export function Header({ onNewLog, onOpenReport }: HeaderProps) {
  return (
    <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  Aertssen Stage Logboek
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium border border-emerald-500/20">
                    Graduaat 2026
                  </span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                PROWPL Accomplishments Tracker • Full-Stack Development Log
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenReport}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border border-border/80 bg-background/80 hover:bg-accent hover:text-accent-foreground text-foreground transition-all shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Stageverslag Exporteren</span>
            </button>

            <button
              onClick={onNewLog}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nieuw Dagverslag</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
