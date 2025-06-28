
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const Notes = () => {
  const notes = [
    {
      title: 'Calculus Notes - Chapter 5',
      subject: 'Mathematics',
      date: '2024-01-20',
      size: '2.3 MB',
      pages: 15,
      type: 'lecture'
    },
    {
      title: 'Physics Lab Report Template',
      subject: 'Physics',
      date: '2024-01-18',
      size: '1.8 MB',
      pages: 8,
      type: 'template'
    },
    {
      title: 'Organic Chemistry Summary',
      subject: 'Chemistry',
      date: '2024-01-15',
      size: '4.2 MB',
      pages: 22,
      type: 'summary'
    }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Notes & PDFs</h1>
            <p className="text-gray-600">Download and access your study notes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <p className="text-sm text-gray-500">{note.subject}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {note.date}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Size: {note.size}</span>
                    <span>{note.pages} pages</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{note.type}</Badge>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Notes;
