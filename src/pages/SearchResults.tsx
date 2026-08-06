import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';

interface Row {
  title: string;
  subtitle: string;
  label: string;
  link: string;
}

const SearchResults = () => {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  const { semester } = useSession();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!q || !semester) {
      setRows([]);
      return;
    }
    (async () => {
      const like = `%${q}%`;
      const [m, n, a, an] = await Promise.all([
        supabase.from('materials').select('*').eq('semester', semester).or(`title.ilike.${like},subject_name.ilike.${like}`),
        supabase.from('notes').select('*').eq('semester', semester).or(`title.ilike.${like},subject_name.ilike.${like}`),
        supabase.from('assignments').select('*').eq('semester', semester).or(`title.ilike.${like},subject_name.ilike.${like}`),
        supabase.from('announcements').select('*').eq('semester', semester).or(`title.ilike.${like},body.ilike.${like}`),
      ]);
      setRows([
        ...(m.data ?? []).map((r: any) => ({ title: r.title, subtitle: `${r.subject_name} • ${r.file_type ?? ''}`, label: 'Study Material', link: '/materials' })),
        ...(n.data ?? []).map((r: any) => ({ title: r.title, subtitle: `${r.subject_name} • Unit ${r.unit_no ?? '-'}`, label: 'Note / PDF', link: '/notes' })),
        ...(a.data ?? []).map((r: any) => ({ title: r.title, subtitle: `${r.subject_name} • due ${r.due_date}`, label: 'Assignment', link: '/assignments' })),
        ...(an.data ?? []).map((r: any) => ({ title: r.title, subtitle: r.category ?? 'Announcement', label: 'Announcement', link: '/announcements' })),
      ]);
    })();
  }, [q, semester]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Search results for “{q}”</h1>
        <p className="text-muted-foreground">{rows.length} result(s) in Semester {semester}</p>
      </div>

      {rows.length === 0 ? (
        <div className="py-16 text-center">
          <FileText className="mx-auto mb-4 h-14 w-14 text-muted-foreground/40" />
          <p className="text-muted-foreground">Nothing matched. Try a subject name or ask the Campus Assistant.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r, i) => (
            <Link key={i} to={r.link}>
              <Card className="transition-all hover:shadow-card">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.subtitle}</p>
                  </div>
                  <Badge variant="outline">{r.label}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
