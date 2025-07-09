
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';

const Syllabus = () => {
  const subjects = [
    {
      name: 'Operational Research',
      code: 'OR-301',
      progress: 75,
      color: 'bg-blue-500'
    },
    {
      name: 'Software Engineering',
      code: 'SE-301',
      progress: 80,
      color: 'bg-green-500'
    },
    {
      name: 'Operating System',
      code: 'OS-301',
      progress: 70,
      color: 'bg-purple-500'
    },
    {
      name: 'Data Visualization',
      code: 'DV-301',
      progress: 65,
      color: 'bg-orange-500'
    },
    {
      name: 'Machine Learning',
      code: 'ML-301',
      progress: 60,
      color: 'bg-red-500'
    },
    {
      name: 'Constitution of India',
      code: 'CI-301',
      progress: 85,
      color: 'bg-yellow-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      default: return <Book className="w-4 h-4" />;
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
            <h1 className="text-3xl font-bold text-gray-900">Course Syllabus</h1>
            <p className="text-gray-600">Track your academic progress across all subjects</p>
          </div>
        </div>

        <div className="space-y-6">
          {subjects.map((subject, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${subject.color} text-white`}>
                      <Book className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{subject.name}</CardTitle>
                      <p className="text-gray-600">{subject.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{subject.progress}%</p>
                    <p className="text-sm text-gray-500">Progress</p>
                  </div>
                </div>
                <Progress value={subject.progress} className="mt-4" />
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-600">Subject syllabus and course materials will be updated by the faculty.</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Syllabus;
