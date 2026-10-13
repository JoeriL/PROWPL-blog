"use client";

import React, { useState } from "react";
import { InternshipGoal } from "@/db/schema";
import { Target, CheckCircle2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { updateGoalProgress } from "@/lib/actions";

interface GoalsSectionProps {
  goals: InternshipGoal[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleToggleGoal = async (goal: InternshipGoal) => {
    setUpdatingId(goal.id);
    const newStatus = goal.status === "completed" ? "in_progress" : "completed";
    const newProgress = newStatus === "completed" ? 100 : Math.max(50, goal.progress);
    await updateGoalProgress(goal.id, newProgress, newStatus);
    setUpdatingId(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Architecture":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Soft Skills":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Process & CI/CD":
      default:
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    }
  };

  const completedCount = goals.filter((g) => g.status === "completed").length;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Stageleerdoelen & Competenties (Aertssen)
            </h2>
            <p className="text-xs text-muted-foreground">
              {completedCount} van de {goals.length} eindtermen behaald
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-all cursor-pointer"
        >
          <span>{isExpanded ? "Inklappen" : "Bekijken & Bewerken"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Progress Bar Header Summary */}
      <div className="mt-3.5">
        <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
            style={{ width: `${(completedCount / (goals.length || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Expandable Goals Grid */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {goals.map((goal) => {
            const isCompleted = goal.status === "completed";
            const isUpdating = updatingId === goal.id;

            return (
              <div
                key={goal.id}
                className="p-3.5 rounded-xl border border-border/60 bg-background/50 hover:border-border transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${getCategoryColor(
                        goal.category
                      )}`}
                    >
                      {goal.category}
                    </span>

                    <button
                      onClick={() => handleToggleGoal(goal)}
                      disabled={isUpdating}
                      className={`text-[11px] px-2 py-0.5 rounded-md border flex items-center gap-1 font-medium transition-all cursor-pointer ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-muted/60 text-muted-foreground border-border/80 hover:text-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Voltooid</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>In Uitvoering ({goal.progress}%)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground tracking-tight">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Voortgang</span>
                    <span className="font-semibold">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCompleted ? "bg-emerald-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
