import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { RecordFilters as Filters } from "@/hooks/useFinancialRecords";

interface Props {
  filters: Filters;
  categories: string[];
  onChange: (f: Filters) => void;
}

export function RecordFilters({ filters, categories, onChange }: Props) {
  const clear = () => onChange({});

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Type</label>
        <Select value={filters.type ?? "all"} onValueChange={(v) => onChange({ ...filters, type: v === "all" ? undefined : v as any })}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Category</label>
        <Select value={filters.category ?? "all"} onValueChange={(v) => onChange({ ...filters, category: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">From</label>
        <Input type="date" value={filters.dateFrom ?? ""} onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || undefined })} className="w-40" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">To</label>
        <Input type="date" value={filters.dateTo ?? ""} onChange={(e) => onChange({ ...filters, dateTo: e.target.value || undefined })} className="w-40" />
      </div>
      {(filters.type || filters.category || filters.dateFrom || filters.dateTo) && (
        <Button variant="ghost" size="sm" onClick={clear}><X className="h-4 w-4 mr-1" /> Clear</Button>
      )}
    </div>
  );
}
