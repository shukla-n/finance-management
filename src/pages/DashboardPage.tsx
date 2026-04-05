import { useFinancialRecords } from "@/hooks/useFinancialRecords";
import { useAnalytics } from "@/hooks/useAnalytics";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { RecordsTable } from "@/components/records/RecordsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: records, isLoading } = useFinancialRecords();
  const analytics = useAnalytics(records);

  if (isLoading) return <div className="flex justify-center py-20 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <SummaryCards totalIncome={analytics.totalIncome} totalExpenses={analytics.totalExpenses} balance={analytics.balance} recordCount={records?.length ?? 0} />
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyChart data={analytics.monthlyTotals} />
        <CategoryBreakdown data={analytics.categoryBreakdown} />
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <RecordsTable records={analytics.recentActivity} onEdit={() => {}} />
        </CardContent>
      </Card>
    </div>
  );
}
