import Brand from "./Brand";
import Icon, { type IconName } from "./Icon";

export type AppView =
  | "dashboard"
  | "transactions"
  | "accounts"
  | "budgets"
  | "analytics"
  | "recurring"
  | "goals"
  | "settings";

type SidebarProps = {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
};

const ITEMS: Array<{ id: AppView; label: string; icon: IconName }> = [
  { id: "dashboard", label: "Vue d’ensemble", icon: "home" },
  { id: "transactions", label: "Transactions", icon: "transactions" },
  { id: "accounts", label: "Comptes", icon: "accounts" },
  { id: "budgets", label: "Budgets", icon: "budget" },
  { id: "analytics", label: "Analyses", icon: "analytics" },
  { id: "recurring", label: "Récurrences", icon: "recurring" },
  { id: "goals", label: "Objectifs", icon: "goals" },
  { id: "settings", label: "Préférences", icon: "settings" },
];

function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200/80 bg-white/90 px-4 py-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:flex lg:flex-col">
      <div className="px-2">
        <Brand />
      </div>

      <nav className="mt-9 space-y-1">
        {ITEMS.map((item) => {
          const active = item.id === activeView;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
                active
                  ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              }`}
            >
              <span
                className={`grid size-9 place-items-center rounded-xl transition ${
                  active
                    ? "bg-white text-[var(--accent)] shadow-sm dark:bg-slate-900"
                    : "bg-slate-50 text-slate-400 group-hover:bg-white dark:bg-slate-900 dark:group-hover:bg-slate-800"
                }`}
              >
                <Icon name={item.icon} className="size-4.5" />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mb-3 grid size-9 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon name="sparkles" className="size-4" />
        </div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Home Budget Finance
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Comptes, flux, budgets et objectifs dans un seul cockpit.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
