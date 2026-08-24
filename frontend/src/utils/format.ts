export const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export function formatCurrency(value: string | number | null, currency = "EUR") {
  if (value === null) return "Non défini";
  return Number(value).toLocaleString("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
}

export function formatCompactCurrency(value: string | number) {
  return Number(value).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  });
}

export function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getPeriodLabel(year: number, month: number) {
  return `${MONTHS[month - 1]} ${year}`;
}

export function transactionTypeLabel(type: "expense" | "income" | "transfer") {
  return type === "expense" ? "Dépense" : type === "income" ? "Revenu" : "Transfert";
}

export function accountTypeLabel(type: "checking" | "savings" | "cash" | "credit") {
  return ({ checking: "Compte courant", savings: "Épargne", cash: "Espèces", credit: "Carte / crédit" } as const)[type];
}
