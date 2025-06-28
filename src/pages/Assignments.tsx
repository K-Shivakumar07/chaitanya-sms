
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const Assignments = () => {
  const assignments = [
    {
      title: 'Physics Lab Report',
      subject: 'Physics',
      dueDate: '2024-01-25',
      status: 'pending',
      priority: 'high',
      description: 'Complete the thermodynamics experiment report'
    },
    {
      title: 'Math Problem Set 5',
      subject: 'Mathematics',
      dueDate: '2024-01-28',
      status: 'in-progress',
      priority: 'medium',
      description: 'Solve calculus integration problems'
    },
    {
      title: 'Chemistry Essay',
      subject: 'Chemistry',
      dueDate: '2024-02-02',
      status: 'pending',
      priority: 'low',
      description: 'Write about organic compounds applications'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600">Track your pending and completed assignments</p>
          </div>
        </div>

        <div className="space-y-4">
          {assignments.map((assignment, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{assignment.title}</CardTitle>
                    <p className="text-gray-600">{assignment.subject}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(assignment.priority)}>
                      {assignment.priority} priority
                    </Badge>
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 mb-4">{assignment.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Due: {assignment.dueDate}
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm">Submit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Assignments;
