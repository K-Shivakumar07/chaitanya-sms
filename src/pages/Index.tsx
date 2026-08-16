import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Shield, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRole, AppRole } from '@/context/RoleContext';

const MODULES: {
  role: AppRole;
  title: string;
  path: string;
  blurb: string;
  points: string[];
  icon: React.ElementType;
  accent: string;
}[] = [
  {
    role: 'student',
    title: 'Student',
    path: '/student',
    blurb: 'Pick your semester and open your personalised dashboard.',
    points: ['Syllabus, timetable & subjects', 'Materials, notes & assignments', 'Announcements, deadlines, AI assistant'],
    icon: BookOpen,
    accent: 'bg-blue-600',
  },
  {
    role: 'faculty',
    title: 'Faculty',
    path: '/faculty',
    blurb: 'Publish learning content and keep students up to date.',
    points: ['Upload materials & notes', 'Create assignments & deadlines', 'Post announcements and activity'],
    icon: Users,
    accent: 'bg-emerald-600',
  },
  {
    role: 'admin',
    title: 'Admin',
    path: '/admin',
    blurb: 'Manage the academic structure of every semester.',
    points: ['Subjects & syllabus units', 'Timetable slots', 'Faculty directory + all faculty tools'],
    icon: Shield,
    accent: 'bg-purple-600',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();

  const open = (role: AppRole, path: string) => {
    setRole(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 text-white mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">B.Tech Student Management</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Choose how you want to use the portal. Students browse their semester dashboard, faculty publish
            content, and admins manage the academic structure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <Card
                key={m.role}
                onClick={() => open(m.role, m.path)}
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl text-white mb-4 ${m.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{m.title}</p>
                  <p className="text-sm text-gray-500 mb-4">{m.blurb}</p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    {m.points.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center text-sm font-medium text-blue-600">
                    Continue <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;
