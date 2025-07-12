
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertCircle, Book } from 'lucide-react';
import { getTodayClassCount, getNextClass } from '@/utils/timetable';

const QuickStats = () => {
  const todayClassCount = getTodayClassCount();
  const nextClass = getNextClass();
  
  const stats = [
    {
      title: 'Today\'s Classes',
      value: todayClassCount.toString(),
      description: `Next: ${nextClass}`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Assignments',
      value: '0',
      description: 'Due this week',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Completed Tasks',
      value: '0',
      description: 'This month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Study Materials',
      value: '0',
      description: 'Available resources',
      icon: Book,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <p className="text-xs text-gray-500">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
