import Icon from "./Icon";
import { MONTHS } from "../utils/format";

type PeriodSwitcherProps = {
  year: number;
  month: number;
  onYearChange: (value: number) => void;
  onMonthChange: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

function PeriodSwitcher({
  year,
  month,
  onYearChange,
  onMonthChange,
  onPrevious,
  onNext,
}: PeriodSwitcherProps) {
  return (
    <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onPrevious}
        className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
        aria-label="Mois précédent"
      >
        <Icon name="chevron-left" className="size-4" />
      </button>

      <select
        value={month}
        onChange={(event) => onMonthChange(Number(event.target.value))}
        className="border-0 bg-transparent px-2 py-2 text-sm font-semibold text-slate-800 outline-none dark:text-slate-100"
      >
        {MONTHS.map((label, index) => (
          <option key={label} value={index + 1}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={year}
        min={2000}
        max={2100}
        onChange={(event) => onYearChange(Number(event.target.value))}
        className="w-18 border-0 bg-transparent px-1 py-2 text-sm font-semibold text-slate-800 outline-none dark:text-slate-100"
      />

      <button
        type="button"
        onClick={onNext}
        className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
        aria-label="Mois suivant"
      >
        <Icon name="chevron-right" className="size-4" />
      </button>
    </div>
  );
}

export default PeriodSwitcher;
