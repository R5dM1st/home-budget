import Icon from "./Icon";
import type { AppView } from "./Sidebar";

type MobileNavProps = {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
};

const ITEMS: Array<{ id: AppView; label: string; icon: "home" | "transactions" | "accounts" | "budget" | "settings" }> = [
  { id: "dashboard", label: "Accueil", icon: "home" },
  { id: "transactions", label: "Flux", icon: "transactions" },
  { id: "accounts", label: "Comptes", icon: "accounts" },
  { id: "budgets", label: "Budgets", icon: "budget" },
  { id: "settings", label: "Plus", icon: "settings" },
];

function MobileNav({ activeView, onNavigate }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[26px] border border-slate-200/80 bg-white/95 p-1.5 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      {ITEMS.map((item) => {
        const active = item.id === activeView;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold transition ${
              active
                ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                : "text-slate-400"
            }`}
          >
            <Icon name={item.icon} className="size-4.5" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default MobileNav;
