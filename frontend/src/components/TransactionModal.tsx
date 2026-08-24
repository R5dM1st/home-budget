import { useEffect, useMemo, useState } from "react";
import type { Account, Category, Transaction, TransactionPayload, TransactionType } from "../types/finance";
import Modal from "./Modal";

const inputClass = "mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[var(--accent)] dark:border-slate-700 dark:bg-slate-950 dark:text-white";
const labelClass = "text-xs font-bold uppercase tracking-[0.12em] text-slate-400";

function toDateInput(value?: string) {
  return value ?? new Date().toISOString().slice(0, 10);
}

type Props = {
  open: boolean;
  transaction: Transaction | null;
  accounts: Account[];
  categories: Category[];
  year: number;
  month: number;
  onClose: () => void;
  onSubmit: (payload: TransactionPayload) => Promise<void>;
};

export default function TransactionModal({ open, transaction, accounts, categories, year, month, onClose, onSubmit }: Props) {
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fallbackDate = `${year}-${String(month).padStart(2, "0")}-01`;
    setType(transaction?.type ?? "expense");
    setDate(toDateInput(transaction?.date ?? fallbackDate));
    setDescription(transaction?.description ?? "");
    setAmount(transaction?.amount ?? "");
    setSourceId(transaction?.source_account_id?.toString() ?? "");
    setDestinationId(transaction?.destination_account_id?.toString() ?? "");
    setCategoryId(transaction?.category_id?.toString() ?? "");
    setNotes(transaction?.notes ?? "");
  }, [open, transaction, year, month]);

  const availableCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type],
  );

  function changeType(value: TransactionType) {
    setType(value);
    setCategoryId("");
    if (value === "expense") setDestinationId("");
    if (value === "income") setSourceId("");
    if (value === "transfer") setCategoryId("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        date,
        description,
        type,
        amount,
        source_account_id: sourceId ? Number(sourceId) : null,
        destination_account_id: destinationId ? Number(destinationId) : null,
        category_id: categoryId ? Number(categoryId) : null,
        notes: notes.trim() || null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} title={transaction ? "Modifier la transaction" : "Nouvelle transaction"} subtitle="Dépense, revenu ou transfert entre tes comptes." onClose={onClose} size="lg">
      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          Crée d’abord un compte depuis l’onglet Comptes.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
            {(["expense", "income", "transfer"] as TransactionType[]).map((value) => (
              <button key={value} type="button" onClick={() => changeType(value)} className={`rounded-xl px-3 py-2.5 text-sm font-black transition ${type === value ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white" : "text-slate-500"}`}>
                {value === "expense" ? "Dépense" : value === "income" ? "Revenu" : "Transfert"}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label><span className={labelClass}>Date</span><input className={inputClass} type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></label>
            <label><span className={labelClass}>Montant</span><input className={inputClass} type="number" min="0.01" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" /></label>
          </div>

          <label className="block"><span className={labelClass}>Description</span><input className={inputClass} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Carrefour, salaire, épargne…" /></label>

          <div className="grid gap-4 sm:grid-cols-2">
            {(type === "expense" || type === "transfer") ? (
              <label><span className={labelClass}>Compte source</span><select className={inputClass} required value={sourceId} onChange={(e) => setSourceId(e.target.value)}><option value="">Choisir…</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
            ) : null}
            {(type === "income" || type === "transfer") ? (
              <label><span className={labelClass}>Compte destination</span><select className={inputClass} required value={destinationId} onChange={(e) => setDestinationId(e.target.value)}><option value="">Choisir…</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
            ) : null}
            {type !== "transfer" ? (
              <label><span className={labelClass}>Catégorie</span><select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="">Sans catégorie</option>{availableCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            ) : null}
          </div>

          <label className="block"><span className={labelClass}>Notes</span><textarea className={`${inputClass} min-h-24 resize-y`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optionnel" /></label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Annuler</button>
            <button disabled={saving} className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-black text-white disabled:opacity-60">{saving ? "Enregistrement…" : "Enregistrer"}</button>
          </div>
        </form>
      )}
    </Modal>
  );
}
