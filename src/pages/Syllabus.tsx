
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
      name: 'Mathematics',
      code: 'MATH-101',
      progress: 75,
      totalChapters: 12,
      completedChapters: 9,
      color: 'bg-blue-500',
      chapters: [
        { name: 'Algebra Basics', status: 'completed', duration: '2 weeks' },
        { name: 'Calculus Introduction', status: 'completed', duration: '3 weeks' },
        { name: 'Trigonometry', status: 'completed', duration: '2 weeks' },
        { name: 'Statistics', status: 'in-progress', duration: '2 weeks' },
        { name: 'Probability', status: 'pending', duration: '2 weeks' }
      ]
    },
    {
      name: 'Physics',
      code: 'PHY-101',
      progress: 60,
      totalChapters: 10,
      completedChapters: 6,
      color: 'bg-green-500',
      chapters: [
        { name: 'Mechanics', status: 'completed', duration: '3 weeks' },
        { name: 'Thermodynamics', status: 'completed', duration: '2 weeks' },
        { name: 'Waves and Sound', status: 'in-progress', duration: '2 weeks' },
        { name: 'Electricity', status: 'pending', duration: '3 weeks' },
        { name: 'Magnetism', status: 'pending', duration: '2 weeks' }
      ]
    },
    {
      name: 'Chemistry',
      code: 'CHEM-101',
      progress: 80,
      totalChapters: 8,
      completedChapters: 6,
      color: 'bg-purple-500',
      chapters: [
        { name: 'Atomic Structure', status: 'completed', duration: '2 weeks' },
        { name: 'Chemical Bonding', status: 'completed', duration: '3 weeks' },
        { name: 'Organic Chemistry', status: 'in-progress', duration: '4 weeks' },
        { name: 'Inorganic Chemistry', status: 'pending', duration: '3 weeks' }
      ]
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
                    <p className="text-sm text-gray-500">
                      {subject.completedChapters}/{subject.totalChapters} chapters
                    </p>
                  </div>
                </div>
                <Progress value={subject.progress} className="mt-4" />
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  {subject.chapters.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(chapter.status)} flex items-center justify-center`}>
                          {getStatusIcon(chapter.status)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{chapter.name}</h4>
                          <p className="text-sm text-gray-500">Duration: {chapter.duration}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(chapter.status)}>
                        {chapter.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  ))}
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
