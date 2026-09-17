# Portal Sidebar Navigation

## Goal
Add fast, collapsible navigation to the Student, Faculty, and Admin portals while preserving each portal’s existing pages, data, and actions.

## What will change
- Add a shared student portal frame with a responsive sidebar linking Dashboard, Syllabus, Timetable, Study Materials, Notes & PDFs, Assignments, Announcements, Attendance, and Profile.
- Keep the student search, notifications, semester switcher, profile access, and assistant available in the main header/content area.
- Add role-specific sidebars to Faculty and Admin dashboards using their existing management areas.
- Highlight the current page or active management area.
- Keep a compact icon rail on desktop and a slide-out menu on phones, with a visible menu control to reopen it.
- Preserve all existing create, edit, delete, upload, download, semester filtering, and “All semesters” behavior.

## Technical details
- Reuse the existing sidebar design components and semantic theme tokens.
- Introduce small shared navigation/layout components rather than duplicating sidebar markup across pages.
- Wire staff sidebar selections to the existing active tab state.
- Validate Student, Faculty, and Admin navigation at desktop and phone sizes and confirm a clean build.
