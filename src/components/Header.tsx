"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, FileText, BookOpen, Home, User, Briefcase } from "lucide-react";

interface HeaderProps {
  onNewLog?: () => void;
  onOpenReport?: () => void;
}

export function Header({ onNewLog, onOpenReport }: HeaderProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isBlog = pathname === "/blog";
  const isCv = pathname === "/cv";

  const hasActions = Boolean(onNewLog || onOpenReport);

  return (
    <header className="border-b border-border/40 bg-card/70 backdrop-blur-md sticky top-0 z-40 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-emerald-500 transition-colors">
                    Aertssen Stage
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
                    WPL 2026
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Graduaat Programmeren • Portfolio & Logboek
                </p>
              </div>
            </Link>

            {/* Mobile Nav Links */}
            <div className="flex md:hidden items-center gap-1">
              <Link
                href="/"
                className={`p-2 rounded-lg text-xs font-medium ${
                  isHome ? "bg-emerald-500/10 text-emerald-600" : "text-muted-foreground"
                }`}
                title="Home"
              >
                <Home className="w-4 h-4" />
              </Link>
              <Link
                href="/blog"
                className={`p-2 rounded-lg text-xs font-medium ${
                  isBlog ? "bg-emerald-500/10 text-emerald-600" : "text-muted-foreground"
                }`}
                title="Blog"
              >
                <BookOpen className="w-4 h-4" />
              </Link>
              <Link
                href="/cv"
                className={`p-2 rounded-lg text-xs font-medium ${
                  isCv ? "bg-emerald-500/10 text-emerald-600" : "text-muted-foreground"
                }`}
                title="CV"
              >
                <User className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Navigation Links & Actions */}
          <div
            className={`items-center justify-end gap-3 sm:gap-4 ${
              hasActions ? "flex" : "hidden md:flex"
            }`}
          >
            {/* Contextual Action Buttons (e.g. on /blog) */}
            {hasActions && (
              <div className="flex items-center gap-2">
                {onOpenReport && (
                  <button
                    onClick={onOpenReport}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/80 bg-background/80 hover:bg-accent hover:text-accent-foreground text-foreground transition-all shadow-xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Rapport Exporteren</span>
                    <span className="sm:hidden">Export</span>
                  </button>
                )}

                {onNewLog && (
                  <button
                    onClick={onNewLog}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nieuw Verslag</span>
                  </button>
                )}
              </div>
            )}

            {/* Desktop Navigation - Anchored consistently on the far right */}
            <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50 text-xs font-medium">
              <Link
                href="/"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isHome
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Home className="w-3.5 h-3.5 text-emerald-500" />
                <span>Home</span>
              </Link>

              <Link
                href="/blog"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isBlog
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>Stage Logboek</span>
              </Link>

              <Link
                href="/cv"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isCv
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mijn CV & Skills</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
