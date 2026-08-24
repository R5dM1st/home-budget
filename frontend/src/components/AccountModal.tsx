import { useEffect, useState } from "react";
import type { Account, AccountPayload, AccountType } from "../types/finance";
import Modal from "./Modal";

const inputClass = "mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none focus:border-[var(--accent)] dark:border-slate-700 dark:bg-slate-950 dark:text-white";
const labelClass = "text-xs font-bold uppercase tracking-[0.12em] text-slate-400";

const COLORS = ["#3569ff", "#7059f5", "#169b78", "#f59e0b", "#ef4444", "#0ea5e9"];

export default function AccountModal({
  open,
  account,
  onClose,
  onSubmit,
}: {
  open: boolean;
  account: Account | null;
  onClose: () => void;
  onSubmit: (payload: AccountPayload) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("checking");
  const [openingBalance, setOpeningBalance] = useState("0.00");
  const [color, setColor] = useState(COLORS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(account?.name ?? "");
    setType(account?.type ?? "checking");
    setOpeningBalance(account?.opening_balance ?? "0.00");
    setColor(account?.color ?? COLORS[0]);
  }, [open, account]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ name, type, currency: "EUR", opening_balance: openingBalance, color });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} title={account ? "Modifier le compte" : "Nouveau compte"} subtitle="Ajoute les comptes que tu veux réellement suivre." onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
        <label className="block"><span className={labelClass}>Nom</span><input className={inputClass} required value={name} onChange={(e) => setName(e.target.value)} placeholder="Compte courant" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className={labelClass}>Type</span><select className={inputClass} value={type} onChange={(e) => setType(e.target.value as AccountType)}><option value="checking">Compte courant</option><option value="savings">Épargne</option><option value="cash">Espèces</option><option value="credit">Carte / crédit</option></select></label>
          <label><span className={labelClass}>Solde initial</span><input className={inputClass} type="number" step="0.01" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} /></label>
        </div>
        <div>
          <span className={labelClass}>Couleur</span>
          <div className="mt-3 flex flex-wrap gap-2">{COLORS.map((value) => <button key={value} type="button" onClick={() => setColor(value)} className={`size-9 rounded-xl border-2 ${color === value ? "border-slate-950 dark:border-white" : "border-transparent"}`} style={{ backgroundColor: value }} aria-label={`Couleur ${value}`} />)}</div>
        </div>
        <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Annuler</button><button disabled={saving} className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-black text-white disabled:opacity-60">{saving ? "Enregistrement…" : "Enregistrer"}</button></div>
      </form>
    </Modal>
  );
}
