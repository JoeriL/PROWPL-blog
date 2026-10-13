"use client";

import React, { useMemo, useState, useRef } from "react";
import { Contribution } from "@/db/schema";
import { addDays, parseISO, isValid, startOfWeek, startOfMonth } from "date-fns";
import { Calendar, Filter, Sparkles, X } from "lucide-react";
import { formatDateDutch } from "@/lib/utils";

interface ContributionHeatmapProps {
  contributions: Contribution[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const MONTHS_NL = [
  "Jan",
  "Feb",
  "Mrt",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dec",
];

export function ContributionHeatmap({
  contributions,
  selectedDate,
  onSelectDate,
}: ContributionHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentDate] = useState<Date>(() => new Date());

  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    activityCount: number;
    hoursLogged: number;
    highlight?: string | null;
    isFuture: boolean;
    x: number;
    y: number;
  } | null>(null);

  // Map contributions by date (YYYY-MM-DD)
  const contribMap = useMemo(() => {
    const map = new Map<string, Contribution>();
    contributions.forEach((c) => {
      map.set(c.date, c);
    });
    return map;
  }, [contributions]);

  // Generate grid spanning the internship semester (18 weeks starting at the first month of internship)
  const { weeks, totalActivities } = useMemo(() => {
    const today = currentDate || new Date("2026-10-13T12:00:00Z");

    // Find earliest contribution date or default to current date
    let earliestDate = today;
    contributions.forEach((c) => {
      if (c.date) {
        const parsed = parseISO(c.date);
        if (isValid(parsed) && parsed < earliestDate) {
          earliestDate = parsed;
        }
      }
    });

    // Start grid at Monday of the week of the 1st of that earliest month (e.g. Sept 1)
    const startOfGrid = startOfWeek(startOfMonth(earliestDate), { weekStartsOn: 1 });
    const numWeeks = 18; // Cleanly spans full internship semester (Sep -> Jan)

    const generatedWeeks: Array<{
      weekIndex: number;
      weekStart: Date;
      monthLabel: string | null;
      days: Array<{
        date: string;
        dateObj: Date;
        dayOfWeek: number;
        intensity: number;
        activityCount: number;
        hoursLogged: number;
        highlight?: string | null;
        isFuture: boolean;
      }>;
    }> = [];

    let totalActs = 0;
    let lastMonthDisplayed = -1;

    for (let w = 0; w < numWeeks; w++) {
      const weekStartDate = addDays(startOfGrid, w * 7);
      const weekDays = [];
      let monthLabelForWeek: string | null = null;

      // Check if a new month starts in this week (day-of-month is 1)
      for (let d = 0; d < 7; d++) {
        const curDate = addDays(weekStartDate, d);
        if (curDate.getDate() === 1) {
          const m = curDate.getMonth();
          if (m !== lastMonthDisplayed) {
            monthLabelForWeek = MONTHS_NL[m];
            lastMonthDisplayed = m;
          }
          break;
        }
      }

      // If week 0 and no 1st of month was found, use the predominant month of week 0
      if (w === 0 && !monthLabelForWeek) {
        const midWeekMonth = addDays(weekStartDate, 3).getMonth();
        monthLabelForWeek = MONTHS_NL[midWeekMonth];
        lastMonthDisplayed = midWeekMonth;
      }

      for (let d = 0; d < 7; d++) {
        const dayDate = addDays(weekStartDate, d);
        const yyyy = dayDate.getFullYear();
        const mm = String(dayDate.getMonth() + 1).padStart(2, "0");
        const dd = String(dayDate.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;

        // Future if strictly after today (comparing midnight to midnight)
        const isFuture =
          new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate()) >
          new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const contrib = contribMap.get(dateStr);
        const activityCount = contrib?.activityCount || 0;
        const intensity = contrib?.intensityLevel || (activityCount > 0 ? 1 : 0);
        const hoursLogged = contrib?.hoursLogged || 0;
        const highlight = contrib?.highlight || null;

        totalActs += activityCount;

        weekDays.push({
          date: dateStr,
          dateObj: dayDate,
          dayOfWeek: d, // 0 = Mon, 6 = Sun
          intensity: isFuture ? 0 : intensity,
          activityCount,
          hoursLogged,
          highlight,
          isFuture,
        });
      }

      generatedWeeks.push({
        weekIndex: w,
        weekStart: weekStartDate,
        monthLabel: monthLabelForWeek,
        days: weekDays,
      });
    }

    return { weeks: generatedWeeks, totalActivities: totalActs };
  }, [contribMap, currentDate, contributions]);

  // Color mapping based on intensity level (0 to 4)
  const getCellClasses = (intensity: number, isSelected: boolean, isFuture: boolean) => {
    if (isFuture) {
      return "bg-muted/15 border-border/20 cursor-not-allowed opacity-35";
    }

    let base = "transition-all duration-150 cursor-pointer rounded-[3px] border ";

    if (isSelected) {
      base += "ring-2 ring-emerald-500 ring-offset-1 z-10 ";
    }

    switch (intensity) {
      case 4:
        return base + "bg-emerald-600 hover:bg-emerald-500 border-emerald-700 text-white";
      case 3:
        return base + "bg-emerald-500 hover:bg-emerald-400 border-emerald-600 text-white";
      case 2:
        return base + "bg-emerald-400/80 dark:bg-emerald-600/70 hover:bg-emerald-400 border-emerald-400 text-white";
      case 1:
        return base + "bg-emerald-200 dark:bg-emerald-900/60 hover:bg-emerald-300 dark:hover:bg-emerald-800 border-emerald-300 dark:border-emerald-800";
      case 0:
      default:
        return base + "bg-muted/40 hover:bg-muted/80 border-border/40 hover:border-border";
    }
  };

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md p-4 sm:p-5 shadow-xs relative"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Stage Activiteit & Bijdragen Heatmap
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalActivities} activiteiten geregistreerd tijdens de stageperiode
          </p>
        </div>

        {selectedDate && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs text-emerald-600 font-medium self-start sm:self-auto">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter actief: {formatDateDutch(selectedDate)}</span>
            <button
              onClick={() => onSelectDate(null)}
              className="hover:text-emerald-800 p-0.5 ml-1 cursor-pointer"
              title="Filter wissen"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          <div className="flex gap-1 sm:gap-1.5">
            {/* Day of Week Labels Column (Mon, Wed, Fri) */}
            <div className="w-6 shrink-0 flex flex-col select-none">
              <div className="h-5" /> {/* Spacer matching Month Header height */}
              <div className="flex flex-col justify-between h-[104px] sm:h-[116px] text-[10px] text-muted-foreground py-0.5">
                <span>Ma</span>
                <span>Wo</span>
                <span>Vr</span>
                <span className="opacity-0">Zo</span>
              </div>
            </div>

            {/* Weeks Columns with Month Header directly integrated into each column */}
            {weeks.map((week) => (
              <div
                key={week.weekIndex}
                className="w-3.5 sm:w-4 shrink-0 flex flex-col gap-1 sm:gap-1.5"
              >
                {/* Month Label Cell directly above this specific week */}
                <div className="h-5 relative">
                  {week.monthLabel && (
                    <span className="absolute left-0 top-0 text-[11px] font-semibold text-muted-foreground whitespace-nowrap select-none pointer-events-none">
                      {week.monthLabel}
                    </span>
                  )}
                </div>

                {/* 7 Days (Mon -> Sun) */}
                {week.days.map((day) => {
                  const isSelected = selectedDate === day.date;
                  return (
                    <button
                      key={day.date}
                      disabled={day.isFuture}
                      onClick={() => {
                        if (day.isFuture) return;
                        onSelectDate(isSelected ? null : day.date);
                      }}
                      onMouseEnter={(e) => {
                        if (!containerRef.current) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const containerRect = containerRef.current.getBoundingClientRect();
                        setHoveredCell({
                          date: day.date,
                          activityCount: day.activityCount,
                          hoursLogged: day.hoursLogged,
                          highlight: day.highlight,
                          isFuture: day.isFuture,
                          x: rect.left - containerRect.left + rect.width / 2,
                          y: rect.top - containerRect.top,
                        });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${getCellClasses(
                        day.intensity,
                        isSelected,
                        day.isFuture
                      )}`}
                      aria-label={`Datum: ${day.date}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer Legend */}
          <div className="flex items-center justify-between mt-4 text-[11px] text-muted-foreground pt-3 border-t border-border/40">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Klik op een cel om direct naar het bijbehorende verslag te filteren</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Minder</span>
              <div className="w-3 h-3 rounded-[2px] bg-muted/40 border border-border/40" />
              <div className="w-3 h-3 rounded-[2px] bg-emerald-200 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800" />
              <div className="w-3 h-3 rounded-[2px] bg-emerald-400/80 dark:bg-emerald-600/70 border border-emerald-400" />
              <div className="w-3 h-3 rounded-[2px] bg-emerald-500 border border-emerald-600" />
              <div className="w-3 h-3 rounded-[2px] bg-emerald-600 border border-emerald-700" />
              <span>Meer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredCell && (
        <div
          className="absolute pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-2 bg-popover/95 backdrop-blur-md text-popover-foreground border border-border shadow-xl rounded-lg px-3 py-2 text-xs max-w-xs transition-opacity duration-150"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y - 8}px`,
          }}
        >
          <div className="font-semibold text-foreground">
            {formatDateDutch(hoveredCell.date)}
          </div>
          <div className="text-muted-foreground flex items-center gap-2 mt-0.5">
            {hoveredCell.isFuture ? (
              <span className="italic">Toekomstige stagedag</span>
            ) : hoveredCell.activityCount > 0 ? (
              <span>
                {hoveredCell.activityCount} prestatie
                {hoveredCell.activityCount > 1 ? "s" : ""} • {hoveredCell.hoursLogged} uur gewerkt
              </span>
            ) : (
              <span>Geen stageverslag op deze dag</span>
            )}
          </div>
          {hoveredCell.highlight && !hoveredCell.isFuture && (
            <div className="text-emerald-500 font-medium text-[11px] mt-1 line-clamp-1 border-t border-border/40 pt-1">
              &quot;{hoveredCell.highlight}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
