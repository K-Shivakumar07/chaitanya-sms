# Faculty and Admin Dashboard Redesign

## Goal
Bring the Faculty and Admin portals into the same clean dashboard design language as the Student portal while preserving every role-specific management function.

## What will change
- Rebuild both portal home views with the student dashboard’s header hierarchy, page title, summary cards, management cards, spacing, borders, and responsive behavior.
- Keep the Faculty tools: Study Materials, Notes & PDFs, Assignments, Deadlines, Announcements, Recent Activity, and Attendance.
- Keep the Admin tools: Subjects, Syllabus, Timetable, Faculty & Staff, plus every Faculty tool.
- Open each management area within the dashboard using clear navigation and retain Add, Delete, form, and list behavior.
- Keep semester switching available throughout both portals.
- Show “All semesters” only for Announcements and Recent Activity, retaining the existing automatic fallback on other areas.
- Preserve the college logo, role labels, Switch module action, and the floating assistant.
- Adapt navigation and content for desktop and mobile without removing or changing stored data.

## Technical details
- Refactor the shared staff shell into a student-dashboard-style frame so Faculty and Admin stay visually consistent.
- Add role-appropriate summary counts from the existing semester data.
- Restyle the shared management panel and navigation using existing design tokens and UI components.
- Keep the current panel definitions and data operations unchanged.
- Validate Faculty and Admin workflows at desktop and mobile sizes and confirm the build is clean.
