# Student dashboard sidebar adjustment

## Changes
- Show the student navigation sidebar only on the main `/dashboard` page.
- Remove the separate student layout wrapper from Syllabus, Timetable, Materials, Notes, Assignments, Announcements, Attendance, and Profile.
- Place the sidebar directly beside the dashboard heading and dashboard content.
- Remove the sidebar branding block, authorization label, and separate “Menu” header row.
- Keep mobile access through a compact menu trigger within the dashboard itself.
- Leave Faculty and Admin sidebars unchanged.

## Technical details
- Route student pages directly in `App.tsx` instead of nesting them under `StudentLayout`.
- Compose `SidebarProvider` and `PortalSidebar` inside `Dashboard.tsx` only.
- Add a student-sidebar option that suppresses the branding header without changing staff presentation.
- Verify desktop/mobile dashboard layout and confirm other student pages no longer include the sidebar.
