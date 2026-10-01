import React, { useEffect, useState } from 'react';
import StaffShell from '@/components/staff/StaffShell';
import StaffDashboard from '@/components/staff/StaffDashboard';
import { adminPanels } from '@/components/staff/panels';
import { panelIcons } from '@/components/staff/StaffDashboard';
import { FileText } from 'lucide-react';

const Admin = () => {
  const [semester, setSemester] = useState<number>(7);
  const [activeTab, setActiveTab] = useState<string>(adminPanels[0].value);
  const activePanel = adminPanels.find((p) => p.value === activeTab);
  const allowAllSemesters = activePanel?.allowAllSemesters ?? false;

  useEffect(() => {
    if (semester === 0 && !allowAllSemesters) {
      setSemester(7);
    }
  }, [semester, allowAllSemesters]);

  return (
    <StaffShell
      title="Admin Portal"
      subtitle="Manage subjects, syllabus, timetable, faculty and all content"
      semester={semester}
      onSemesterChange={setSemester}
      allowAllSemesters={allowAllSemesters}
      navItems={adminPanels.map((p) => ({ key: p.value, title: p.label, icon: panelIcons[p.value as keyof typeof panelIcons] ?? FileText }))}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <StaffDashboard
        role="Admin"
        semester={semester}
        panels={adminPanels}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </StaffShell>
  );
};

export default Admin;
