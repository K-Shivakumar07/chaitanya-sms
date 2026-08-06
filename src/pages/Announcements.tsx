import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, AlertTriangle, Info, Megaphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import SemesterGuard from '@/components/SemesterGuard';
import { useAnnouncements } from '@/hooks/useSemesterData';

const icon = (category: string) => {
  if (category === 'urgent') return <AlertTriangle className="w-5 h-5 text-red-500" />;
  if (category === 'important') return <Megaphone className="w-5 h-5 text-orange-500" />;
  return <Info className="w-5 h-5 text-blue-500" />;
};

const Announcements = () => {
  const { data, isLoading } = useAnnouncements();

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
              <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
              <p className="text-gray-600">Notices from the department</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading announcements…</p>
          ) : (data ?? []).length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No announcements yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(data ?? []).map((a) => (
                <Card key={a.id}>
                  <CardContent className="p-5 flex gap-3">
                    <span className="mt-0.5">{icon(a.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-gray-900">{a.title}</p>
                        <Badge variant="outline" className="capitalize shrink-0">{a.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{a.body}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {a.posted_by} • {new Date(a.posted_at).toLocaleString()}
                      </p>
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

export default Announcements;
