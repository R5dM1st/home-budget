import type { ReactNode } from "react";
import Icon from "./Icon";

type ModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg";
};

export default function Modal({ open, title, subtitle, onClose, children, size = "md" }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className={`max-h-[92vh] w-full overflow-y-auto rounded-[30px] border border-white/20 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${size === "lg" ? "max-w-2xl" : "max-w-lg"}`}>
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Icon name="x" className="size-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
