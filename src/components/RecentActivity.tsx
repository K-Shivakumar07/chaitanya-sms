
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Calendar, Bell } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      type: 'assignment',
      title: 'Physics Lab Report submitted',
      time: '2 hours ago',
      icon: FileText,
      status: 'completed'
    },
    {
      type: 'material',
      title: 'New Chemistry notes uploaded',
      time: '5 hours ago',
      icon: FileText,
      status: 'new'
    },
    {
      type: 'announcement',
      title: 'Exam schedule updated',
      time: '1 day ago',
      icon: Bell,
      status: 'important'
    },
    {
      type: 'class',
      title: 'Mathematics class rescheduled',
      time: '2 days ago',
      icon: Calendar,
      status: 'updated'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'important': return 'bg-red-100 text-red-800';
      case 'updated': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                  <activity.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
                <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Chemistry Assignment</p>
                <p className="text-sm text-gray-500">Due in 2 days</p>
              </div>
              <Badge className="bg-orange-100 text-orange-800">High</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Math Quiz</p>
                <p className="text-sm text-gray-500">Due in 5 days</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">History Essay</p>
                <p className="text-sm text-gray-500">Due in 1 week</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Low</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivity;
