import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Calendar, Bell, AlertTriangle } from 'lucide-react';
import { useActivities, useDeadlines } from '@/hooks/useSemesterData';

const kindIcon = (kind: string) => {
  if (kind === 'assignment') return FileText;
  if (kind === 'class' || kind === 'timetable') return Calendar;
  if (kind === 'announcement') return Bell;
  return Clock;
};

const RecentActivity = () => {
  const { data: activities, isLoading: loadingActivities } = useActivities();
  const { data: deadlines, isLoading: loadingDeadlines } = useDeadlines();

  const relative = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.round(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
  };

  const daysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().setHours(0, 0, 0, 0);
    const days = Math.round(diff / 86400000);
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingActivities ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : (activities ?? []).length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity for this semester.</p>
          ) : (
            (activities ?? []).slice(0, 6).map((a) => {
              const Icon = kindIcon(a.kind);
              return (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Icon className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{a.title}</p>
                    {a.detail && <p className="text-xs text-gray-600">{a.detail}</p>}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{relative(a.occurred_at)}</span>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Upcoming Deadlines</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingDeadlines ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : (deadlines ?? []).length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming deadlines.</p>
          ) : (
            (deadlines ?? []).slice(0, 6).map((d) => (
              <div key={d.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{d.title}</p>
                  {d.detail && <p className="text-xs text-gray-600">{d.detail}</p>}
                  <p className="text-xs text-gray-500 mt-1">{d.category} • {d.due_date}</p>
                </div>
                <Badge className={d.urgent ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                  {daysLeft(d.due_date)}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivity;
