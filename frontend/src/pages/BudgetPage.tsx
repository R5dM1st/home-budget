import { useEffect, useState } from "react";

import SummaryCard from "../components/SummaryCard";
import { getMonthlySummary } from "../services/api";
import type { MonthlySummary } from "../types/analytics";


function formatCurrency(value: string | null): string {
  if (value === null) {
    return "Non défini";
  }

  return `${Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}


function formatPercentage(value: string | null): string {
  if (value === null) {
    return "Non disponible";
  }

  return `${Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} %`;
}


function BudgetPage() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getMonthlySummary(2026, 8);
        setSummary(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur inconnue est survenue",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSummary();
  }, []);

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  if (!summary) {
    return <p>Aucune donnée disponible.</p>;
  }

  return (
  <main className="min-h-screen bg-slate-50">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Tableau de bord
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Home Budget
          </h1>
        </div>

        <p className="rounded-xl bg-white px-4 py-2 font-medium text-slate-700 shadow-sm">
          {summary.month}/{summary.year}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Budget du mois"
          value={formatCurrency(summary.budget)}
        />

        <SummaryCard
          label="Dépensé"
          value={formatCurrency(summary.total_spent)}
        />

        <SummaryCard
          label="Restant"
          value={formatCurrency(summary.remaining)}
        />

        <SummaryCard
          label="Budget consommé"
          value={formatPercentage(summary.percentage_used)}
        />
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Nombre de dépenses
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.transaction_count}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Dépense moyenne
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(summary.average_expense)}
          </p>
        </div>
      </section>
    </div>
  </main>
);
}


export default BudgetPage;