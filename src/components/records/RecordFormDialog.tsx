import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateRecord, useUpdateRecord, FinancialRecord } from "@/hooks/useFinancialRecords";

const CATEGORIES = ["Salary", "Freelance", "Investment", "Food", "Transport", "Housing", "Entertainment", "Healthcare", "Education", "Utilities", "Other"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: FinancialRecord | null;
}

export function RecordFormDialog({ open, onOpenChange, record }: Props) {
  const { user } = useAuth();
  const create = useCreateRecord();
  const update = useUpdateRecord();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (record) {
      setType(record.type);
      setAmount(String(record.amount));
      setCategory(record.category);
      setDate(record.date);
      setNotes(record.notes ?? "");
    } else {
      setType("expense");
      setAmount("");
      setCategory("Other");
      setDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    }
  }, [record, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const payload = { type, amount: parseFloat(amount), category, date, notes: notes || null, user_id: user.id };
    if (record) {
      await update.mutateAsync({ id: record.id, ...payload });
    } else {
      await create.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{record ? "Edit Record" : "New Record"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Amount</label>
              <Input type="number" step="0.01" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
          <Button type="submit" className="w-full" disabled={create.isPending || update.isPending}>
            {record ? "Update" : "Create"} Record
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
