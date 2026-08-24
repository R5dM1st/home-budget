import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategorySpending } from "../types/finance";
import { formatCurrency } from "../utils/format";
import EmptyState from "./EmptyState";
import Panel from "./Panel";

export default function CategoryDonut({ data }: { data: CategorySpending[] }) {
  const chartData = data.map((item) => ({ ...item, amountNumber: Number(item.amount) }));
  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Répartition</p>
        <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Dépenses par catégorie</h2>
      </div>
      {chartData.length === 0 ? <EmptyState title="Aucune dépense" description="Tes catégories apparaîtront ici dès la première dépense du mois." /> : (
        <div className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="amountNumber" nameKey="category" innerRadius="60%" outerRadius="84%" paddingAngle={3} stroke="none">
                  {chartData.map((entry) => <Cell key={`${entry.category}-${entry.category_id}`} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {chartData.slice(0, 6).map((item) => <div key={`${item.category}-${item.category_id}`} className="flex items-center gap-3"><span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{item.category}</p><p className="text-xs text-slate-400">{item.transaction_count} transaction(s)</p></div><span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span></div>)}
          </div>
        </div>
      )}
    </Panel>
  );
}
