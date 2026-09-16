import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import SemesterGuard from '@/components/SemesterGuard';
import { useNotes } from '@/hooks/useSemesterData';
import { downloadCourseFile } from '@/lib/files';
import { useToast } from '@/hooks/use-toast';

const Notes = () => {
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const { toast } = useToast();
  const { data, isLoading } = useNotes();

  const handleDownload = async (id: string, fileUrl?: string | null) => {
    if (!fileUrl) return;
    setBusyId(id);
    try {
      await downloadCourseFile(fileUrl);
    } catch (err: any) {
      toast({ title: 'Could not open the file', description: err.message, variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  const notes = (data ?? []).filter((n) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [n.title, n.subject_name, n.faculty].join(' ').toLowerCase().includes(q);
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
              <h1 className="text-3xl font-bold text-gray-900">Notes & PDFs</h1>
              <p className="text-gray-600">Subject-wise class notes for your semester</p>
            </div>
          </div>

          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading notes…</p>
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notes found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((n) => (
                <Card key={n.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{n.title}</p>
                        <p className="text-sm text-gray-600">{n.subject_name} • {n.faculty}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {n.unit_no ? `Unit ${n.unit_no} • ` : ''}{n.pages} pages • {n.size_label} • {n.uploaded_at}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{n.file_type}</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </div>
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

export default Notes;
