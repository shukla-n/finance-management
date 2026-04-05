import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO } from "date-fns";

interface Props {
  data: { month: string; income: number; expense: number }[];
}

export function MonthlyChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.month + "-01"), "MMM yyyy"),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" name="Income" fill="hsl(160, 60%, 40%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
