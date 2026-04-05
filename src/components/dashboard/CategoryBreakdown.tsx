import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Props {
  data: { category: string; income: number; expense: number; net: number }[];
}

const COLORS = [
  "hsl(210, 80%, 45%)",
  "hsl(160, 60%, 40%)",
  "hsl(35, 90%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 72%, 51%)",
  "hsl(190, 70%, 45%)",
  "hsl(50, 80%, 50%)",
];

export function CategoryBreakdown({ data }: Props) {
  const expenseData = data
    .filter((d) => d.expense > 0)
    .map((d) => ({ name: d.category, value: d.expense }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {expenseData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No expenses yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {expenseData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
