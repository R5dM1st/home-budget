import { useEffect, useState } from "react";
import Modal from "./Modal";

export default function BudgetModal({ open, currentAmount, onClose, onSubmit }: { open: boolean; currentAmount: string | null; onClose: () => void; onSubmit: (amount: string) => Promise<void> }) {
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) setAmount(currentAmount ?? ""); }, [open, currentAmount]);
  async function submit(event: React.FormEvent) { event.preventDefault(); setSaving(true); try { await onSubmit(amount); onClose(); } finally { setSaving(false); } }
  return <Modal open={open} title="Budget mensuel" subtitle="Définis l’enveloppe globale de dépenses pour la période." onClose={onClose}><form onSubmit={submit} className="space-y-5"><label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Montant<input required min="0" step="0.01" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-black outline-none focus:border-[var(--accent)] dark:border-slate-700 dark:bg-slate-950" placeholder="2000.00" /></label><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-500">Annuler</button><button disabled={saving} className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-black text-white">{saving ? "Enregistrement…" : "Enregistrer"}</button></div></form></Modal>;
}
