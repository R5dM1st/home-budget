import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CategorySpending } from "../types/analytics";
import { formatCurrency } from "../utils/format";


type CategoryChartProps = {
  data: CategorySpending[];
};


function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    amount: Number(item.amount),
  }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Dépenses par catégorie
        </h2>
        <p className="text-sm text-slate-500">
          Répartition du mois sélectionné
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-slate-400">
          Aucune dépense pour ce mois.
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={55}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Dépensé",
                ]}
              />
              <Bar
                dataKey="amount"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}


export default CategoryChart;
