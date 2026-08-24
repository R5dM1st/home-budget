import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import type { Accent, ThemeMode } from "../hooks/useTheme";
import type { AppView } from "../components/Sidebar";

type SettingsPageProps = {
  theme: ThemeMode;
  accent: Accent;
  onThemeChange: (theme: ThemeMode) => void;
  onAccentChange: (accent: Accent) => void;
  onNavigate?: (view: AppView) => void;
};

const THEMES: Array<{ id: ThemeMode; label: string; icon: "sun" | "moon" | "monitor" }> = [
  { id: "light", label: "Clair", icon: "sun" },
  { id: "dark", label: "Sombre", icon: "moon" },
  { id: "system", label: "Système", icon: "monitor" },
];

const ACCENTS: Array<{ id: Accent; label: string; color: string }> = [
  { id: "ocean", label: "Océan", color: "#3569ff" },
  { id: "violet", label: "Violet", color: "#7059f5" },
  { id: "emerald", label: "Émeraude", color: "#169b78" },
];

function SettingsPage({
  theme,
  accent,
  onThemeChange,
  onAccentChange,
  onNavigate,
}: SettingsPageProps) {
  return (
    <div>
      <PageHeader
        eyebrow="Préférences"
        title="Une app qui te ressemble"
        description="La personnalisation reste locale à ton navigateur : thème, accent et confort visuel."
      />


      {onNavigate ? (
        <section className="mb-6 rounded-[28px] border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Plus</p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Autres espaces</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["analytics", "Analyses"],
              ["recurring", "Récurrences"],
              ["goals", "Objectifs"],
            ].map(([view, label]) => (
              <button key={view} type="button" onClick={() => onNavigate(view as AppView)} className="rounded-2xl bg-slate-50 px-3 py-3 text-xs font-black text-slate-700 dark:bg-slate-950 dark:text-slate-200">{label}</button>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Apparence</p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Mode d’affichage</h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {THEMES.map((item) => {
              const active = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onThemeChange(item.id)}
                  className={`rounded-2xl border p-4 text-left transition ${active ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"}`}
                >
                  <Icon name={item.icon} className={`size-5 ${active ? "text-[var(--accent)]" : "text-slate-400"}`} />
                  <span className="mt-3 block text-sm font-black text-slate-800 dark:text-slate-100">{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Signature</p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Couleur d’accent</h2>
          <div className="mt-5 space-y-2">
            {ACCENTS.map((item) => {
              const active = accent === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAccentChange(item.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition ${active ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"}`}
                >
                  <span className="flex items-center gap-3 text-sm font-black text-slate-800 dark:text-slate-100">
                    <span className="size-5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  {active ? <span className="text-xs font-bold text-[var(--accent)]">Actif</span> : null}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[28px] border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Architecture</p>
        <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Pensé pour évoluer</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            ["Frontend", "React + TypeScript + Vite"],
            ["API", "FastAPI + SQLAlchemy"],
            ["Données", "PostgreSQL + Alembic"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
              <p className="mt-2 text-sm font-black text-slate-800 dark:text-slate-100">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
