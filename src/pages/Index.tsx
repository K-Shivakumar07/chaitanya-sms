
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Book, Calendar, FileText, Download, Bell, User, Clock, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import QuickStats from '@/components/QuickStats';
import RecentActivity from '@/components/RecentActivity';
import { searchDocuments, SearchResult } from '@/data/documents';

const Index = () => {
  const [searchParams] = useSearchParams();
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [documentResults, setDocumentResults] = useState<SearchResult[]>([]);

  
  const features = [
    {
      title: 'Syllabus',
      description: 'View subject-wise curriculum and course outline',
      icon: BookOpen,
      link: '/syllabus',
      color: 'bg-blue-500'
    },
    {
      title: 'Timetable',
      description: 'Check your weekly class schedule',
      icon: Calendar,
      link: '/timetable',
      color: 'bg-green-500'
    },
    {
      title: 'Study Materials',
      description: 'Access learning resources and references',
      icon: Book,
      link: '/materials',
      color: 'bg-purple-500'
    },
    {
      title: 'Notes & PDFs',
      description: 'Download subject notes and documents',
      icon: FileText,
      link: '/notes',
      color: 'bg-orange-500'
    },
    {
      title: 'Assignments',
      description: 'Track pending and completed assignments',
      icon: Download,
      link: '/assignments',
      color: 'bg-red-500'
    },
    {
      title: 'Announcements',
      description: 'Stay updated with important notices',
      icon: Bell,
      link: '/announcements',
      color: 'bg-yellow-500'
    }
  ];

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const filtered = features.filter(feature => 
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFeatures(filtered);
      setDocumentResults(searchDocuments(searchQuery));
    } else {
      setFilteredFeatures(features);
      setDocumentResults([]);
    }
  }, [searchParams]);

  const searchQuery = searchParams.get('search');
  const totalResults = filteredFeatures.length + documentResults.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Welcome back, Student!'}
          </h1>
          <p className="text-gray-600">
            {searchQuery ? `Found ${totalResults} result(s)` : "Here's what's happening with your studies today."}
          </p>
        </div>

        {/* Document results */}
        {searchQuery && documentResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
            <div className="space-y-3">
              {documentResults.map((doc, index) => (
                <Link key={index} to={doc.link}>
                  <Card className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{doc.title}</p>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{doc.subject} • {doc.meta}</p>
                      </div>
                      <Badge variant="outline">{doc.kindLabel}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {searchQuery && totalResults === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500">Try searching for notes, materials, assignments or a subject name.</p>
          </div>
        )}

        {/* Quick Stats - only show if not searching */}
        {!searchQuery && <QuickStats />}


        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredFeatures.map((feature, index) => (
            <Link key={index} to={feature.link} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity - only show if not searching */}
        {!searchQuery && <RecentActivity />}
      </main>
    </div>
  );
};

export default Index;
