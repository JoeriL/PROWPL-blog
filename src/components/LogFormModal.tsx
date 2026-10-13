"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { DailyLog } from "@/db/schema";
import { LogFormData } from "@/lib/types";
import { format } from "date-fns";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  Save,
  Tag,
  Loader2,
  AlertCircle,
  ChevronDown,
  Check,
} from "lucide-react";
import { createDailyLog, updateDailyLog } from "@/lib/actions";

interface LogFormModalProps {
  isOpen: boolean;
  editingLog: DailyLog | null;
  availableTags?: string[];
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORY_OPTIONS = [
  "Feature Development",
  "Architecture & Planning",
  "Onboarding",
  "Testing & QA",
  "DevOps & CI/CD",
  "Meetings & Mentoring",
  "Bug Fixing",
  "Research & Learning",
];

const MOOD_OPTIONS = [
  { value: "excited", label: "🚀 Enthousiast & Hoge Drive" },
  { value: "productive", label: "⚡ Productieve Flow" },
  { value: "satisfied", label: "✨ Tevreden met Resultaat" },
  { value: "challenged", label: "🧩 Complexe Uitdaging" },
  { value: "neutral", label: "📝 Normale Voortgang" },
];

const DEFAULT_TAGS = [
  "API Integration",
  "Agile",
  "Azure",
  "Azure Functions",
  "Azure Logic Apps",
  "Azure Pipelines",
  "Backend",
  "Bug Fixing",
  "C#",
  "CI/CD",
  "CLI",
  "Communication",
  "DTO",
  "Database Design",
  "Databases",
  "Debugging",
  "Dependency Injection",
  "Drizzle ORM",
  "Entity Framework Core",
  "Frontend",
  "Git",
  "Health Checks",
  "Integration Testing",
  "Localization",
  "Next.js",
  "NuGet",
  "Onboarding",
  "REST APIs",
  "React",
  "Remote Work",
  "Routing",
  "SQLite",
  "Tailwind CSS",
  "Team Collaboration",
  "Testing",
  "Troubleshooting",
  "TypeScript",
  "UI Components",
  "UI/UX",
];

export function LogFormModal({
  isOpen,
  editingLog,
  availableTags,
  onClose,
  onSaved,
}: LogFormModalProps) {
  const [formData, setFormData] = useState<LogFormData>({
    date: "",
    title: "",
    summary: "",
    content: "",
    hoursWorked: 8.0,
    category: "Feature Development",
    mood: "productive",
    accomplishments: [""],
    skills: [],
    challenges: "",
    learnings: "",
    mentorFeedback: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (editingLog) {
      setFormData({
        date: editingLog.date,
        title: editingLog.title,
        summary: editingLog.summary,
        content: editingLog.content,
        hoursWorked: editingLog.hoursWorked,
        category: editingLog.category,
        mood: editingLog.mood,
        accomplishments:
          Array.isArray(editingLog.accomplishments) && editingLog.accomplishments.length > 0
            ? editingLog.accomplishments
            : [""],
        skills: Array.isArray(editingLog.skills) ? editingLog.skills : [],
        challenges: editingLog.challenges || "",
        learnings: editingLog.learnings || "",
        mentorFeedback: editingLog.mentorFeedback || "",
      });
    } else {
      setFormData({
        date: format(new Date(), "yyyy-MM-dd"),
        title: "",
        summary: "",
        content: "",
        hoursWorked: 8.0,
        category: "Feature Development",
        mood: "productive",
        accomplishments: [""],
        skills: [],
        challenges: "",
        learnings: "",
        mentorFeedback: "",
      });
    }
    setSkillInput("");
    setIsDropdownOpen(false);
    setErrorMessage(null);
  }, [editingLog, isOpen]);

  const handleAddAccomplishment = () => {
    setFormData((prev) => ({
      ...prev,
      accomplishments: [...prev.accomplishments, ""],
    }));
  };

  const handleRemoveAccomplishment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      accomplishments: prev.accomplishments.filter((_, i) => i !== index),
    }));
  };

  const handleAccomplishmentChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.accomplishments];
      updated[index] = value;
      return { ...prev, accomplishments: updated };
    });
  };

  // Merge all available tags (defaults + prop + custom + current log skills)
  const allAvailableTags = useMemo(() => {
    const set = new Set<string>();
    DEFAULT_TAGS.forEach((t) => set.add(t));
    (availableTags || []).forEach((t) => set.add(t));
    customTags.forEach((t) => set.add(t));
    formData.skills.forEach((t) => set.add(t));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [availableTags, customTags, formData.skills]);

  const trimmedInput = skillInput.trim();

  // Filter tags based on user input
  const filteredTags = useMemo(() => {
    if (!trimmedInput) return allAvailableTags;
    return allAvailableTags.filter((tag) =>
      tag.toLowerCase().includes(trimmedInput.toLowerCase())
    );
  }, [allAvailableTags, trimmedInput]);

  const exactMatchExists = allAvailableTags.some(
    (tag) => tag.toLowerCase() === trimmedInput.toLowerCase()
  );

  const canAddNewTag =
    trimmedInput.length > 0 &&
    !formData.skills.some((s) => s.toLowerCase() === trimmedInput.toLowerCase());

  const handleSelectOrAddTag = (tagToAdd: string) => {
    const cleanTag = tagToAdd.trim();
    if (!cleanTag) return;

    if (!formData.skills.includes(cleanTag)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, cleanTag],
      }));
    }

    if (!allAvailableTags.includes(cleanTag)) {
      setCustomTags((prev) => (prev.includes(cleanTag) ? prev : [...prev, cleanTag]));
    }

    setSkillInput("");
  };

  const handleToggleTag = (tag: string) => {
    if (formData.skills.includes(tag)) {
      handleRemoveSkill(tag);
    } else {
      handleSelectOrAddTag(tag);
    }
  };

  const handleAddCustomSkill = () => {
    if (trimmedInput) {
      const matched = allAvailableTags.find(
        (t) => t.toLowerCase() === trimmedInput.toLowerCase()
      );
      handleSelectOrAddTag(matched || trimmedInput);
    }
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (trimmedInput) {
        const matched = allAvailableTags.find(
          (t) => t.toLowerCase() === trimmedInput.toLowerCase()
        );
        handleSelectOrAddTag(matched || trimmedInput);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    } else if (e.key === "ArrowDown") {
      setIsDropdownOpen(true);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Filter out empty accomplishments
    const cleanAccomplishments = formData.accomplishments
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const payload: LogFormData = {
      ...formData,
      accomplishments: cleanAccomplishments,
    };

    try {
      if (editingLog) {
        const res = await updateDailyLog(editingLog.id, payload);
        if (!res.success) {
          setErrorMessage(res.error || "Fout bij bijwerken.");
          setIsSubmitting(false);
          return;
        }
      } else {
        const res = await createDailyLog(payload);
        if (!res.success) {
          setErrorMessage(res.error || "Fout bij opslaan.");
          setIsSubmitting(false);
          return;
        }
      }

      onSaved();
      onClose();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Onverwachte fout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between gap-3 bg-muted/20">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {editingLog ? "Stageverslag Bewerken" : "Nieuw Dagverslag Toevoegen"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Leg je dagelijkse realisaties, uren en feedback nauwkeurig vast
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm flex-1">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Date, Hours, Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Datum <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Uren Gewerkt <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="16"
                  required
                  value={formData.hoursWorked}
                  onChange={(e) =>
                    setFormData({ ...formData, hoursWorked: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Categorie <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title & Mood */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1">
                Titel van het Dagverslag <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Bijv. Implementatie Drizzle ORM & SQLite Databaselaag"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Gemoedstoestand / Flow
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              >
                {MOOD_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Korte Samenvatting <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="1-2 zinnen die de kern van de dag beschrijven"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          {/* Key Accomplishments Bullets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Belangrijkste Realisaties (Mijlpalen van de dag)</span>
              </label>
              <button
                type="button"
                onClick={handleAddAccomplishment}
                className="text-xs text-emerald-600 hover:text-emerald-500 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Rij toevoegen</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {formData.accomplishments.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Realisatie #${idx + 1}`}
                    value={item}
                    onChange={(e) => handleAccomplishmentChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                  {formData.accomplishments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAccomplishment(idx)}
                      className="p-1.5 text-muted-foreground hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Tag input with Dropdown */}
          <div ref={dropdownRef} className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tags & Vaardigheden</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                Kies uit dropdown of voeg een nieuwe toe
              </span>
            </div>

            {/* Input & Dropdown Toggle */}
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Zoek bestaande tag of typ een nieuwe (bijv. Azure, C#, Next.js)..."
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={handleSkillInputKeyDown}
                  className="w-full pl-3 pr-8 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                  title="Dropdown tonen"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${isDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddCustomSkill}
                disabled={!trimmedInput}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Toevoegen</span>
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 z-50 mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {/* Option to create a new tag if input is typed and not already present */}
                {canAddNewTag && !exactMatchExists && (
                  <button
                    type="button"
                    onClick={() => handleSelectOrAddTag(trimmedInput)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-b border-border flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Nieuwe tag toevoegen: <strong>&quot;{trimmedInput}&quot;</strong>
                    </span>
                  </button>
                )}

                {/* Tags List */}
                <div className="max-h-48 overflow-y-auto divide-y divide-border/30 p-1">
                  {filteredTags.length > 0 ? (
                    filteredTags.map((tag) => {
                      const isSelected = formData.skills.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                              : "hover:bg-muted text-foreground"
                            }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <Tag className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="truncate">{tag}</span>
                          </span>
                          {isSelected ? (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span className="hidden sm:inline">Geselecteerd</span>
                            </span>
                          ) : (
                            <Plus className="w-3 h-3 text-muted-foreground opacity-40 shrink-0" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-3 text-xs text-muted-foreground text-center">
                      Geen tags gevonden voor &quot;{trimmedInput}&quot;. Klik op &quot;Toevoegen&quot; om deze als nieuwe tag toe te voegen.
                    </div>
                  )}
                </div>

                {/* Footer with summary */}
                <div className="px-3 py-1.5 bg-muted/40 border-t border-border text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>{allAvailableTags.length} tags beschikbaar</span>
                  <span>Klik om te selecteren / deselecteren</span>
                </div>
              </div>
            )}

            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-1.5 min-h-[26px]">
              {formData.skills.length > 0 ? (
                formData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium animate-in fade-in"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-600 cursor-pointer text-xs ml-0.5"
                      title={`Verwijder tag ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-muted-foreground italic">
                  Nog geen tags geselecteerd voor dit verslag.
                </span>
              )}
            </div>
          </div>

          {/* Full Content (Markdown) */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Uitgebreide Toelichting & Logboek Details (Markdown ondersteund){" "}
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              placeholder="Beschrijf hier je uitgevoerde werkzaamheden, architectuurbeslissingen of code wijzigingen..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground font-mono focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          {/* Learnings & Challenges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Geleerde Lessen (Reflectie)
              </label>
              <textarea
                rows={2}
                placeholder="Wat heb je vandaag geleerd?"
                value={formData.learnings || ""}
                onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Uitdagingen & Oplossingen
              </label>
              <textarea
                rows={2}
                placeholder="Welke obstakels kwam je tegen en hoe zijn ze opgelost?"
                value={formData.challenges || ""}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Mentor Feedback */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Stagementor Notities of Feedback (Aertssen)
            </label>
            <textarea
              rows={2}
              placeholder="Feedback van je stagebegeleider of teamleden..."
              value={formData.mentorFeedback || ""}
              onChange={(e) => setFormData({ ...formData, mentorFeedback: e.target.value })}
              className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted text-foreground transition-all cursor-pointer"
            >
              Annuleren
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Opslaan in database...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingLog ? "Wijzigingen Opslaan" : "Dagverslag Aanmaken"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
