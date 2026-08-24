import { useEffect, useState, type FormEvent } from "react";

import {
  EXPENSE_CATEGORIES,
  type Expense,
  type ExpenseCategory,
  type ExpensePayload,
} from "../types/expense";


type ExpenseFormModalProps = {
  open: boolean;
  expense: Expense | null;
  year: number;
  month: number;
  onClose: () => void;
  onSubmit: (payload: ExpensePayload) => Promise<void>;
};


function defaultDate(year: number, month: number): string {
  const today = new Date();

  if (
    today.getFullYear() === year
    && today.getMonth() + 1 === month
  ) {
    return today.toISOString().slice(0, 10);
  }

  return `${year}-${String(month).padStart(2, "0")}-01`;
}


function ExpenseFormModal({
  open,
  expense,
  year,
  month,
  onClose,
  onSubmit,
}: ExpenseFormModalProps) {
  const [date, setDate] = useState(defaultDate(year, month));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState<ExpenseCategory>("Courses");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDate(expense?.date ?? defaultDate(year, month));
    setDescription(expense?.description ?? "");
    setAmount(expense?.amount ?? "");
    setCategory(expense?.category ?? "Courses");
    setError(null);
  }, [open, expense, year, month]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        date,
        description,
        amount,
        category,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer la dépense.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {expense ? "Modifier la dépense" : "Ajouter une dépense"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-slate-400 hover:text-slate-700"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Date
            </span>
            <input
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </span>
            <input
              type="text"
              required
              maxLength={255}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex. Carrefour"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Montant
            </span>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Catégorie
            </span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ExpenseCategory)
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              {EXPENSE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {error ? (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default ExpenseFormModal;
