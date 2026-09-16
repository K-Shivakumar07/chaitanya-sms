import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Download, Search, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import SemesterGuard from '@/components/SemesterGuard';
import { useMaterials } from '@/hooks/useSemesterData';

const Materials = () => {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useMaterials();

  const materials = (data ?? []).filter((m) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [m.title, m.subject_name, m.description ?? '', m.file_type].join(' ').toLowerCase().includes(q);
  });

  return (
    <SemesterGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
              <p className="text-gray-600">Slides, references and resources for your semester</p>
            </div>
          </div>

          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search materials..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading materials…</p>
          ) : materials.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No study materials found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((m) => (
                <Card key={m.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base leading-snug">{m.title}</CardTitle>
                      <Badge variant="outline">{m.file_type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{m.subject_name}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{m.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {m.unit_no ? `Unit ${m.unit_no} • ` : ''}
                        {m.size_label} • {m.uploaded_at}
                      </span>
                      <span>{m.downloads} downloads</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={!m.file_url || busyId === m.id}
                      onClick={() => handleDownload(m.id, m.file_url)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {!m.file_url ? 'No file uploaded' : busyId === m.id ? 'Preparing…' : 'Download'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </SemesterGuard>
  );
};

export default Materials;
