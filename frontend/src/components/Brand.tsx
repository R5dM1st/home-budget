function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-2xl bg-[var(--accent)] text-sm font-black tracking-tight text-white shadow-lg shadow-slate-950/10">
        HB
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Mon espace
        </p>
        <p className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
          Home Budget
        </p>
      </div>
    </div>
  );
}

export default Brand;
