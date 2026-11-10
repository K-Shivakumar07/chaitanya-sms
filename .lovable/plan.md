# HOD Portal

## Goal
Add a responsive, frontend-only HOD workspace that feels native to the existing Student, Faculty, and Admin portals.

## What will change
- Add HOD to the role-selection page and create a dedicated HOD route with the shared university header, sidebar, semester controls, and sign-out behavior.
- Build a dashboard and the requested department modules: overview, students, faculty/workload, subjects/sections, attendance, academic performance, assessments, examinations, leave approvals, announcements, reports, notifications, and profile/settings.
- Use centralized typed demonstration data and local state for interactive search, filters, tables, approvals, announcement editing, notifications, workload changes, and CSV report exports; clearly label simulated actions.
- Use existing UI tokens/components and installed charting tools; leave existing portals and database/auth configuration unchanged.

## Technical details
- Extend role/navigation wiring and introduce focused HOD page/data modules rather than changing existing portal behavior.
- Use seeded, clearly identified demo records for HOD-only data; do not represent them as live institutional records.
- Verify the HOD route and key interactions at desktop and mobile sizes, and confirm existing portal routes still load.