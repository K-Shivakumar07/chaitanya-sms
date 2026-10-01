import React, { useEffect, useState } from 'react';
import StaffShell from '@/components/staff/StaffShell';
import StaffDashboard from '@/components/staff/StaffDashboard';
import { facultyPanels } from '@/components/staff/panels';
import { panelIcons } from '@/components/staff/StaffDashboard';
import { FileText } from 'lucide-react';

const Faculty = () => {
  const [semester, setSemester] = useState<number>(7);
  const [activeTab, setActiveTab] = useState<string>(facultyPanels[0].value);
  const activePanel = facultyPanels.find((p) => p.value === activeTab);
  const allowAllSemesters = activePanel?.allowAllSemesters ?? false;

  useEffect(() => {
    if (semester === 0 && !allowAllSemesters) {
      setSemester(7);
    }
  }, [semester, allowAllSemesters]);

  return (
    <StaffShell
      title="Faculty Portal"
      subtitle="Upload materials, notes, assignments and notices"
      semester={semester}
      onSemesterChange={setSemester}
      allowAllSemesters={allowAllSemesters}
      navItems={facultyPanels.map((p) => ({ key: p.value, title: p.label, icon: panelIcons[p.value as keyof typeof panelIcons] ?? FileText }))}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <StaffDashboard
        role="Faculty"
        semester={semester}
        panels={facultyPanels}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </StaffShell>
  );
};

export default Faculty;
