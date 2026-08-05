export type DocumentKind = 'material' | 'note' | 'assignment';

export interface MaterialItem {
  id: number;
  title: string;
  subject: string;
  type: string;
  format: string;
  size: string;
  uploadDate: string;
  downloads: number;
  description: string;
}

export interface NoteItem {
  title: string;
  subject: string;
  date: string;
  size: string;
  pages: number;
  type: string;
}

export interface AssignmentItem {
  title: string;
  subject: string;
  dueDate: string;
  status: string;
  priority: string;
  description: string;
}

export const materials: MaterialItem[] = [
  {
    id: 1,
    title: 'Mathematics Textbook - Linear Algebra',
    subject: 'Mathematics',
    type: 'textbook',
    format: 'PDF',
    size: '15.2 MB',
    uploadDate: '2024-01-15',
    downloads: 234,
    description: 'Comprehensive guide to linear algebra concepts and applications',
  },
  {
    id: 2,
    title: 'Physics Lab Manual',
    subject: 'Physics',
    type: 'manual',
    format: 'PDF',
    size: '8.7 MB',
    uploadDate: '2024-01-10',
    downloads: 156,
    description: 'Step-by-step laboratory experiments and procedures',
  },
  {
    id: 3,
    title: 'Chemistry Reaction Videos',
    subject: 'Chemistry',
    type: 'video',
    format: 'MP4',
    size: '125 MB',
    uploadDate: '2024-01-08',
    downloads: 89,
    description: 'Visual demonstrations of chemical reactions',
  },
  {
    id: 4,
    title: 'English Literature Collection',
    subject: 'English',
    type: 'reference',
    format: 'PDF',
    size: '22.1 MB',
    uploadDate: '2024-01-05',
    downloads: 178,
    description: 'Classic literature texts and analysis guides',
  },
  {
    id: 5,
    title: 'Computer Science Online Resources',
    subject: 'Computer Science',
    type: 'link',
    format: 'Link',
    size: '-',
    uploadDate: '2024-01-03',
    downloads: 67,
    description: 'Curated list of programming tutorials and documentation',
  },
];

export const notes: NoteItem[] = [
  {
    title: 'Calculus Notes - Chapter 5',
    subject: 'Mathematics',
    date: '2024-01-20',
    size: '2.3 MB',
    pages: 15,
    type: 'lecture',
  },
  {
    title: 'Physics Lab Report Template',
    subject: 'Physics',
    date: '2024-01-18',
    size: '1.8 MB',
    pages: 8,
    type: 'template',
  },
  {
    title: 'Organic Chemistry Summary',
    subject: 'Chemistry',
    date: '2024-01-15',
    size: '4.2 MB',
    pages: 22,
    type: 'summary',
  },
];

export const assignments: AssignmentItem[] = [
  {
    title: 'Physics Lab Report',
    subject: 'Physics',
    dueDate: '2024-01-25',
    status: 'pending',
    priority: 'high',
    description: 'Complete the thermodynamics experiment report',
  },
  {
    title: 'Math Problem Set 5',
    subject: 'Mathematics',
    dueDate: '2024-01-28',
    status: 'in-progress',
    priority: 'medium',
    description: 'Solve calculus integration problems',
  },
  {
    title: 'Chemistry Essay',
    subject: 'Chemistry',
    dueDate: '2024-02-02',
    status: 'pending',
    priority: 'low',
    description: 'Write about organic compounds applications',
  },
];

export interface SearchResult {
  kind: DocumentKind;
  kindLabel: string;
  title: string;
  subject: string;
  description: string;
  meta: string;
  link: string;
}

const allDocuments: SearchResult[] = [
  ...materials.map((m) => ({
    kind: 'material' as const,
    kindLabel: 'Study Material',
    title: m.title,
    subject: m.subject,
    description: m.description,
    meta: `${m.format} • ${m.size} • ${m.type}`,
    link: '/materials',
  })),
  ...notes.map((n) => ({
    kind: 'note' as const,
    kindLabel: 'Note / PDF',
    title: n.title,
    subject: n.subject,
    description: `${n.type} notes • ${n.pages} pages`,
    meta: `${n.size} • ${n.date}`,
    link: '/notes',
  })),
  ...assignments.map((a) => ({
    kind: 'assignment' as const,
    kindLabel: 'Assignment',
    title: a.title,
    subject: a.subject,
    description: a.description,
    meta: `Due ${a.dueDate} • ${a.status}`,
    link: '/assignments',
  })),
];

export const searchDocuments = (query: string): SearchResult[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return allDocuments.filter((doc) => {
    const haystack = [doc.title, doc.subject, doc.description, doc.kind, doc.kindLabel, doc.meta]
      .join(' ')
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
};

export const documentIndex = allDocuments;

export interface Suggestion {
  value: string;
  type: 'title' | 'subject';
  count: number;
}

const titleTerms = Array.from(new Set(allDocuments.map((d) => d.title)));
const subjectTerms = Array.from(new Set(allDocuments.map((d) => d.subject)));

export const getSuggestions = (query: string, limit = 6): Suggestion[] => {
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

  subjectTerms.forEach((subject) => {
    const score = rank(subject);
    if (score >= 0) {
      candidates.push({
        value: subject,
        type: 'subject',
        count: allDocuments.filter((d) => d.subject === subject).length,
        score,
      });
    }
  });

  titleTerms.forEach((title) => {
    const score = rank(title);
    if (score >= 0) {
      candidates.push({ value: title, type: 'title', count: 1, score: score + 0.5 });
    }
  });

  return candidates
    .sort((a, b) => a.score - b.score || a.value.localeCompare(b.value))
    .slice(0, limit)
    .map(({ score, ...rest }) => rest);
};

