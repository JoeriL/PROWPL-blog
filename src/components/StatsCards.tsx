"use client";

import React from "react";
import { Clock, CalendarCheck, Award, Target, Flame, Code2 } from "lucide-react";
import { InternshipStats } from "@/lib/types";

interface StatsCardsProps {
  stats: InternshipStats;
  onSkillClick?: (skill: string) => void;
  selectedSkill?: string | null;
}

export function StatsCards({ stats, onSkillClick, selectedSkill }: StatsCardsProps) {
  const cards = [
    {
      label: "Totaal Stage-uren",
      value: `${stats.totalHours} u`,
      subtext: `Gemiddeld ${(stats.totalHours / (stats.totalDays || 1)).toFixed(1)} u/dag`,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Dagen Geregistreerd",
      value: `${stats.totalDays} dagen`,
      subtext: "Volledig gedocumenteerd",
      icon: CalendarCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Prestaties & Mijlpalen",
      value: stats.totalAccomplishments,
      subtext: "Concrete resultaten",
      icon: Award,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      label: "Stage Doelstellingen",
      value: `${stats.completedGoals} / ${stats.totalGoals}`,
      subtext: `${Math.round((stats.completedGoals / (stats.totalGoals || 1)) * 100)}% behaald`,
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs shadow-xs hover:border-border transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg ${card.bgColor} ${card.borderColor} border flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {card.value}
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                {card.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {stats.topSkills.length > 0 && (
        <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-1">
            <Code2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Top Vaardigheden:</span>
          </div>
          {stats.topSkills.map(({ skill, count }) => {
            const isSelected = selectedSkill === skill;
            return (
              <button
                key={skill}
                onClick={() => onSkillClick?.(skill)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-background/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-foreground border-border/80"
                }`}
              >
                <span>{skill}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
          {selectedSkill && (
            <button
              onClick={() => onSkillClick?.(selectedSkill)}
              className="text-xs text-muted-foreground hover:text-foreground underline ml-2 cursor-pointer"
            >
              Wis filter ({selectedSkill})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
