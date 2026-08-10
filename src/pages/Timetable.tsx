import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import SemesterGuard from '@/components/SemesterGuard';
import { useTimetable } from '@/hooks/useSemesterData';
import { formatRange12 } from '@/utils/time';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Timetable = () => {
  const { data, isLoading } = useTimetable();
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [day, setDay] = useState<string>(DAYS.includes(todayName) ? todayName : 'Monday');

  const slots = (data ?? []).filter((s) => s.day === day);

  return (
    <SemesterGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
              <p className="text-gray-600">Day-wise class schedule</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {DAYS.map((d) => (
              <Button key={d} size="sm" variant={day === d ? 'default' : 'outline'} onClick={() => setDay(d)}>
                {d}
                {d === todayName && <span className="ml-1 text-xs">(today)</span>}
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" /> {day}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <p className="text-gray-500">Loading timetable…</p>
              ) : slots.length === 0 ? (
                <p className="text-gray-500">No classes scheduled for {day}.</p>
              ) : (
                slots.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-4 border rounded-lg p-4">
                    <div>
                      <p className="font-medium text-gray-900">{s.subject_name}</p>
                      <p className="text-sm text-gray-600">{s.faculty} • Room {s.room}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-gray-900">{formatRange12(s.start_time, s.end_time)}</p>
                      {s.is_lab && <Badge className="mt-1 bg-purple-100 text-purple-800">Lab</Badge>}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </SemesterGuard>
  );
};

export default Timetable;
