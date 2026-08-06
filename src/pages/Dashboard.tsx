import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ClipboardList, Clock, Megaphone, Activity as ActivityIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Dashboard = () => {
  const { semester, student } = useSession();
  const today = DAY_NAMES[new Date().getDay()];
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!semester) return;
    (async () => {
      const [t, a, d, an, ac] = await Promise.all([
        supabase.from('timetable_slots').select('*').eq('semester', semester).eq('day', today).order('start_time'),
        supabase.from('assignments').select('*').eq('semester', semester).order('due_date'),
        supabase.from('deadlines').select('*').eq('semester', semester).order('due_date').limit(5),
        supabase.from('announcements').select('*').eq('semester', semester).order('posted_at', { ascending: false }).limit(4),
        supabase.from('activities').select('*').eq('semester', semester).order('occurred_at', { ascending: false }).limit(6),
      ]);
      setClasses(t.data ?? []);
      setAssignments(a.data ?? []);
      setDeadlines(d.data ?? []);
      setAnnouncements(an.data ?? []);
      setActivities(ac.data ?? []);
    })();
  }, [semester, today]);

  const pending = assignments.filter((a) => a.status !== 'submitted');

  const stats = [
    { label: "Today's classes", value: classes.length, icon: CalendarDays, to: '/timetable' },
    { label: 'Pending assignments', value: pending.length, icon: ClipboardList, to: '/assignments' },
    { label: 'Upcoming deadlines', value: deadlines.length, icon: Clock, to: '/assignments' },
    { label: 'New announcements', value: announcements.length, icon: Megaphone, to: '/announcements' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Welcome back, {student?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Semester {semester} • {today}'s academic overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-card">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Today's classes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {classes.length === 0 && <p className="text-sm text-muted-foreground">No classes scheduled today.</p>}
            {classes.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{c.subject_name}</p>
                  <p className="text-xs text-muted-foreground">{c.faculty} • {c.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{c.start_time?.slice(0, 5)} - {c.end_time?.slice(0, 5)}</p>
                  {c.is_lab && <Badge variant="secondary" className="mt-1">Lab</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Upcoming deadlines</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {deadlines.length === 0 && <p className="text-sm text-muted-foreground">Nothing due right now.</p>}
            {deadlines.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.category}</p>
                </div>
                <Badge variant={d.urgent ? 'destructive' : 'outline'}>{d.due_date}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Recent announcements</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-lg border p-3">
                <p className="font-medium">{a.title}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><ActivityIcon className="h-4 w-4" /> Recent activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
