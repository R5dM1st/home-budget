import type { MonthlySummary } from "../types/analytics";


const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";


export async function getMonthlySummary(
  year: number,
  month: number,
): Promise<MonthlySummary> {
  const response = await fetch(
    `${API_URL}/api/analytics/${year}/${month}/summary`,
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load monthly summary: ${response.status}`,
    );
  }

  return response.json();
}