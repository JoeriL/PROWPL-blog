import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";
import { nl } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateDutch(dateString: string): string {
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) return dateString;
    return format(parsed, "EEEE d MMMM yyyy", { locale: nl });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) return dateString;
    return format(parsed, "d MMM yyyy", { locale: nl });
  } catch {
    return dateString;
  }
}

export function getMoodBadge(mood: string): { emoji: string; label: string; color: string } {
  switch (mood?.toLowerCase()) {
    case "excited":
      return { emoji: "🚀", label: "Enthousiast & Hoge Drive", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
    case "productive":
      return { emoji: "⚡", label: "Productieve Flow", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
    case "satisfied":
      return { emoji: "✨", label: "Tevreden met Resultaat", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" };
    case "challenged":
      return { emoji: "🧩", label: "Complexe Uitdaging", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    case "neutral":
    default:
      return { emoji: "📝", label: "Normale Voortgang", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" };
  }
}

export function getCategoryBadge(category: string): { label: string; color: string } {
  switch (category) {
    case "Feature Development":
      return { label: "Feature Ontwikkeling", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" };
    case "Architecture & Planning":
      return { label: "Architectuur & Planning", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" };
    case "Onboarding":
      return { label: "Onboarding & Setup", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
    case "Testing & QA":
      return { label: "Testen & Kwaliteit", color: "bg-teal-500/10 text-teal-600 border-teal-500/20" };
    case "DevOps & CI/CD":
      return { label: "DevOps & CI/CD", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    case "Meetings & Mentoring":
      return { label: "Overleg & Begeleiding", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" };
    case "Bug Fixing":
      return { label: "Bug Fixing & Resoluties", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" };
    default:
      return { label: category, color: "bg-slate-500/10 text-slate-600 border-slate-500/20" };
  }
}
