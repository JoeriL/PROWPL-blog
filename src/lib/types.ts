import { DailyLog, Contribution, InternshipGoal } from "@/db/schema";

export type { DailyLog, Contribution, InternshipGoal };

export interface LogFormData {
  date: string;
  title: string;
  summary: string;
  content: string;
  hoursWorked: number;
  category: string;
  mood: string;
  accomplishments: string[];
  skills: string[];
  challenges?: string;
  learnings?: string;
  mentorFeedback?: string;
  isPublished?: boolean;
}

export interface InternshipStats {
  totalHours: number;
  totalDays: number;
  currentStreak: number;
  totalAccomplishments: number;
  completedGoals: number;
  totalGoals: number;
  topSkills: { skill: string; count: number }[];
  categoryHours: { category: string; hours: number }[];
}

export type CategoryOption =
  | "All"
  | "Feature Development"
  | "Architecture & Planning"
  | "Onboarding"
  | "Bug Fixing"
  | "Testing & QA"
  | "DevOps & CI/CD"
  | "Meetings & Mentoring"
  | "Research & Learning";

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ...
  activityCount: number;
  intensityLevel: number; // 0 to 4
  hoursLogged: number;
  highlight?: string | null;
  hasLog: boolean;
  logId?: number | null;
}
