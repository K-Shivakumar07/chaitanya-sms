import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertCircle, Book } from 'lucide-react';
import { useTimetable, useAssignments, useMaterials, useNotes } from '@/hooks/useSemesterData';

const QuickStats = () => {
  const { data: slots } = useTimetable();
  const { data: assignments } = useAssignments();
  const { data: materials } = useMaterials();
  const { data: notes } = useNotes();

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaySlots = (slots ?? []).filter((s) => s.day === todayName);
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };
  const next = todaySlots.find((s) => toMinutes(s.start_time) > nowMinutes);

  const pending = (assignments ?? []).filter((a) => a.status !== 'submitted');
  const completed = (assignments ?? []).filter((a) => a.status === 'submitted');

  const stats = [
    {
      title: "Today's Classes",
      value: String(todaySlots.length),
      description: next ? `Next: ${next.subject_name} at ${next.start_time}` : 'No more classes today',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Assignments',
      value: String(pending.length),
      description: 'Awaiting submission',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Tasks',
      value: String(completed.length),
      description: 'Submitted assignments',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Study Materials',
      value: String((materials ?? []).length + (notes ?? []).length),
      description: 'Materials and notes',
      icon: Book,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
