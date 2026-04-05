import { useMemo } from "react";
import { FinancialRecord } from "./useFinancialRecords";
import { format, parseISO, startOfMonth } from "date-fns";

export function useAnalytics(records: FinancialRecord[] | undefined) {
  return useMemo(() => {
    if (!records || records.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        categoryBreakdown: [] as { category: string; income: number; expense: number; net: number }[],
        monthlyTotals: [] as { month: string; income: number; expense: number }[],
        recentActivity: [] as FinancialRecord[],
      };
    }

    const totalIncome = records.filter((r) => r.type === "income").reduce((s, r) => s + Number(r.amount), 0);
    const totalExpenses = records.filter((r) => r.type === "expense").reduce((s, r) => s + Number(r.amount), 0);

    const catMap = new Map<string, { income: number; expense: number }>();
    records.forEach((r) => {
      const cur = catMap.get(r.category) || { income: 0, expense: 0 };
      if (r.type === "income") cur.income += Number(r.amount);
      else cur.expense += Number(r.amount);
      catMap.set(r.category, cur);
    });
    const categoryBreakdown = Array.from(catMap.entries())
      .map(([category, v]) => ({ category, ...v, net: v.income - v.expense }))
      .sort((a, b) => b.net - a.net);

    const monthMap = new Map<string, { income: number; expense: number }>();
    records.forEach((r) => {
      const month = format(startOfMonth(parseISO(r.date)), "yyyy-MM");
      const cur = monthMap.get(month) || { income: 0, expense: 0 };
      if (r.type === "income") cur.income += Number(r.amount);
      else cur.expense += Number(r.amount);
      monthMap.set(month, cur);
    });
    const monthlyTotals = Array.from(monthMap.entries())
      .map(([month, v]) => ({ month, ...v }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const recentActivity = records.slice(0, 10);

    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses, categoryBreakdown, monthlyTotals, recentActivity };
  }, [records]);
}
