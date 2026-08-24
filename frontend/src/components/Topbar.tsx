import Brand from "./Brand";
import Icon from "./Icon";
import PeriodSwitcher from "./PeriodSwitcher";

type TopbarProps = {
  year: number;
  month: number;
  onYearChange: (value: number) => void;
  onMonthChange: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onAddTransaction: () => void;

  onScanReceipt: () => void;
};
function Topbar({
  year,
  month,
  onYearChange,
  onMonthChange,
  onPrevious,
  onNext,
  onAddTransaction,
  onScanReceipt,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#f7f8fb]/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <Brand />
        </div>
        <div className="hidden lg:block">
          <PeriodSwitcher
            year={year}
            month={month}
            onYearChange={onYearChange}
            onMonthChange={onMonthChange}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block lg:hidden">
            <PeriodSwitcher
              year={year}
              month={month}
              onYearChange={onYearChange}
              onMonthChange={onMonthChange}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          </div>
          <button
  type="button"
  onClick={onScanReceipt}
  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
>
  <span>📷</span>

  <span className="hidden sm:inline">
    Scanner un ticket
  </span>

  <span className="sm:hidden">
    Scanner
  </span>
</button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
