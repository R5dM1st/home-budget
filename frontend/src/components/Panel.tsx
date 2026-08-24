import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

function Panel({ children, className = "" }: PanelProps) {
  return (
    <section className={`rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-950/[0.03] dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      {children}
    </section>
  );
}

export default Panel;
