import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffShell from '@/components/staff/StaffShell';
import CrudPanel from '@/components/staff/CrudPanel';
import { facultyPanels } from '@/components/staff/panels';

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
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto">
          {facultyPanels.map((p) => (
            <TabsTrigger key={p.value} value={p.value}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {facultyPanels.map((p) => (
          <TabsContent key={p.value} value={p.value} className="mt-6">
            <CrudPanel {...p.panel(semester)} />
          </TabsContent>
        ))}
      </Tabs>
    </StaffShell>
  );
};

export default Faculty;
