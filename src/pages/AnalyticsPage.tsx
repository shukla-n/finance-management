import { useFinancialRecords } from "@/hooks/useFinancialRecords";
import { useAnalytics } from "@/hooks/useAnalytics";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function AnalyticsPage() {
  const { isAnalyst } = useAuth();
  const { data: records, isLoading } = useFinancialRecords();
  const analytics = useAnalytics(records);

  if (!isAnalyst) {
    return <div className="text-center py-20 text-muted-foreground">You need Analyst or Admin role to access detailed analytics.</div>;
  }

  if (isLoading) return <div className="flex justify-center py-20 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <SummaryCards totalIncome={analytics.totalIncome} totalExpenses={analytics.totalExpenses} balance={analytics.balance} recordCount={records?.length ?? 0} />
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyChart data={analytics.monthlyTotals} />
        <CategoryBreakdown data={analytics.categoryBreakdown} />
      </div>
      <Card>
        <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.categoryBreakdown.map((c) => (
                <TableRow key={c.category}>
                  <TableCell className="font-medium">{c.category}</TableCell>
                  <TableCell className="text-right text-accent">{fmt(c.income)}</TableCell>
                  <TableCell className="text-right text-destructive">{fmt(c.expense)}</TableCell>
                  <TableCell className={`text-right font-semibold ${c.net >= 0 ? "text-accent" : "text-destructive"}`}>{fmt(c.net)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
