import Icon, { type IconName } from "./Icon";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon: IconName;
  tone?: "accent" | "success" | "neutral" | "danger";
};

const TONES = {
  accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
  success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  neutral: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
  danger: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
};

function MetricCard({
  label,
  value,
  detail,
  icon,
  tone = "neutral",
}: MetricCardProps) {
  return (
    <article className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/[0.03] dark:border-slate-800 dark:bg-slate-900">
      <div className={`grid size-10 place-items-center rounded-2xl ${TONES[tone]}`}>
        <Icon name={icon} className="size-4.5" />
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>
      {detail ? (
        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {detail}
        </p>
      ) : null}
    </article>
  );
}

export default MetricCard;
