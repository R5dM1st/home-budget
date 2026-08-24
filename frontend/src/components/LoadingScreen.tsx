function LoadingScreen() {
  return (
    <div className="grid min-h-[55vh] place-items-center">
      <div className="text-center">
        <div className="mx-auto size-11 animate-spin rounded-full border-4 border-[var(--accent-soft)] border-t-[var(--accent)]" />
        <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Mise à jour de ton espace…</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
