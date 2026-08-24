import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyCashFlow } from "../types/finance";
import { formatCompactCurrency, formatCurrency } from "../utils/format";
import EmptyState from "./EmptyState";
import Panel from "./Panel";

export default function CashFlowChart({ data }: { data: DailyCashFlow[] }) {
  const chartData = data.map((item) => ({
    label: new Date(`${item.date}T00:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    expenses: Number(item.expenses),
    income: Number(item.income),
  }));
  return <Panel className="overflow-hidden"><div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Cash-flow</p><h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Revenus et dépenses</h2></div>{chartData.length===0?<EmptyState title="Pas encore de flux" description="La courbe se construira automatiquement avec tes transactions."/>:<div className="h-80 p-4"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient><linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11}/><YAxis tickFormatter={(value)=>formatCompactCurrency(value)} tickLine={false} axisLine={false} fontSize={11}/><Tooltip formatter={(value,name)=>[formatCurrency(Number(value)),name==="income"?"Revenus":"Dépenses"]}/><Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGradient)" strokeWidth={2.5}/><Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="url(#expenseGradient)" strokeWidth={2.5}/></AreaChart></ResponsiveContainer></div>}</Panel>
}
