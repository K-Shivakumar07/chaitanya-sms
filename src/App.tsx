import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider, useSession } from '@/context/SessionContext';
import AppLayout from '@/components/AppLayout';
import Login from '@/pages/Login';
import Semesters from '@/pages/Semesters';
import Dashboard from '@/pages/Dashboard';
import Syllabus from '@/pages/Syllabus';
import Timetable from '@/pages/Timetable';
import Materials from '@/pages/Materials';
import Notes from '@/pages/Notes';
import Assignments from '@/pages/Assignments';
import Announcements from '@/pages/Announcements';
import Profile from '@/pages/Profile';
import Assistant from '@/pages/Assistant';
import SearchResults from '@/pages/SearchResults';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const Protected = ({ children }: { children: React.ReactNode }) => {
  const { student, semester } = useSession();
  if (!student) return <Navigate to="/login" replace />;
  if (!semester) return <Navigate to="/semesters" replace />;
  return <AppLayout>{children}</AppLayout>;
};

const Entry = () => {
  const { student, semester } = useSession();
  if (!student) return <Navigate to="/login" replace />;
  if (!semester) return <Navigate to="/semesters" replace />;
  return <Navigate to="/dashboard" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Entry />} />
            <Route path="/login" element={<Login />} />
            <Route path="/semesters" element={<Semesters />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/syllabus" element={<Protected><Syllabus /></Protected>} />
            <Route path="/timetable" element={<Protected><Timetable /></Protected>} />
            <Route path="/materials" element={<Protected><Materials /></Protected>} />
            <Route path="/notes" element={<Protected><Notes /></Protected>} />
            <Route path="/assignments" element={<Protected><Assignments /></Protected>} />
            <Route path="/announcements" element={<Protected><Announcements /></Protected>} />
            <Route path="/search" element={<Protected><SearchResults /></Protected>} />
            <Route path="/profile" element={<Protected><Profile /></Protected>} />
            <Route path="/assistant" element={<Protected><Assistant /></Protected>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionProvider>
  </QueryClientProvider>
);

export default App;
