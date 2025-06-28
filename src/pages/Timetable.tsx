
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const Timetable = () => {
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const schedule = {
    'Monday': {
      '9:00 AM': { subject: 'Mathematics', room: 'Room 101', teacher: 'Dr. Smith', type: 'lecture' },
      '10:00 AM': { subject: 'Physics', room: 'Lab 201', teacher: 'Prof. Johnson', type: 'lab' },
      '2:00 PM': { subject: 'Chemistry', room: 'Room 103', teacher: 'Dr. Wilson', type: 'lecture' },
    },
    'Tuesday': {
      '9:00 AM': { subject: 'Chemistry', room: 'Lab 301', teacher: 'Dr. Wilson', type: 'lab' },
      '11:00 AM': { subject: 'Mathematics', room: 'Room 101', teacher: 'Dr. Smith', type: 'tutorial' },
      '1:00 PM': { subject: 'English', room: 'Room 205', teacher: 'Ms. Brown', type: 'lecture' },
    },
    'Wednesday': {
      '10:00 AM': { subject: 'Physics', room: 'Room 102', teacher: 'Prof. Johnson', type: 'lecture' },
      '2:00 PM': { subject: 'Mathematics', room: 'Room 101', teacher: 'Dr. Smith', type: 'lecture' },
      '3:00 PM': { subject: 'Computer Science', room: 'Lab 401', teacher: 'Mr. Davis', type: 'practical' },
    },
    'Thursday': {
      '9:00 AM': { subject: 'English', room: 'Room 205', teacher: 'Ms. Brown', type: 'lecture' },
      '11:00 AM': { subject: 'Chemistry', room: 'Room 103', teacher: 'Dr. Wilson', type: 'lecture' },
      '1:00 PM': { subject: 'Physics', room: 'Lab 201', teacher: 'Prof. Johnson', type: 'lab' },
    },
    'Friday': {
      '9:00 AM': { subject: 'Computer Science', room: 'Room 401', teacher: 'Mr. Davis', type: 'lecture' },
      '10:00 AM': { subject: 'Mathematics', room: 'Room 101', teacher: 'Dr. Smith', type: 'lecture' },
      '2:00 PM': { subject: 'Study Hall', room: 'Library', teacher: 'Self Study', type: 'study' },
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'tutorial': return 'bg-purple-100 text-purple-800';
      case 'practical': return 'bg-orange-100 text-orange-800';
      case 'study': return 'bg-gray-100 text-gray-800';
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
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {classInfo.room} • {classInfo.teacher}
                      </p>
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
                    <th className="text-left p-3 font-medium text-gray-900 min-w-[100px]">Time</th>
                    {days.map(day => (
                      <th key={day} className={`text-left p-3 font-medium min-w-[180px] ${day === currentDay ? 'text-blue-600 bg-blue-50' : 'text-gray-900'}`}>
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
                                <p className="text-xs text-gray-500 mb-2">
                                  {classInfo.room}
                                </p>
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
