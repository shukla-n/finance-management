import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type FinancialRecord = Tables<"financial_records">;
export type RecordInsert = TablesInsert<"financial_records">;
export type RecordUpdate = TablesUpdate<"financial_records">;

export interface RecordFilters {
  type?: "income" | "expense";
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useFinancialRecords(filters?: RecordFilters) {
  return useQuery({
    queryKey: ["financial_records", filters],
    queryFn: async () => {
      let q = supabase.from("financial_records").select("*").order("date", { ascending: false });
      if (filters?.type) q = q.eq("type", filters.type);
      if (filters?.category) q = q.eq("category", filters.category);
      if (filters?.dateFrom) q = q.gte("date", filters.dateFrom);
      if (filters?.dateTo) q = q.lte("date", filters.dateTo);
      const { data, error } = await q;
      if (error) throw error;
      return data as FinancialRecord[];
    },
  });
}

export function useCreateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: RecordInsert) => {
      const { data, error } = await supabase.from("financial_records").insert(record).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["financial_records"] }); toast.success("Record created"); },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: RecordUpdate & { id: string }) => {
      const { data, error } = await supabase.from("financial_records").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["financial_records"] }); toast.success("Record updated"); },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("financial_records").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["financial_records"] }); toast.success("Record deleted"); },
    onError: (e) => toast.error(e.message),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("financial_records").select("category");
      if (error) throw error;
      return [...new Set(data.map((r) => r.category))].sort();
    },
  });
}
