# Project Architecture Rules

- Keep portal navigation in `PortalSidebar` with opt-in role styling so Student, Faculty, and Admin share behavior; use a non-collapsible desktop sidebar and keep every portal header/sidebar frame outside its content scroller.
- Keep HOD-only workflows in isolated, typed demonstration data and local UI state; do not write HOD actions to shared academic tables without explicit authorization boundaries.