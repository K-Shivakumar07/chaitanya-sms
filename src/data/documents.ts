import type { MaterialRow, NoteRow, AssignmentRow } from '@/hooks/useSemesterData';

export type DocumentKind = 'material' | 'note' | 'assignment';

export interface SearchResult {
  kind: DocumentKind;
  kindLabel: string;
  title: string;
  subject: string;
  description: string;
  meta: string;
  link: string;
}

export const buildDocumentIndex = (
  materials: MaterialRow[] = [],
  notes: NoteRow[] = [],
  assignments: AssignmentRow[] = [],
): SearchResult[] => [
  ...materials.map((m) => ({
    kind: 'material' as const,
    kindLabel: 'Study Material',
    title: m.title,
    subject: m.subject_name,
    description: m.description ?? '',
    meta: `${m.file_type} • ${m.size_label}${m.unit_no ? ` • Unit ${m.unit_no}` : ''}`,
    link: '/materials',
  })),
  ...notes.map((n) => ({
    kind: 'note' as const,
    kindLabel: 'Note / PDF',
    title: n.title,
    subject: n.subject_name,
    description: `${n.faculty} • ${n.pages} pages`,
    meta: `${n.file_type} • ${n.size_label} • ${n.uploaded_at}`,
    link: '/notes',
  })),
  ...assignments.map((a) => ({
    kind: 'assignment' as const,
    kindLabel: 'Assignment',
    title: a.title,
    subject: a.subject_name,
    description: a.description ?? '',
    meta: `Due ${a.due_date} • ${a.status}`,
    link: '/assignments',
  })),
];

export const searchDocuments = (docs: SearchResult[], query: string): SearchResult[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return docs.filter((doc) => {
    const haystack = [doc.title, doc.subject, doc.description, doc.kind, doc.kindLabel, doc.meta]
      .join(' ')
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
};

export interface Suggestion {
  value: string;
  type: 'title' | 'subject';
  count: number;
}

export const getSuggestions = (docs: SearchResult[], query: string, limit = 6): Suggestion[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const rank = (value: string) => {
    const v = value.toLowerCase();
    if (v.startsWith(q)) return 0;
    if (new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(v)) return 1;
    if (v.includes(q)) return 2;
    return -1;
  };

  const candidates: Array<Suggestion & { score: number }> = [];

  Array.from(new Set(docs.map((d) => d.subject))).forEach((subject) => {
    const score = rank(subject);
    if (score >= 0) {
      candidates.push({
        value: subject,
        type: 'subject',
        count: docs.filter((d) => d.subject === subject).length,
        score,
      });
    }
  });

  Array.from(new Set(docs.map((d) => d.title))).forEach((title) => {
    const score = rank(title);
    if (score >= 0) candidates.push({ value: title, type: 'title', count: 1, score: score + 0.5 });
  });

  return candidates
    .sort((a, b) => a.score - b.score || a.value.localeCompare(b.value))
    .slice(0, limit)
    .map(({ score, ...rest }) => rest);
};
