"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { InternshipGoal } from "@/db/schema";
import {
  Target,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  updateGoalProgress,
  createGoal,
  updateGoal,
  deleteGoal,
} from "@/lib/actions";
import { useRouter } from "next/navigation";

interface GoalsSectionProps {
  goals: InternshipGoal[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Add goal modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Technical");
  const [newDescription, setNewDescription] = useState("");
  const [newProgress, setNewProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit goal modal state
  const [editingGoal, setEditingGoal] = useState<InternshipGoal | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Technical");
  const [editDescription, setEditDescription] = useState("");
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState<
    "not_started" | "in_progress" | "completed"
  >("in_progress");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenEdit = (goal: InternshipGoal) => {
    setEditingGoal(goal);
    setEditTitle(goal.title);
    setEditCategory(goal.category);
    setEditDescription(goal.description || "");
    setEditProgress(goal.progress);
    setEditStatus(
      (goal.status as "not_started" | "in_progress" | "completed") ||
        "in_progress"
    );
    setShowDeleteConfirm(false);
    setEditError(null);
  };

  const handleCloseEdit = () => {
    setEditingGoal(null);
    setShowDeleteConfirm(false);
    setEditError(null);
  };

  const handleEditProgressChange = (val: number) => {
    setEditProgress(val);
    if (val === 100) {
      setEditStatus("completed");
    } else if (val > 0) {
      if (editStatus === "completed") {
        setEditStatus("in_progress");
      }
    } else {
      setEditStatus("not_started");
    }
  };

  const handleEditStatusChange = (
    status: "not_started" | "in_progress" | "completed"
  ) => {
    setEditStatus(status);
    if (status === "completed") {
      setEditProgress(100);
    } else if (status === "not_started") {
      setEditProgress(0);
    } else if (
      status === "in_progress" &&
      (editProgress === 0 || editProgress === 100)
    ) {
      setEditProgress(50);
    }
  };

  const handleUpdateGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;
    if (!editTitle.trim()) {
      setEditError("Vul een titel in voor het leerdoel.");
      return;
    }

    setIsSavingEdit(true);
    setEditError(null);

    const res = await updateGoal(editingGoal.id, {
      title: editTitle.trim(),
      category: editCategory,
      description: editDescription.trim() || null,
      progress: editProgress,
      status: editStatus,
    });

    setIsSavingEdit(false);

    if (res.success) {
      handleCloseEdit();
      router.refresh();
    } else {
      setEditError(res.error || "Fout bij bijwerken van doel.");
    }
  };

  const handleDeleteGoal = async () => {
    if (!editingGoal) return;
    setIsDeleting(true);
    const res = await deleteGoal(editingGoal.id);
    setIsDeleting(false);

    if (res.success) {
      handleCloseEdit();
      router.refresh();
    } else {
      setEditError(res.error || "Fout bij verwijderen van doel.");
    }
  };

  const handleToggleGoal = async (goal: InternshipGoal) => {
    setUpdatingId(goal.id);
    const newStatus = goal.status === "completed" ? "in_progress" : "completed";
    const newProgress = newStatus === "completed" ? 100 : Math.max(50, goal.progress);
    await updateGoalProgress(goal.id, newProgress, newStatus);
    setUpdatingId(null);
    router.refresh();
  };

  const handleCreateGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError("Vul een titel in voor het leerdoel.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const res = await createGoal({
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || undefined,
      progress: newProgress,
      status: newProgress === 100 ? "completed" : "in_progress",
    });

    setIsSubmitting(false);

    if (res.success) {
      setNewTitle("");
      setNewDescription("");
      setNewProgress(0);
      setNewCategory("Technical");
      setIsAddModalOpen(false);
      setIsExpanded(true); // Automatically expand so user sees newly created goal
      router.refresh();
    } else {
      setFormError(res.error || "Fout bij aanmaken van doel.");
    }
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
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 shrink-0">
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

        <div className="flex items-center gap-2">
          {/* Klein Plus Knopje */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1.5 rounded-lg border border-purple-500/20 transition-all cursor-pointer shadow-xs"
            title="Nieuw stagedoel toevoegen"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nieuw Doel</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-all cursor-pointer"
          >
            <span>{isExpanded ? "Inklappen" : "Bekijken & Bewerken"}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
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

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleGoal(goal)}
                        disabled={isUpdating}
                        className={`text-[11px] px-2 py-0.5 rounded-md border flex items-center gap-1 font-medium transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-muted/60 text-muted-foreground border-border/80 hover:text-foreground"
                        }`}
                        title={isCompleted ? "Markeer als in uitvoering" : "Markeer als voltooid"}
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

                      <button
                        onClick={() => handleOpenEdit(goal)}
                        className="p-1 rounded-md border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                        title="Doelstelling aanpassen"
                        aria-label="Doelstelling aanpassen"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

          {/* Quick Add Card in Grid */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-4 rounded-xl border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5 hover:bg-purple-500/10 transition-all flex flex-col items-center justify-center gap-2 text-purple-600 dark:text-purple-400 cursor-pointer min-h-[140px] group"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Nieuw Stagedoel Toevoegen</span>
          </button>
        </div>
      )}

      {/* Modal: Nieuw Stageleerdoel Toevoegen (via Portal to escape parent stacking context & backdrop-filter) */}
      {isAddModalOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between gap-3 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Nieuw Stageleerdoel Toevoegen
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Voeg een extra competentie of doelstelling toe aan je stageplan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateGoalSubmit} className="p-4 sm:p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Titel van het Stageleerdoel <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Bijv. CI/CD Pipeline opzetten in Azure DevOps"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Categorie <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                >
                  <option value="Technical">Technical (Frontend, Backend, Database)</option>
                  <option value="Architecture">Architecture (Cloud, System Design)</option>
                  <option value="Process & CI/CD">Process & CI/CD (DevOps, Pipelines, Git)</option>
                  <option value="Soft Skills">
                    Soft Skills (Communicatie, Teamwork, Presenteren)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Korte Beschrijving / Toelichting
                </label>
                <textarea
                  rows={3}
                  placeholder="Wat wil je concreet bereiken of leren binnen deze doelstelling?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-foreground">Huidige Voortgang</label>
                  <span className="font-semibold text-purple-600">{newProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>0% (Nog niet gestart)</span>
                  <span>50% (In uitvoering)</span>
                  <span>100% (Voltooid)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-border hover:bg-muted text-foreground font-medium transition-colors cursor-pointer"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Doelstelling Opslaan</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal: Stageleerdoel Aanpassen (via Portal) */}
      {editingGoal &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between gap-3 bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      Stageleerdoel Aanpassen
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Wijzig de titel, categorie, status of voortgang van dit doel
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleUpdateGoalSubmit} className="p-4 sm:p-5 space-y-4 text-xs">
                {editError && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600">
                    {editError}
                  </div>
                )}

                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Titel van het Stageleerdoel <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bijv. CI/CD Pipeline opzetten in Azure DevOps"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Categorie <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    >
                      <option value="Technical">Technical (Frontend, Backend, Database)</option>
                      <option value="Architecture">Architecture (Cloud, System Design)</option>
                      <option value="Process & CI/CD">Process & CI/CD (DevOps, Pipelines, Git)</option>
                      <option value="Soft Skills">
                        Soft Skills (Communicatie, Teamwork)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-foreground mb-1">
                      Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) =>
                        handleEditStatusChange(
                          e.target.value as "not_started" | "in_progress" | "completed"
                        )
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    >
                      <option value="not_started">Niet gestart (0%)</option>
                      <option value="in_progress">In uitvoering</option>
                      <option value="completed">Voltooid (100%)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Korte Beschrijving / Toelichting
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Wat wil je concreet bereiken of leren binnen deze doelstelling?"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-foreground">Huidige Voortgang</label>
                    <span className="font-semibold text-blue-600">{editProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={editProgress}
                    onChange={(e) => handleEditProgressChange(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                    <span>0% (Niet gestart)</span>
                    <span>50% (In uitvoering)</span>
                    <span>100% (Voltooid)</span>
                  </div>
                </div>

                {/* Footer with Delete and Save */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60">
                  <div>
                    {showDeleteConfirm ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-rose-600 font-medium">Zeker weten?</span>
                        <button
                          type="button"
                          onClick={handleDeleteGoal}
                          disabled={isDeleting}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          <span>Ja, verwijder</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-2 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          Nee
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-500/20 text-rose-600 hover:bg-rose-500/10 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Verwijder dit doel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Verwijderen</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCloseEdit}
                      className="px-3.5 py-2 rounded-lg border border-border hover:bg-muted text-foreground font-medium transition-colors cursor-pointer"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingEdit || !editTitle.trim()}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {isSavingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Wijzigingen Opslaan</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
