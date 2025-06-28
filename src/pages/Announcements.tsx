
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const Announcements = () => {
  const announcements = [
    {
      title: 'Exam Schedule Updated',
      content: 'The final exam schedule has been updated. Please check your timetable for any changes.',
      date: '2024-01-20',
      type: 'important',
      author: 'Academic Office'
    },
    {
      title: 'Library Hours Extended',
      content: 'Library will now be open until 10 PM during exam weeks to support student studies.',
      date: '2024-01-18',
      type: 'general',
      author: 'Library Staff'
    },
    {
      title: 'Chemistry Lab Maintenance',
      content: 'Chemistry lab will be closed for maintenance on January 25th. Classes will be held in alternate venue.',
      date: '2024-01-15',
      type: 'urgent',
      author: 'Lab Coordinator'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'important': return 'bg-yellow-100 text-yellow-800';
      case 'general': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="w-5 h-5" />;
      case 'important': return <Bell className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600">Stay updated with important notices</p>
          </div>
        </div>

        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(announcement.type)}`}>
                      {getTypeIcon(announcement.type)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                      <p className="text-sm text-gray-500">By {announcement.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {announcement.date}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Announcements;
