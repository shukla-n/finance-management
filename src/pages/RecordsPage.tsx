import { useState } from "react";
import { useFinancialRecords, useCategories, FinancialRecord, RecordFilters as Filters } from "@/hooks/useFinancialRecords";
import { RecordFilters } from "@/components/records/RecordFilters";
import { RecordsTable } from "@/components/records/RecordsTable";
import { RecordFormDialog } from "@/components/records/RecordFormDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function RecordsPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<FinancialRecord | null>(null);
  const { data: records, isLoading } = useFinancialRecords(filters);
  const { data: categories } = useCategories();
  const { isAdmin } = useAuth();

  const handleEdit = (r: FinancialRecord) => { setEditRecord(r); setDialogOpen(true); };
  const handleNew = () => { setEditRecord(null); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financial Records</h1>
        {isAdmin && <Button onClick={handleNew}><Plus className="h-4 w-4 mr-2" /> New Record</Button>}
      </div>
      <RecordFilters filters={filters} categories={categories ?? []} onChange={setFilters} />
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : (
        <RecordsTable records={records ?? []} onEdit={handleEdit} />
      )}
      <RecordFormDialog open={dialogOpen} onOpenChange={setDialogOpen} record={editRecord} />
    </div>
  );
}
