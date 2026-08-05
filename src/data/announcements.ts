export interface Announcement {
  title: string;
  content: string;
  date: string;
  type: 'urgent' | 'important' | 'general';
  author: string;
}

export const announcements: Announcement[] = [
  {
    title: 'Exam Schedule Updated',
    content: 'The final exam schedule has been updated. Please check your timetable for any changes.',
    date: '2024-01-20',
    type: 'important',
    author: 'Academic Office',
  },
  {
    title: 'Library Hours Extended',
    content: 'Library will now be open until 10 PM during exam weeks to support student studies.',
    date: '2024-01-18',
    type: 'general',
    author: 'Library Staff',
  },
  {
    title: 'Chemistry Lab Maintenance',
    content: 'Chemistry lab will be closed for maintenance on January 25th. Classes will be held in alternate venue.',
    date: '2024-01-15',
    type: 'urgent',
    author: 'Lab Coordinator',
  },
];
