import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useDeleteRow, useInsertRow, useTableRows } from '@/hooks/useStaffData';
import { uploadCourseFile, formatFileSize, extensionLabel } from '@/lib/files';

export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'list' | 'file';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  full?: boolean;
}

interface CrudPanelProps {
  title: string;
  description?: string;
  table: string;
  fields: FieldDef[];
  semester?: number | null;
  scoped?: boolean;
  orderBy?: string;
  ascending?: boolean;
  extraValues?: Record<string, unknown>;
  primary: (row: any) => string;
  secondary?: (row: any) => string;
}

const emptyState = (fields: FieldDef[]) => {
  const state: Record<string, any> = {};
  fields.forEach((f) => {
    state[f.name] = f.defaultValue ?? (f.type === 'checkbox' ? false : '');
  });
  return state;
};

const CrudPanel = ({
  title,
  description,
  table,
  fields,
  semester = null,
  scoped = true,
  orderBy = 'created_at',
  ascending = false,
  extraValues,
  primary,
  secondary,
}: CrudPanelProps) => {
  const { toast } = useToast();
  const { data: rows, isLoading } = useTableRows(table, { semester, scoped, orderBy, ascending });
  const insert = useInsertRow(table);
  const remove = useDeleteRow(table);
  const initial = useMemo(() => emptyState(fields), [fields]);
  const [form, setForm] = useState<Record<string, any>>(initial);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (name: string, value: any) => setForm((prev) => ({ ...prev, [name]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = { ...extraValues };
    const allSemesters = scoped && semester === 0;
    if (scoped && semester) payload.semester = semester;

    const hasSizeField = fields.some((f) => f.name === 'size_label');
    const hasTypeField = fields.some((f) => f.name === 'file_type');

    for (const f of fields) {
      const raw = form[f.name];
      if (f.type === 'file') {
        if (raw instanceof File) {
          try {
            setUploading(true);
            payload[f.name] = await uploadCourseFile(table, raw);
            if (hasSizeField) payload.size_label = formatFileSize(raw.size);
            if (hasTypeField) payload.file_type = extensionLabel(raw.name);
          } catch (err: any) {
            setUploading(false);
            toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
            return;
          } finally {
            setUploading(false);
          }
        } else if (f.required) {
          toast({ title: `${f.label} is required`, variant: 'destructive' });
          return;
        }
        continue;
      }
      if (f.required && (raw === '' || raw === undefined || raw === null)) {
        toast({ title: `${f.label} is required`, variant: 'destructive' });
        return;
      }
      if (raw === '' || raw === undefined) continue;
      if (f.type === 'number') payload[f.name] = Number(raw);
      else if (f.type === 'checkbox') payload[f.name] = Boolean(raw);
      else if (f.type === 'list')
        payload[f.name] = String(raw)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      else payload[f.name] = raw;
    }

    try {
      if (allSemesters) {
        await insert.mutateAsync(
          Array.from({ length: 8 }, (_, i) => ({ ...payload, semester: i + 1 })) as any,
        );
        toast({ title: `${title} published to all 8 semesters` });
      } else {
        await insert.mutateAsync(payload);
        toast({ title: `${title} entry added` });
      }
      setForm(initial);
      setOpen(false);
    } catch (err: any) {
      toast({ title: 'Could not save', description: err.message, variant: 'destructive' });
    }
  };

  const del = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast({ title: 'Removed' });
    } catch (err: any) {
      toast({ title: 'Could not remove', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Button size="sm" onClick={() => setOpen((v) => !v)} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" /> {open ? 'Close' : 'Add new'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {open && (
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-muted/50 p-4 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.full || f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Label htmlFor={`${table}-${f.name}`} className="text-xs">
                  {f.label}
                  {f.required && <span className="text-destructive"> *</span>}
                </Label>
                {f.type === 'textarea' ? (
                  <Textarea
                    id={`${table}-${f.name}`}
                    value={form[f.name] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                ) : f.type === 'select' ? (
                  <Select value={String(form[f.name] ?? '')} onValueChange={(v) => set(f.name, v)}>
                    <SelectTrigger id={`${table}-${f.name}`}>
                      <SelectValue placeholder={f.placeholder ?? 'Select'} />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {(f.options ?? []).map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : f.type === 'checkbox' ? (
                  <div className="flex items-center h-10 gap-2">
                    <Checkbox
                      id={`${table}-${f.name}`}
                      checked={Boolean(form[f.name])}
                      onCheckedChange={(v) => set(f.name, Boolean(v))}
                    />
                    <span className="text-sm text-muted-foreground">{f.placeholder ?? 'Yes'}</span>
                  </div>
                ) : (
                  <Input
                    id={`${table}-${f.name}`}
                    type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                    value={form[f.name] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                )}
              </div>
            ))}
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={insert.isPending}>
                {insert.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save
              </Button>
            </div>
          </form>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !rows || rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing added yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {rows.map((row: any) => (
              <li key={row.id} className="flex items-start justify-between gap-4 p-4 transition-colors hover:bg-muted/40">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{primary(row)}</p>
                  {secondary && (
                    <p className="text-xs text-muted-foreground truncate">
                      {scoped && semester === 0 && row.semester ? `Sem ${row.semester} • ` : ''}
                      {secondary(row)}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => del(row.id)} aria-label="Delete">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default CrudPanel;
