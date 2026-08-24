import { useEffect, useState } from "react";
import type { Category } from "../types/finance";
import Modal from "./Modal";

export default function BudgetLimitModal({ open, categories, onClose, onSubmit }: { open: boolean; categories: Category[]; onClose: () => void; onSubmit: (categoryId: number, amount: string) => Promise<void> }) {
  const [categoryId, setCategoryId] = useState(""); const [amount, setAmount] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) { setCategoryId(categories[0]?.id.toString() ?? ""); setAmount(""); } }, [open, categories]);
  async function submit(e: React.FormEvent) { e.preventDefault(); setSaving(true); try { await onSubmit(Number(categoryId), amount); onClose(); } finally { setSaving(false); } }
  const field = "mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium outline-none focus:border-[var(--accent)] dark:border-slate-700 dark:bg-slate-950";
  return <Modal open={open} title="Enveloppe par catégorie" subtitle="Fixe une limite plus précise à une catégorie de dépenses." onClose={onClose}><form onSubmit={submit} className="space-y-5"><label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Catégorie<select className={field} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Limite<input className={field} required type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></label><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-500">Annuler</button><button disabled={saving || !categoryId} className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-black text-white">Enregistrer</button></div></form></Modal>;
}
