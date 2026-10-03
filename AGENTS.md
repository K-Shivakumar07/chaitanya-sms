# Project Architecture Rules

- Keep portal navigation in `PortalSidebar` with opt-in role styling so Student, Faculty, and Admin share behavior without sharing forced presentation; compose the Student sidebar only inside the main dashboard and keep its header/sidebar frame outside the dashboard content scroller.