import { useEffect, useState, type FormEvent } from "react";

import Icon from "./Icon";
import {
  EXPENSE_CATEGORIES,
  type Expense,
  type ExpenseCategory,
  type ExpensePayload,
} from "../types/expense";
import { getCategoryMeta } from "../utils/category";

function defaultDate(year: number, month: number): string {
  const today = new Date();
  if (today.getFullYear() === year && today.getMonth() + 1 === month) {
    return today.toISOString().slice(0, 10);
  }
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

type ExpenseDrawerProps = {
  open: boolean;
  expense: Expense | null;
  year: number;
  month: number;
  onClose: () => void;
  onSubmit: (payload: ExpensePayload) => Promise<void>;
};

function ExpenseDrawer({
  open,
  expense,
  year,
  month,
  onClose,
  onSubmit,
}: ExpenseDrawerProps) {
  const [date, setDate] = useState(defaultDate(year, month));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Courses");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setDate(expense?.date ?? defaultDate(year, month));
    setDescription(expense?.description ?? "");
    setAmount(expense?.amount ?? "");
    setCategory(expense?.category ?? "Courses");
    setError(null);
  }, [open, expense, year, month]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({ date, description, amount, category });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d’enregistrer la dépense.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-[2px]" onMouseDown={onClose}>
      <aside
        className="absolute inset-y-0 right-0 w-full max-w-lg overflow-y-auto bg-[#f8f9fc] p-5 shadow-2xl dark:bg-slate-950 sm:p-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Transaction</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {expense ? "Modifier la dépense" : "Nouvelle dépense"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Saisie rapide, catégories claires, rien de superflu.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-2xl border border-slate-200 bg-white text-xl text-slate-400 shadow-sm transition hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-white"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Description</span>
            <input
              type="text"
              required
              maxLength={255}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex. Carrefour, Netflix, Essence…"
              className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Montant</span>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-base font-black text-slate-900 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">€</span>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Date</span>
              <input
                type="date"
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
            </label>
          </div>

          <fieldset>
            <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Catégorie</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {EXPENSE_CATEGORIES.map((item) => {
                const meta = getCategoryMeta(item);
                const active = item === category;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-2xl border p-3 text-left transition ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <span
                      className="grid size-8 place-items-center rounded-xl text-xs font-black"
                      style={{ backgroundColor: meta.soft, color: meta.color }}
                    >
                      {meta.icon}
                    </span>
                    <span className="mt-2 block truncate text-xs font-bold text-slate-700 dark:text-slate-200">{item}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>
          ) : null}

          <div className="sticky bottom-0 flex gap-3 bg-[#f8f9fc]/95 pt-4 backdrop-blur dark:bg-slate-950/95">
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] text-sm font-black text-white shadow-lg shadow-slate-950/10 transition hover:brightness-105 disabled:opacity-50"
            >
              <Icon name="plus" className="size-4" />
              {isSubmitting ? "Enregistrement…" : expense ? "Enregistrer" : "Ajouter la dépense"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default ExpenseDrawer;
