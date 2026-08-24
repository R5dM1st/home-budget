import Icon from "./Icon";

type EmptyStateProps = {
  title: string;
  description: string;
};

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
        <Icon name="sparkles" className="size-5" />
      </div>
      <p className="mt-4 font-bold text-slate-900 dark:text-white">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
