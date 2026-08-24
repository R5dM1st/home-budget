import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthlyPoint } from "../types/finance";
import { MONTHS, formatCompactCurrency, formatCurrency } from "../utils/format";
import Panel from "./Panel";

export default function MonthlyHistoryChart({ data }: { data: MonthlyPoint[] }) {
  const chartData=data.map(item=>({label:`${MONTHS[item.month-1].slice(0,3)} ${String(item.year).slice(-2)}`,expenses:Number(item.expenses),income:Number(item.income)}));
  return <Panel className="overflow-hidden"><div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">6 derniers mois</p><h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Tendance mensuelle</h2></div><div className="h-80 p-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} barGap={4}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11}/><YAxis tickFormatter={formatCompactCurrency} tickLine={false} axisLine={false} fontSize={11}/><Tooltip formatter={(value,name)=>[formatCurrency(Number(value)),name==="income"?"Revenus":"Dépenses"]}/><Bar dataKey="income" fill="#10b981" radius={[8,8,0,0]}/><Bar dataKey="expenses" fill="#f43f5e" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></Panel>
}
