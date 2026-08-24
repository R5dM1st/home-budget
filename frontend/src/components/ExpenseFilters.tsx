import Icon from "./Icon";
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from "../types/expense";

type ExpenseFiltersProps = {
  search: string;
  category: ExpenseCategory | "";
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: ExpenseCategory | "") => void;
};

function ExpenseFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: ExpenseFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_230px]">
      <label className="relative block">
        <Icon
          name="search"
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher une transaction…"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </label>

      <select
        value={category}
        onChange={(event) =>
          onCategoryChange(event.target.value as ExpenseCategory | "")
        }
        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        <option value="">Toutes les catégories</option>
        {EXPENSE_CATEGORIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ExpenseFilters;
