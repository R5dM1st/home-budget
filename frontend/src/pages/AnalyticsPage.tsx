import type { CategorySpending, DailyCashFlow, DashboardSummary, MonthlyPoint } from "../types/finance";
import { formatCurrency } from "../utils/format";
import CashFlowChart from "../components/CashFlowChart";
import CategoryDonut from "../components/CategoryDonut";
import MetricCard from "../components/MetricCard";
import MonthlyHistoryChart from "../components/MonthlyHistoryChart";
import PageHeader from "../components/PageHeader";

export default function AnalyticsPage({summary,categories,daily,history}:{summary:DashboardSummary;categories:CategorySpending[];daily:DailyCashFlow[];history:MonthlyPoint[];}){
  const top=categories[0]; const savingsRate=Number(summary.income)>0?((Number(summary.income)-Number(summary.expenses))/Number(summary.income))*100:0;
  return <><PageHeader eyebrow="Décisions" title="Analyses" description="Lis tes flux sur plusieurs angles : catégories, cash-flow et tendance mensuelle."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Revenus" value={formatCurrency(summary.income)} detail="Sur la période" icon="arrow-down" tone="success"/><MetricCard label="Dépenses" value={formatCurrency(summary.expenses)} detail="Hors transferts" icon="arrow-up" tone="danger"/><MetricCard label="Taux d’épargne" value={`${savingsRate.toLocaleString("fr-FR",{maximumFractionDigits:1})} %`} detail="Cash-flow / revenus" icon="target" tone="accent"/><MetricCard label="Catégorie n°1" value={top?.category??"—"} detail={top?formatCurrency(top.amount):"Pas de dépenses"} icon="analytics" tone="neutral"/></div><div className="mt-5 grid gap-5 xl:grid-cols-2"><MonthlyHistoryChart data={history}/><CashFlowChart data={daily}/></div><div className="mt-5"><CategoryDonut data={categories}/></div></>;
}
