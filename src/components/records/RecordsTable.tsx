import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { FinancialRecord, useDeleteRecord } from "@/hooks/useFinancialRecords";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO } from "date-fns";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface Props {
  records: FinancialRecord[];
  onEdit: (r: FinancialRecord) => void;
}

export function RecordsTable({ records, onEdit }: Props) {
  const { isAdmin } = useAuth();
  const deleteRecord = useDeleteRecord();

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="hidden md:table-cell">Notes</TableHead>
            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No records found</TableCell></TableRow>
          ) : (
            records.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{format(parseISO(r.date), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  <Badge variant={r.type === "income" ? "default" : "destructive"} className={r.type === "income" ? "bg-accent text-accent-foreground" : ""}>
                    {r.type}
                  </Badge>
                </TableCell>
                <TableCell>{r.category}</TableCell>
                <TableCell className={`text-right font-semibold ${r.type === "income" ? "text-accent" : "text-destructive"}`}>
                  {r.type === "income" ? "+" : "-"}{fmt(Number(r.amount))}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground max-w-[200px] truncate">{r.notes || "—"}</TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(r)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteRecord.mutate(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
