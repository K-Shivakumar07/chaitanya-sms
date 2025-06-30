
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

interface ClassInfo {
  subject: string;
  room?: string;
  teacher?: string;
  type: string;
}

const Timetable = () => {
  const timeSlots = [
    '08:30 - 09:20',
    '09:20 - 10:10', 
    '10:10 - 11:00',
    '11:00 - 11:20',
    '11:20 - 12:10',
    '12:10 - 01:00',
    '01:00 - 01:50'
  ];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const schedule: Record<string, Record<string, ClassInfo>> = {
    'Monday': {
      '08:30 - 09:20': { subject: 'Operational Research', room: 'Room 101', teacher: 'Dr. Smith', type: 'lecture' },
      '09:20 - 10:10': { subject: 'Software Engineering', room: 'Room 102', teacher: 'Prof. Johnson', type: 'lecture' },
      '10:10 - 11:00': { subject: 'Operating System', room: 'Room 103', teacher: 'Dr. Wilson', type: 'lecture' },
      '11:00 - 11:20': { subject: 'Break', room: 'Cafeteria', teacher: '', type: 'break' },
      '11:20 - 12:10': { subject: 'Data Visualization', room: 'Lab 201', teacher: 'Ms. Brown', type: 'lab' },
      '12:10 - 01:00': { subject: 'Seminars/Quiz', room: 'Room 104', teacher: 'Various', type: 'seminar' },
      '01:00 - 01:50': { subject: 'Seminars/Quiz', room: 'Room 104', teacher: 'Various', type: 'seminar' }
    },
    'Tuesday': {
      '08:30 - 09:20': { subject: 'Operating System', room: 'Room 103', teacher: 'Dr. Wilson', type: 'lecture' },
      '09:20 - 10:10': { subject: 'Operational Research', room: 'Room 101', teacher: 'Dr. Smith', type: 'lecture' },
      '10:10 - 11:00': { subject: 'Data Visualization', room: 'Lab 201', teacher: 'Ms. Brown', type: 'lab' },
      '11:00 - 11:20': { subject: 'Break', room: 'Cafeteria', teacher: '', type: 'break' },
      '11:20 - 12:10': { subject: 'Machine Learning', room: 'Room 105', teacher: 'Dr. Davis', type: 'lecture' },
      '12:10 - 01:00': { subject: 'Seminars', room: 'Room 104', teacher: 'Various', type: 'seminar' },
      '01:00 - 01:50': { subject: 'Software Engineering', room: 'Room 102', teacher: 'Prof. Johnson', type: 'lecture' }
    },
    'Wednesday': {
      '08:30 - 09:20': { subject: 'Operating System', room: 'Room 103', teacher: 'Dr. Wilson', type: 'lecture' },
      '09:20 - 10:10': { subject: 'Operational Research', room: 'Room 101', teacher: 'Dr. Smith', type: 'lecture' },
      '10:10 - 11:00': { subject: 'Software Engineering', room: 'Room 102', teacher: 'Prof. Johnson', type: 'lecture' },
      '11:00 - 11:20': { subject: 'Break', room: 'Cafeteria', teacher: '', type: 'break' },
      '11:20 - 12:10': { subject: 'Machine Learning', room: 'Room 105', teacher: 'Dr. Davis', type: 'lecture' },
      '12:10 - 01:00': { subject: 'Seminars/Quiz', room: 'Room 104', teacher: 'Various', type: 'seminar' },
      '01:00 - 01:50': { subject: 'Seminars/Quiz', room: 'Room 104', teacher: 'Various', type: 'seminar' }
    },
    'Thursday': {
      '08:30 - 09:20': { subject: 'Constitution of India', room: 'Room 106', teacher: 'Prof. Sharma', type: 'lecture' },
      '09:20 - 10:10': { subject: 'Operating System', room: 'Room 103', teacher: 'Dr. Wilson', type: 'lecture' },
      '10:10 - 11:00': { subject: 'Data Visualization', room: 'Lab 201', teacher: 'Ms. Brown', type: 'lab' },
      '11:00 - 11:20': { subject: 'Break', room: 'Cafeteria', teacher: '', type: 'break' },
      '11:20 - 12:10': { subject: 'Machine Learning', room: 'Room 105', teacher: 'Dr. Davis', type: 'lecture' },
      '12:10 - 01:00': { subject: 'II BT OS LAB[ ] I BT DATA VISU.LAB[ ]', room: 'Lab 301/302', teacher: 'Lab Staff', type: 'lab' },
      '01:00 - 01:50': { subject: 'II BT OS LAB[ ] I BT DATA VISU.LAB[ ]', room: 'Lab 301/302', teacher: 'Lab Staff', type: 'lab' }
    },
    'Friday': {
      '08:30 - 09:20': { subject: 'Operational Research', room: 'Room 101', teacher: 'Dr. Smith', type: 'lecture' },
      '09:20 - 10:10': { subject: 'Data Visualization', room: 'Lab 201', teacher: 'Ms. Brown', type: 'lab' },
      '10:10 - 11:00': { subject: 'Constitution of India', room: 'Room 106', teacher: 'Prof. Sharma', type: 'lecture' },
      '11:00 - 11:20': { subject: 'Break', room: 'Cafeteria', teacher: '', type: 'break' },
      '11:20 - 12:10': { subject: 'Machine Learning', room: 'Room 105', teacher: 'Dr. Davis', type: 'lecture' },
      '12:10 - 01:00': { subject: 'I BT OS LAB[ ] II BT DATA VISU.LAB[ ]', room: 'Lab 301/302', teacher: 'Lab Staff', type: 'lab' },
      '01:00 - 01:50': { subject: 'I BT OS LAB[ ] II BT DATA VISU.LAB[ ]', room: 'Lab 301/302', teacher: 'Lab Staff', type: 'lab' }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'seminar': return 'bg-purple-100 text-purple-800';
      case 'break': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weekly Timetable</h1>
            <p className="text-gray-600">Your class schedule for this week</p>
          </div>
        </div>

        {/* Current Day Highlight */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Today - {currentDay}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {schedule[currentDay] ? Object.entries(schedule[currentDay]).map(([time, classInfo]) => (
                <div key={time} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">{time}</div>
                    <div>
                      <p className="font-medium text-gray-900">{classInfo.subject}</p>
                      {classInfo.room && classInfo.teacher && (
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {classInfo.room} • {classInfo.teacher}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className={getTypeColor(classInfo.type)}>
                    {classInfo.type}
                  </Badge>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">No classes scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Full Week Timetable */}
        <Card>
          <CardHeader>
            <CardTitle>Full Week Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-900 min-w-[120px]">Time</th>
                    {days.map(day => (
                      <th key={day} className={`text-left p-3 font-medium min-w-[200px] ${day === currentDay ? 'text-blue-600 bg-blue-50' : 'text-gray-900'}`}>
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(time => (
                    <tr key={time} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-700 bg-gray-50">
                        {time}
                      </td>
                      {days.map(day => {
                        const classInfo = schedule[day]?.[time];
                        return (
                          <td key={`${day}-${time}`} className={`p-2 ${day === currentDay ? 'bg-blue-50' : ''}`}>
                            {classInfo ? (
                              <div className="bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                                <p className="font-medium text-sm text-gray-900 mb-1">
                                  {classInfo.subject}
                                </p>
                                {classInfo.room && (
                                  <p className="text-xs text-gray-500 mb-2">
                                    {classInfo.room}
                                  </p>
                                )}
                                <Badge className={`text-xs ${getTypeColor(classInfo.type)}`}>
                                  {classInfo.type}
                                </Badge>
                              </div>
                            ) : (
                              <div className="h-16"></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Timetable;
