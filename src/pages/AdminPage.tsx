import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole {
  user_id: string;
  full_name: string | null;
  roles: AppRole[];
}

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const { data: profiles, error: pErr } = await supabase.from("profiles").select("user_id, full_name");
      if (pErr) throw pErr;
      const { data: roles, error: rErr } = await supabase.from("user_roles").select("user_id, role");
      if (rErr) throw rErr;

      const roleMap = new Map<string, AppRole[]>();
      roles.forEach((r) => {
        const arr = roleMap.get(r.user_id) || [];
        arr.push(r.role);
        roleMap.set(r.user_id, arr);
      });

      return profiles.map((p) => ({
        user_id: p.user_id,
        full_name: p.full_name,
        roles: roleMap.get(p.user_id) || [],
      })) as UserWithRole[];
    },
    enabled: isAdmin,
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      // Delete existing roles, insert new one
      const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (delErr) throw delErr;
      const { error: insErr } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
      if (insErr) throw insErr;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin_users"] }); toast.success("Role updated"); },
    onError: (e) => toast.error(e.message),
  });

  if (!isAdmin) {
    return <div className="text-center py-20 text-muted-foreground">Admin access required.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <Card>
        <CardHeader><CardTitle>Users & Roles</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Current Roles</TableHead>
                  <TableHead>Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((u) => (
                  <TableRow key={u.user_id}>
                    <TableCell className="font-medium">{u.full_name || "Unnamed"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {u.roles.map((r) => (
                          <Badge key={r} variant="secondary" className="capitalize">{r}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.roles[0] || "viewer"}
                        onValueChange={(v) => updateRole.mutate({ userId: u.user_id, newRole: v as AppRole })}
                      >
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
