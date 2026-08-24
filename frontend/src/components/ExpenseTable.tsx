import type { Expense } from "../types/expense";
import { getCategoryMeta } from "../utils/category";
import { formatCurrency, formatDate } from "../utils/format";
import EmptyState from "./EmptyState";
import Icon from "./Icon";

type ExpenseTableProps = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
};

function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-[28px] border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          title="Aucune transaction trouvée"
          description="Essaie un autre filtre ou ajoute une nouvelle dépense pour démarrer."
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-950/[0.03] dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/40">
            <tr className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              <th className="px-6 py-4">Transaction</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Montant</th>
              <th className="w-24 px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map((expense) => {
              const meta = getCategoryMeta(expense.category);
              return (
                <tr key={expense.id} className="group transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-2xl text-sm font-black"
                        style={{ backgroundColor: meta.soft, color: meta.color }}
                      >
                        {meta.icon}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{expense.description}</p>
                        <p className="mt-0.5 text-xs text-slate-400">#{expense.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{formatDate(expense.date)}</td>
                  <td className="px-6 py-4 text-right text-sm font-black text-slate-950 dark:text-white">-{formatCurrency(expense.amount)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1 opacity-80 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                        aria-label={`Modifier ${expense.description}`}
                      >
                        <Icon name="edit" className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(expense)}
                        className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                        aria-label={`Supprimer ${expense.description}`}
                      >
                        <Icon name="trash" className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseTable;
