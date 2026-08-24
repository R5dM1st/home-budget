import type { ExpenseCategory } from "../types/expense";

export type CategoryMeta = {
  icon: string;
  color: string;
  soft: string;
};

export const CATEGORY_META: Record<ExpenseCategory, CategoryMeta> = {
  Logement: { icon: "⌂", color: "#6d5dfc", soft: "#eeecff" },
  Courses: { icon: "◒", color: "#16a085", soft: "#e4f8f2" },
  Transport: { icon: "↗", color: "#2878ff", soft: "#e8f1ff" },
  Factures: { icon: "▤", color: "#f59e0b", soft: "#fff4d6" },
  Loisirs: { icon: "✦", color: "#e45c9d", soft: "#fdeaf3" },
  Abonnements: { icon: "∞", color: "#8b5cf6", soft: "#f0e9ff" },
  Shopping: { icon: "◇", color: "#ef6b52", soft: "#ffede8" },
  Autre: { icon: "•", color: "#64748b", soft: "#eef2f6" },
};

export function getCategoryMeta(category: string): CategoryMeta {
  return CATEGORY_META[category as ExpenseCategory] ?? CATEGORY_META.Autre;
}
