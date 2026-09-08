import type { FieldDef } from './CrudPanel';

export interface PanelConfig {
  title: string;
  description?: string;
  table: string;
  fields: FieldDef[];
  semester?: number | null;
  scoped?: boolean;
  orderBy?: string;
  ascending?: boolean;
  primary: (row: any) => string;
  secondary?: (row: any) => string;
}

export interface PanelEntry {
  value: string;
  label: string;
  panel: (semester: number) => PanelConfig;
  allowAllSemesters?: boolean;
}


const fileTypes = [
  { value: 'PDF', label: 'PDF' },
  { value: 'PPT', label: 'PPT' },
  { value: 'DOC', label: 'DOC' },
  { value: 'ZIP', label: 'ZIP' },
];

export const materialsPanel = (semester: number): PanelConfig => ({
  title: 'Study Materials',
  description: 'Slides, references and resources for this semester',
  table: 'materials',
  semester,
  orderBy: 'uploaded_at',
  fields: [
    { name: 'subject_name', label: 'Subject', required: true },
    { name: 'title', label: 'Title', required: true },
    { name: 'unit_no', label: 'Unit number', type: 'number' },
    { name: 'file_type', label: 'File type', type: 'select', options: fileTypes, defaultValue: 'PDF' },
    { name: 'size_label', label: 'File size', placeholder: '2.4 MB', defaultValue: '2.0 MB' },
    { name: 'file_url', label: 'File link (optional)', placeholder: 'https://…' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  primary: (r) => r.title,
  secondary: (r) => `${r.subject_name} • ${r.file_type} • ${r.size_label}`,
});

export const notesPanel = (semester: number): PanelConfig => ({
  title: 'Notes & PDFs',
  description: 'Subject notes students can download',
  table: 'notes',
  semester,
  orderBy: 'uploaded_at',
  fields: [
    { name: 'subject_name', label: 'Subject', required: true },
    { name: 'title', label: 'Title', required: true },
    { name: 'faculty', label: 'Faculty', required: true },
    { name: 'unit_no', label: 'Unit number', type: 'number' },
    { name: 'pages', label: 'Pages', type: 'number', defaultValue: 10 },
    { name: 'file_type', label: 'File type', type: 'select', options: fileTypes, defaultValue: 'PDF' },
    { name: 'size_label', label: 'File size', defaultValue: '1.8 MB' },
    { name: 'file_url', label: 'File link (optional)', placeholder: 'https://…' },
  ],
  primary: (r) => r.title,
  secondary: (r) => `${r.subject_name} • ${r.faculty} • ${r.pages} pages`,
});

export const assignmentsPanel = (semester: number): PanelConfig => ({
  title: 'Assignments',
  description: 'Work handed out to students',
  table: 'assignments',
  semester,
  orderBy: 'due_date',
  ascending: true,
  fields: [
    { name: 'subject_name', label: 'Subject', required: true },
    { name: 'title', label: 'Title', required: true },
    { name: 'faculty', label: 'Faculty', required: true },
    { name: 'due_date', label: 'Due date', type: 'date', required: true },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'completed', label: 'Completed' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  primary: (r) => r.title,
  secondary: (r) => `${r.subject_name} • due ${r.due_date} • ${r.status}`,
});

export const deadlinesPanel = (semester: number): PanelConfig => ({
  title: 'Upcoming Deadlines',
  description: 'Dates shown on the student dashboard',
  table: 'deadlines',
  semester,
  orderBy: 'due_date',
  ascending: true,
  fields: [
    { name: 'title', label: 'Title', required: true },
    { name: 'due_date', label: 'Due date', type: 'date', required: true },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      defaultValue: 'assignment',
      options: [
        { value: 'assignment', label: 'Assignment' },
        { value: 'exam', label: 'Exam' },
        { value: 'project', label: 'Project' },
        { value: 'lab', label: 'Lab' },
      ],
    },
    { name: 'urgent', label: 'Urgent', type: 'checkbox', placeholder: 'Mark as urgent' },
    { name: 'detail', label: 'Detail', type: 'textarea' },
  ],
  primary: (r) => r.title,
  secondary: (r) => `${r.category} • due ${r.due_date}${r.urgent ? ' • urgent' : ''}`,
});

export const announcementsPanel = (semester: number): PanelConfig => ({
  title: 'Announcements',
  description: 'Notices published to this semester',
  table: 'announcements',
  semester,
  orderBy: 'posted_at',
  fields: [
    { name: 'title', label: 'Title', required: true },
    { name: 'posted_by', label: 'Posted by', required: true, defaultValue: 'Department Office' },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      defaultValue: 'general',
      options: [
        { value: 'general', label: 'General' },
        { value: 'exam', label: 'Exam' },
        { value: 'event', label: 'Event' },
        { value: 'urgent', label: 'Urgent' },
      ],
    },
    { name: 'body', label: 'Message', type: 'textarea', required: true },
  ],
  primary: (r) => r.title,
  secondary: (r) => `${r.category} • ${r.posted_by}`,
});

export const activitiesPanel = (semester: number): PanelConfig => ({
  title: 'Recent Activity',
  description: 'Entries in the student activity feed',
  table: 'activities',
  semester,
  orderBy: 'occurred_at',
  fields: [
    { name: 'title', label: 'Title', required: true },
    {
      name: 'kind',
      label: 'Kind',
      type: 'select',
      defaultValue: 'material',
      options: [
        { value: 'material', label: 'Material' },
        { value: 'note', label: 'Note' },
        { value: 'assignment', label: 'Assignment' },
        { value: 'announcement', label: 'Announcement' },
      ],
    },
    { name: 'detail', label: 'Detail', type: 'textarea' },
  ],
  primary: (r) => r.title,
  secondary: (r) => r.detail ?? r.kind,
});

export const subjectsPanel = (semester: number): PanelConfig => ({
  title: 'Subjects',
  description: 'Subjects offered in this semester',
  table: 'subjects',
  semester,
  orderBy: 'code',
  ascending: true,
  fields: [
    { name: 'code', label: 'Subject code', required: true },
    { name: 'name', label: 'Subject name', required: true },
    { name: 'short_name', label: 'Short name', required: true },
    { name: 'faculty', label: 'Faculty', required: true },
    { name: 'credits', label: 'Credits', type: 'number', defaultValue: 3 },
    {
      name: 'kind',
      label: 'Type',
      type: 'select',
      defaultValue: 'theory',
      options: [
        { value: 'theory', label: 'Theory' },
        { value: 'lab', label: 'Lab' },
        { value: 'project', label: 'Project' },
      ],
    },
  ],
  primary: (r) => `${r.code} — ${r.name}`,
  secondary: (r) => `${r.faculty} • ${r.credits} credits • ${r.kind}`,
});

export const syllabusPanel = (semester: number): PanelConfig => ({
  title: 'Syllabus Units',
  description: 'Unit-wise curriculum. Pick the subject id from the Subjects tab list.',
  table: 'syllabus_units',
  semester,
  orderBy: 'unit_no',
  ascending: true,
  fields: [
    { name: 'subject_id', label: 'Subject ID', required: true, full: true, placeholder: 'uuid of the subject' },
    { name: 'unit_no', label: 'Unit number', type: 'number', required: true },
    { name: 'hours', label: 'Hours', type: 'number', defaultValue: 10 },
    { name: 'title', label: 'Unit title', required: true, full: true },
    { name: 'topics', label: 'Topics (comma separated)', type: 'list', full: true },
  ],
  primary: (r) => `Unit ${r.unit_no} — ${r.title}`,
  secondary: (r) => (r.topics ?? []).join(', '),
});

export const timetablePanel = (semester: number): PanelConfig => ({
  title: 'Timetable',
  description: 'Day-wise class schedule',
  table: 'timetable_slots',
  semester,
  orderBy: 'day_order',
  ascending: true,
  fields: [
    {
      name: 'day',
      label: 'Day',
      type: 'select',
      required: true,
      options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => ({
        value: d,
        label: d,
      })),
    },
    { name: 'day_order', label: 'Day order (1=Mon)', type: 'number', required: true },
    { name: 'start_time', label: 'Start time (HH:MM)', required: true, placeholder: '08:30' },
    { name: 'end_time', label: 'End time (HH:MM)', required: true, placeholder: '09:30' },
    { name: 'subject_name', label: 'Subject', required: true },
    { name: 'faculty', label: 'Faculty', required: true },
    { name: 'room', label: 'Room', required: true },
    { name: 'is_lab', label: 'Lab session', type: 'checkbox', placeholder: 'This is a lab' },
  ],
  primary: (r) => `${r.day} ${r.start_time}–${r.end_time} • ${r.subject_name}`,
  secondary: (r) => `${r.faculty} • ${r.room}`,
});

export const facultyDirectoryPanel = (): PanelConfig => ({
  title: 'Faculty & Staff',
  description: 'People who can use the Faculty portal',
  table: 'faculty',
  scoped: false,
  orderBy: 'name',
  ascending: true,
  fields: [
    { name: 'name', label: 'Name', required: true },
    { name: 'email', label: 'Email' },
    { name: 'phone', label: 'Phone' },
    { name: 'department', label: 'Department', defaultValue: 'CSE' },
    { name: 'designation', label: 'Designation', defaultValue: 'Assistant Professor' },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      defaultValue: 'faculty',
      options: [
        { value: 'faculty', label: 'Faculty' },
        { value: 'admin', label: 'Admin' },
      ],
    },
  ],
  primary: (r) => r.name,
  secondary: (r) => `${r.designation} • ${r.department}${r.email ? ` • ${r.email}` : ''}`,
});

export const attendancePanel = (semester: number): PanelConfig => ({
  title: 'Attendance',
  description: 'Enter attendance marks for students of this semester',
  table: 'attendance_records',
  semester,
  orderBy: 'roll_no',
  ascending: true,
  fields: [
    { name: 'roll_no', label: 'Roll number', required: true },
    { name: 'student_name', label: 'Student name', required: true },
    { name: 'subject_name', label: 'Subject', required: true },
    { name: 'period', label: 'Period', placeholder: 'Sep 2026', required: true },
    { name: 'classes_held', label: 'Classes held', type: 'number', required: true },
    { name: 'classes_attended', label: 'Classes attended', type: 'number', required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea' },
  ],
  primary: (r) => `${r.roll_no} • ${r.student_name}`,
  secondary: (r) =>
    `${r.subject_name} • ${r.period} • ${r.classes_attended}/${r.classes_held} (${
      r.classes_held ? Math.round((r.classes_attended / r.classes_held) * 100) : 0
    }%)`,
});

export const facultyPanels: PanelEntry[] = [
  { value: 'materials', label: 'Study Materials', panel: materialsPanel },
  { value: 'notes', label: 'Notes & PDFs', panel: notesPanel },
  { value: 'assignments', label: 'Assignments', panel: assignmentsPanel },
  { value: 'deadlines', label: 'Deadlines', panel: deadlinesPanel },
  { value: 'announcements', label: 'Announcements', panel: announcementsPanel, allowAllSemesters: true },
  { value: 'activities', label: 'Recent Activity', panel: activitiesPanel, allowAllSemesters: true },
  { value: 'attendance', label: 'Attendance', panel: attendancePanel },
];

export const adminPanels: PanelEntry[] = [
  { value: 'subjects', label: 'Subjects', panel: subjectsPanel },
  { value: 'syllabus', label: 'Syllabus', panel: syllabusPanel },
  { value: 'timetable', label: 'Timetable', panel: timetablePanel },
  { value: 'faculty', label: 'Faculty & Staff', panel: (semester: number) => facultyDirectoryPanel() },
  ...facultyPanels,
];
