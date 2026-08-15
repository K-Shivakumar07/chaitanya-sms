import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Generic helpers used by the Faculty and Admin portals.
// The client is strongly typed per-table, so we widen it here on purpose.
const db = supabase as unknown as {
  from: (table: string) => any;
};

export interface FacultyRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  department: string;
  designation: string;
  role: string;
}

export const useTableRows = <T = Record<string, unknown>>(
  table: string,
  options: { semester?: number | null; orderBy?: string; ascending?: boolean; scoped?: boolean } = {},
) => {
  const { semester = null, orderBy = 'created_at', ascending = false, scoped = true } = options;
  return useQuery({
    queryKey: [table, scoped ? semester ?? 0 : 'all'],
    enabled: !scoped || !!semester,
    queryFn: async () => {
      let query = db.from(table).select('*');
      if (scoped && semester) query = query.eq('semester', semester);
      const { data, error } = await query.order(orderBy, { ascending });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
};

export const useInsertRow = (table: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await db.from(table).insert(values);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
};

export const useUpdateRow = (table: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await db.from(table).update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
};

export const useDeleteRow = (table: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
};

export const useFaculty = () => useTableRows<FacultyRow>('faculty', { scoped: false, orderBy: 'name', ascending: true });
