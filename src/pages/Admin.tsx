import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffShell from '@/components/staff/StaffShell';
import CrudPanel from '@/components/staff/CrudPanel';
import { adminPanels } from '@/components/staff/panels';

const Admin = () => {
  const [semester, setSemester] = useState<number>(7);

  return (
    <StaffShell
      title="Admin Portal"
      subtitle="Manage subjects, syllabus, timetable, faculty and all content"
      semester={semester}
      onSemesterChange={setSemester}
    >
      <Tabs defaultValue={adminPanels[0].value}>
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
