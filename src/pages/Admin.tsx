import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffShell from '@/components/staff/StaffShell';
import CrudPanel from '@/components/staff/CrudPanel';
import { adminPanels } from '@/components/staff/panels';

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
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto">
          {adminPanels.map((p) => (
            <TabsTrigger key={p.value} value={p.value}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {adminPanels.map((p) => (
          <TabsContent key={p.value} value={p.value} className="mt-6">
            <CrudPanel {...p.panel(semester)} />
          </TabsContent>
        ))}
      </Tabs>
    </StaffShell>
  );
};

export default Admin;
