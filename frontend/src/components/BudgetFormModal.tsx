import { useEffect, useState, type FormEvent } from "react";

import Icon from "./Icon";
import { formatCurrency } from "../utils/format";

type BudgetFormModalProps = {
  open: boolean;
  currentAmount: string | null;
  periodLabel: string;
  onClose: () => void;
  onSubmit: (amount: string) => Promise<void>;
};

function BudgetFormModal({
  open,
  currentAmount,
  periodLabel,
  onClose,
  onSubmit,
}: BudgetFormModalProps) {
  const [amount, setAmount] = useState(currentAmount ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setAmount(currentAmount ?? "");
    setError(null);
  }, [open, currentAmount]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(amount);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d’enregistrer le budget.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-[2px]" onMouseDown={onClose}>
      <div
        className="w-full max-w-md rounded-[30px] border border-white/10 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Budget mensuel</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{periodLabel}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Repère actuel : {formatCurrency(currentAmount)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-2xl bg-slate-100 text-xl text-slate-400 transition hover:text-slate-900 dark:bg-slate-800 dark:hover:text-white"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Nouveau budget</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                required
                autoFocus
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-xl font-black text-slate-950 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent-soft)] dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">€</span>
            </div>
          </label>

          {error ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 flex-[1.3] items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] text-sm font-black text-white shadow-lg shadow-slate-950/10 disabled:opacity-50"
            >
              <Icon name="budget" className="size-4" />
              {isSubmitting ? "Enregistrement…" : "Mettre à jour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetFormModal;
