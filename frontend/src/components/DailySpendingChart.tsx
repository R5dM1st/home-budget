import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailySpending } from "../types/analytics";
import { formatCurrency } from "../utils/format";


type DailySpendingChartProps = {
  data: DailySpending[];
};


function DailySpendingChart({
  data,
}: DailySpendingChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    amount: Number(item.amount),
    label: new Date(`${item.date}T00:00:00`).toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
      },
    ),
  }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Évolution des dépenses
        </h2>
        <p className="text-sm text-slate-500">
          Total dépensé chaque jour
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-slate-400">
          Aucune dépense pour ce mois.
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Dépensé",
                ]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}


export default DailySpendingChart;
