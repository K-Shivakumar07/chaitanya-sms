export interface HODStudent {
  id: string;
  name: string;
  email: string;
  branch: string;
  section: string;
  semester: number;
  cgpa: number;
  attendance: number;
  status: 'Good standing' | 'Needs support' | 'At risk';
}

export interface HODFaculty {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  subjects: string[];
  sections: number;
  weeklyHours: number;
  attendanceSubmitted: boolean;
}

export interface HODSubject {
  code: string;
  name: string;
  kind: 'Theory' | 'Lab' | 'Project';
  semester: number;
  credits: number;
  faculty: string;
  status: 'Active' | 'Draft';
}

export interface HODSection {
  name: string;
  semester: number;
  students: number;
  coordinator: string;
  faculty: string;
  academicYear: string;
}

export interface HODAttendance {
  studentId: string;
  studentName: string;
  section: string;
  semester: number;
  subject: string;
  held: number;
  attended: number;
}

export interface HODAssignment {
  title: string;
  subject: string;
  faculty: string;
  section: string;
  semester: number;
  dueDate: string;
  students: number;
  submitted: number;
  evaluation: 'On track' | 'Delayed' | 'Complete';
}

export interface HODExam {
  name: string;
  subject: string;
  section: string;
  semester: number;
  date: string;
  passRate: number;
  backlogs: number;
  status: 'Scheduled' | 'Results pending' | 'Published';
}

export interface HODLeaveRequest {
  id: string;
  applicant: string;
  role: 'Student' | 'Faculty';
  leaveType: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  submitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  decisionReason?: string;
}

export interface HODAnnouncement {
  id: string;
  title: string;
  description: string;
  priority: 'Normal' | 'Important';
  audience: string;
  publishedAt: string;
  status: 'Published' | 'Draft';
}

export interface HODNotification {
  id: string;
  title: string;
  detail: string;
  category: 'Attendance' | 'Faculty' | 'Assessment' | 'Announcement' | 'System';
  time: string;
  read: boolean;
  destination: string;
}

export const hodDemoStudents: HODStudent[] = [
  { id: 'DEMO-2401', name: 'Aarav Reddy', email: 'aarav.demo@example.edu', branch: 'CSE (AI&ML)', section: 'A', semester: 7, cgpa: 8.7, attendance: 92, status: 'Good standing' },
  { id: 'DEMO-2402', name: 'Diya Sharma', email: 'diya.demo@example.edu', branch: 'CSE (AI&ML)', section: 'A', semester: 7, cgpa: 9.2, attendance: 96, status: 'Good standing' },
  { id: 'DEMO-2403', name: 'Kabir Kumar', email: 'kabir.demo@example.edu', branch: 'CSE (AI&ML)', section: 'B', semester: 7, cgpa: 6.4, attendance: 68, status: 'At risk' },
  { id: 'DEMO-2404', name: 'Meera Das', email: 'meera.demo@example.edu', branch: 'CSE (AI&ML)', section: 'A', semester: 5, cgpa: 7.8, attendance: 84, status: 'Good standing' },
  { id: 'DEMO-2405', name: 'Ishaan Rao', email: 'ishaan.demo@example.edu', branch: 'CSE (AI&ML)', section: 'B', semester: 5, cgpa: 6.9, attendance: 73, status: 'Needs support' },
  { id: 'DEMO-2406', name: 'Anika Patel', email: 'anika.demo@example.edu', branch: 'CSE (AI&ML)', section: 'A', semester: 3, cgpa: 8.1, attendance: 89, status: 'Good standing' },
  { id: 'DEMO-2407', name: 'Vihaan Nair', email: 'vihaan.demo@example.edu', branch: 'CSE (AI&ML)', section: 'B', semester: 3, cgpa: 5.8, attendance: 61, status: 'At risk' },
  { id: 'DEMO-2408', name: 'Saanvi Rao', email: 'saanvi.demo@example.edu', branch: 'CSE (AI&ML)', section: 'A', semester: 1, cgpa: 7.4, attendance: 81, status: 'Needs support' },
  { id: 'DEMO-2409', name: 'Arjun Singh', email: 'arjun.demo@example.edu', branch: 'CSE (AI&ML)', section: 'B', semester: 1, cgpa: 8.4, attendance: 94, status: 'Good standing' },
  { id: 'DEMO-2410', name: 'Tara Reddy', email: 'tara.demo@example.edu', branch: 'CSE (AI&ML)', section: 'A', semester: 7, cgpa: 7.1, attendance: 77, status: 'Needs support' },
];

export const hodDemoFaculty: HODFaculty[] = [
  { id: 'FAC-DEMO-01', name: 'Dr. Ananya Rao', email: 'ananya.demo@example.edu', designation: 'Professor & HOD', department: 'CSE (AI&ML)', subjects: ['Machine Learning', 'Deep Learning'], sections: 2, weeklyHours: 14, attendanceSubmitted: true },
  { id: 'FAC-DEMO-02', name: 'Dr. Vikram Reddy', email: 'vikram.demo@example.edu', designation: 'Associate Professor', department: 'CSE (AI&ML)', subjects: ['Computer Vision', 'Image Processing'], sections: 2, weeklyHours: 16, attendanceSubmitted: true },
  { id: 'FAC-DEMO-03', name: 'Prof. Neha Sharma', email: 'neha.demo@example.edu', designation: 'Assistant Professor', department: 'CSE (AI&ML)', subjects: ['Data Mining', 'Python Programming'], sections: 3, weeklyHours: 19, attendanceSubmitted: false },
  { id: 'FAC-DEMO-04', name: 'Dr. Kiran Kumar', email: 'kiran.demo@example.edu', designation: 'Associate Professor', department: 'CSE (AI&ML)', subjects: ['Operating Systems', 'Cloud Computing'], sections: 2, weeklyHours: 12, attendanceSubmitted: true },
  { id: 'FAC-DEMO-05', name: 'Prof. Farah Ali', email: 'farah.demo@example.edu', designation: 'Assistant Professor', department: 'CSE (AI&ML)', subjects: ['Software Engineering', 'Project Work'], sections: 2, weeklyHours: 17, attendanceSubmitted: false },
];

export const hodDemoSubjects: HODSubject[] = [
  { code: 'CS701', name: 'Machine Learning', kind: 'Theory', semester: 7, credits: 3, faculty: 'Dr. Ananya Rao', status: 'Active' },
  { code: 'CS702', name: 'Computer Vision', kind: 'Theory', semester: 7, credits: 3, faculty: 'Dr. Vikram Reddy', status: 'Active' },
  { code: 'CS703', name: 'Deep Learning Lab', kind: 'Lab', semester: 7, credits: 2, faculty: 'Dr. Ananya Rao', status: 'Active' },
  { code: 'CS704', name: 'Image Processing', kind: 'Theory', semester: 7, credits: 3, faculty: 'Dr. Vikram Reddy', status: 'Active' },
  { code: 'CS501', name: 'Data Mining', kind: 'Theory', semester: 5, credits: 3, faculty: 'Prof. Neha Sharma', status: 'Active' },
  { code: 'CS503', name: 'Operating Systems', kind: 'Theory', semester: 5, credits: 3, faculty: 'Dr. Kiran Kumar', status: 'Active' },
  { code: 'CS301', name: 'Python Programming', kind: 'Lab', semester: 3, credits: 2, faculty: 'Prof. Neha Sharma', status: 'Active' },
  { code: 'CS101', name: 'Programming Fundamentals', kind: 'Theory', semester: 1, credits: 4, faculty: 'Prof. Farah Ali', status: 'Draft' },
];

export const hodDemoSections: HODSection[] = [
  { name: 'CSE-A', semester: 7, students: 42, coordinator: 'Dr. Ananya Rao', faculty: '12 faculty', academicYear: '2026–27' },
  { name: 'CSE-B', semester: 7, students: 39, coordinator: 'Dr. Vikram Reddy', faculty: '11 faculty', academicYear: '2026–27' },
  { name: 'CSE-A', semester: 5, students: 44, coordinator: 'Prof. Neha Sharma', faculty: '10 faculty', academicYear: '2026–27' },
  { name: 'CSE-B', semester: 5, students: 41, coordinator: 'Dr. Kiran Kumar', faculty: '10 faculty', academicYear: '2026–27' },
];

export const hodDemoAttendance: HODAttendance[] = [
  { studentId: 'DEMO-2401', studentName: 'Aarav Reddy', section: 'CSE-A', semester: 7, subject: 'Machine Learning', held: 25, attended: 23 },
  { studentId: 'DEMO-2402', studentName: 'Diya Sharma', section: 'CSE-A', semester: 7, subject: 'Computer Vision', held: 25, attended: 24 },
  { studentId: 'DEMO-2403', studentName: 'Kabir Kumar', section: 'CSE-B', semester: 7, subject: 'Image Processing', held: 25, attended: 17 },
  { studentId: 'DEMO-2410', studentName: 'Tara Reddy', section: 'CSE-A', semester: 7, subject: 'Deep Learning Lab', held: 20, attended: 15 },
  { studentId: 'DEMO-2404', studentName: 'Meera Das', section: 'CSE-A', semester: 5, subject: 'Data Mining', held: 24, attended: 21 },
  { studentId: 'DEMO-2405', studentName: 'Ishaan Rao', section: 'CSE-B', semester: 5, subject: 'Operating Systems', held: 24, attended: 18 },
  { studentId: 'DEMO-2406', studentName: 'Anika Patel', section: 'CSE-A', semester: 3, subject: 'Python Programming', held: 22, attended: 20 },
  { studentId: 'DEMO-2407', studentName: 'Vihaan Nair', section: 'CSE-B', semester: 3, subject: 'Python Programming', held: 22, attended: 13 },
  { studentId: 'DEMO-2408', studentName: 'Saanvi Rao', section: 'CSE-A', semester: 1, subject: 'Programming Fundamentals', held: 20, attended: 16 },
  { studentId: 'DEMO-2409', studentName: 'Arjun Singh', section: 'CSE-B', semester: 1, subject: 'Programming Fundamentals', held: 20, attended: 19 },
];

export const hodDemoAssignments: HODAssignment[] = [
  { title: 'Model evaluation report', subject: 'Machine Learning', faculty: 'Dr. Ananya Rao', section: 'CSE-A', semester: 7, dueDate: '2026-11-18', students: 42, submitted: 31, evaluation: 'On track' },
  { title: 'Image segmentation lab', subject: 'Computer Vision', faculty: 'Dr. Vikram Reddy', section: 'CSE-B', semester: 7, dueDate: '2026-11-12', students: 39, submitted: 20, evaluation: 'Delayed' },
  { title: 'Data warehouse case study', subject: 'Data Mining', faculty: 'Prof. Neha Sharma', section: 'CSE-A', semester: 5, dueDate: '2026-11-20', students: 44, submitted: 44, evaluation: 'Complete' },
  { title: 'Process scheduling exercise', subject: 'Operating Systems', faculty: 'Dr. Kiran Kumar', section: 'CSE-B', semester: 5, dueDate: '2026-11-15', students: 41, submitted: 28, evaluation: 'On track' },
];

export const hodDemoExams: HODExam[] = [
  { name: 'Mid-term II', subject: 'Machine Learning', section: 'CSE-A', semester: 7, date: '2026-11-24', passRate: 87, backlogs: 5, status: 'Scheduled' },
  { name: 'Mid-term II', subject: 'Computer Vision', section: 'CSE-B', semester: 7, date: '2026-11-25', passRate: 82, backlogs: 7, status: 'Scheduled' },
  { name: 'Mid-term I', subject: 'Data Mining', section: 'CSE-A', semester: 5, date: '2026-10-19', passRate: 91, backlogs: 3, status: 'Published' },
  { name: 'Mid-term I', subject: 'Operating Systems', section: 'CSE-B', semester: 5, date: '2026-10-20', passRate: 76, backlogs: 11, status: 'Results pending' },
];

export const hodDemoLeaves: HODLeaveRequest[] = [
  { id: 'LV-DEMO-1024', applicant: 'Kabir Kumar', role: 'Student', leaveType: 'Medical', from: '2026-11-12', to: '2026-11-13', days: 2, reason: 'Medical appointment', submitted: '2026-11-09', status: 'Pending' },
  { id: 'LV-DEMO-1025', applicant: 'Prof. Neha Sharma', role: 'Faculty', leaveType: 'Personal', from: '2026-11-17', to: '2026-11-17', days: 1, reason: 'Personal leave', submitted: '2026-11-10', status: 'Pending' },
  { id: 'LV-DEMO-1026', applicant: 'Meera Das', role: 'Student', leaveType: 'Family', from: '2026-11-20', to: '2026-11-21', days: 2, reason: 'Family commitment', submitted: '2026-11-08', status: 'Approved' },
  { id: 'LV-DEMO-1027', applicant: 'Dr. Kiran Kumar', role: 'Faculty', leaveType: 'Conference', from: '2026-11-05', to: '2026-11-06', days: 2, reason: 'Academic conference', submitted: '2026-11-02', status: 'Approved' },
];

export const hodDemoAnnouncements: HODAnnouncement[] = [
  { id: 'ANN-DEMO-01', title: 'Mid-term examination schedule', description: 'The second mid-term examination schedule is now available for review.', priority: 'Important', audience: 'All Department Students', publishedAt: '2026-11-08', status: 'Published' },
  { id: 'ANN-DEMO-02', title: 'Project review dates', description: 'Project review slots will be shared with section coordinators this week.', priority: 'Normal', audience: 'Semester VII', publishedAt: '2026-11-06', status: 'Published' },
];

export const hodDemoNotifications: HODNotification[] = [
  { id: 'NOT-DEMO-01', title: 'Attendance shortage alert', detail: 'Two demonstration students are below the configured attendance threshold.', category: 'Attendance', time: 'Today, 09:15', read: false, destination: 'attendance' },
  { id: 'NOT-DEMO-02', title: 'Faculty attendance pending', detail: 'Two demonstration faculty submissions are outstanding.', category: 'Faculty', time: 'Today, 08:40', read: false, destination: 'faculty' },
  { id: 'NOT-DEMO-03', title: 'Evaluation reminder', detail: 'One demonstration assignment is marked delayed.', category: 'Assessment', time: 'Yesterday', read: false, destination: 'assignments' },
  { id: 'NOT-DEMO-04', title: 'Department announcement published', detail: 'Mid-term examination schedule was published.', category: 'Announcement', time: 'Nov 8', read: true, destination: 'announcements' },
];

export const hodPerformanceBySemester = [
  { semester: 'I', cgpa: 7.2, passRate: 82 },
  { semester: 'III', cgpa: 7.5, passRate: 85 },
  { semester: 'V', cgpa: 7.8, passRate: 88 },
  { semester: 'VII', cgpa: 8.0, passRate: 86 },
];

export const hodSubjectPerformance = [
  { subject: 'ML', passRate: 87 },
  { subject: 'Vision', passRate: 82 },
  { subject: 'Deep learning', passRate: 91 },
  { subject: 'Image proc.', passRate: 79 },
  { subject: 'Data mining', passRate: 88 },
];

export const hodAttendanceTrend = [
  { month: 'Jun', attendance: 88 },
  { month: 'Jul', attendance: 86 },
  { month: 'Aug', attendance: 89 },
  { month: 'Sep', attendance: 84 },
  { month: 'Oct', attendance: 87 },
  { month: 'Nov', attendance: 90 },
];

export const hodWorkloadByFaculty = hodDemoFaculty.map(({ name, weeklyHours }) => ({
  name: name.replace(/^(Dr\.|Prof\.)\s/, ''),
  hours: weeklyHours,
}));

export const hodNavigation = [
  { key: 'dashboard', title: 'Dashboard' },
  { key: 'overview', title: 'Department Overview' },
  { key: 'students', title: 'Students' },
  { key: 'faculty', title: 'Faculty & Workload' },
  { key: 'subjects', title: 'Subjects & Sections' },
  { key: 'attendance', title: 'Attendance' },
  { key: 'performance', title: 'Academic Performance' },
  { key: 'assignments', title: 'Assignments & Assessments' },
  { key: 'exams', title: 'Examinations & Results' },
  { key: 'leaves', title: 'Leave Approvals' },
  { key: 'announcements', title: 'Announcements' },
  { key: 'reports', title: 'Reports & Analytics' },
  { key: 'notifications', title: 'Notifications' },
  { key: 'settings', title: 'Profile & Settings' },
] as const;