import type { Account, CategorySpending, DailyCashFlow, DashboardSummary, SavingGoal, Transaction } from "../types/finance";
import { formatCurrency, getPeriodLabel, transactionTypeLabel } from "../utils/format";
import CashFlowChart from "../components/CashFlowChart";
import CategoryDonut from "../components/CategoryDonut";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import MetricCard from "../components/MetricCard";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";

export default function DashboardPage({ year, month, summary, accounts, transactions, categorySpending, daily, goals, onAddTransaction, onOpenAccounts, onEditTransaction }: { year:number;month:number;summary:DashboardSummary;accounts:Account[];transactions:Transaction[];categorySpending:CategorySpending[];daily:DailyCashFlow[];goals:SavingGoal[];onAddTransaction:()=>void;onOpenAccounts:()=>void;onEditTransaction:(transaction:Transaction)=>void; }) {
  const progress=Math.min(Number(summary.percentage_used??"0"),100);
  return <>
    <PageHeader eyebrow="Cockpit financier" title="Vue d’ensemble" description={`Ton patrimoine, tes flux et ton budget pour ${getPeriodLabel(year,month)}.`} action={<button onClick={onAddTransaction} className="hidden rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-black text-white sm:inline-flex">+ Ajouter une transaction</button>}/>

    <div className="grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
      <Panel className="relative overflow-hidden p-6 sm:p-7">
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-[var(--accent-soft)] blur-2xl" />
        <div className="relative">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Patrimoine net suivi</p><p className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">{formatCurrency(summary.net_worth)}</p><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{summary.account_count} compte(s) actif(s)</p></div>
            <button onClick={onOpenAccounts} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"><Icon name="accounts" className="size-4"/> Gérer les comptes</button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30"><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Revenus</p><p className="mt-2 text-xl font-black text-emerald-700 dark:text-emerald-300">+ {formatCurrency(summary.income)}</p></div><div className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/30"><p className="text-xs font-bold uppercase tracking-[0.14em] text-rose-600">Dépenses</p><p className="mt-2 text-xl font-black text-rose-700 dark:text-rose-300">− {formatCurrency(summary.expenses)}</p></div><div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Cash-flow</p><p className={`mt-2 text-xl font-black ${Number(summary.cash_flow)>=0?"text-emerald-600":"text-rose-600"}`}>{formatCurrency(summary.cash_flow)}</p></div></div>
        </div>
      </Panel>

      <Panel className="p-6 sm:p-7">
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Budget du mois</p><p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{formatCurrency(summary.budget)}</p></div><div className="grid size-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon name="budget" className="size-5"/></div></div>
        {summary.budget===null?<p className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">Aucun budget défini pour cette période.</p>:<><div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-[var(--accent)]" style={{width:`${progress}%`}}/></div><div className="mt-3 flex items-center justify-between text-sm"><span className="font-bold text-slate-500">{Number(summary.percentage_used??0).toLocaleString("fr-FR",{maximumFractionDigits:1})}% utilisé</span><span className={`font-black ${Number(summary.remaining)>=0?"text-slate-900 dark:text-white":"text-rose-600"}`}>{formatCurrency(summary.remaining)} restant</span></div></>}
      </Panel>
    </div>

    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Transactions" value={String(summary.transaction_count)} detail="Ce mois-ci" icon="transactions" tone="accent"/><MetricCard label="Comptes" value={String(summary.account_count)} detail="Actifs et suivis" icon="accounts" tone="neutral"/><MetricCard label="Objectifs" value={String(goals.length)} detail="Cibles d’épargne" icon="goals" tone="success"/><MetricCard label="Flux net" value={formatCurrency(summary.cash_flow)} detail="Revenus moins dépenses" icon={Number(summary.cash_flow)>=0?"arrow-up":"arrow-down"} tone={Number(summary.cash_flow)>=0?"success":"danger"}/></div>

    <div className="mt-5 grid gap-5 xl:grid-cols-2"><CategoryDonut data={categorySpending}/><CashFlowChart data={daily}/></div>

    <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <Panel className="overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Activité récente</p><h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Dernières transactions</h2></div></div>{transactions.length===0?<EmptyState title="Aucune transaction" description="Crée ton premier compte puis ajoute une dépense, un revenu ou un transfert."/>:<div className="divide-y divide-slate-100 dark:divide-slate-800">{transactions.slice(0,6).map(t=><button key={t.id} onClick={()=>onEditTransaction(t)} className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"><div className={`grid size-10 place-items-center rounded-2xl ${t.type==="income"?"bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30":t.type==="expense"?"bg-rose-50 text-rose-600 dark:bg-rose-950/30":"bg-sky-50 text-sky-600 dark:bg-sky-950/30"}`}><Icon name={t.type==="income"?"arrow-down":t.type==="expense"?"arrow-up":"transfer"} className="size-4"/></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-black text-slate-900 dark:text-white">{t.description}</p><p className="mt-1 truncate text-xs text-slate-400">{transactionTypeLabel(t.type)} · {t.category_name??(t.type==="transfer"?`${t.source_account_name} → ${t.destination_account_name}`:"Sans catégorie")}</p></div><p className={`text-sm font-black ${t.type==="income"?"text-emerald-600":t.type==="expense"?"text-rose-600":"text-slate-900 dark:text-white"}`}>{t.type==="income"?"+ ":t.type==="expense"?"− ":""}{formatCurrency(t.amount)}</p></button>)}</div>}</Panel>
      <Panel className="p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Mes comptes</p><h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Soldes actuels</h2>{accounts.length===0?<div className="mt-5"><EmptyState title="Aucun compte" description="Commence par créer ton compte courant ou ton épargne."/></div>:<div className="mt-5 space-y-3">{accounts.slice(0,5).map(account=><div key={account.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-950"><span className="size-3 rounded-full" style={{backgroundColor:account.color}}/><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{account.name}</p><p className="text-xs text-slate-400">{account.type}</p></div><p className="text-sm font-black text-slate-950 dark:text-white">{formatCurrency(account.balance,account.currency)}</p></div>)}</div>}</Panel>
    </div>
  </>;
}
