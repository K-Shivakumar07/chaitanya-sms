import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SemesterProvider } from "@/context/SemesterContext";
import { RoleProvider } from "@/context/RoleContext";
import Index from "./pages/Index";
import SelectSemester from "./pages/SelectSemester";
import Faculty from "./pages/Faculty";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Syllabus from "./pages/Syllabus";
import Timetable from "./pages/Timetable";
import Materials from "./pages/Materials";
import Notes from "./pages/Notes";
import Assignments from "./pages/Assignments";
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Attendance from "./pages/Attendance";
import Assistant from "./pages/Assistant";
import StudentLayout from "./components/StudentLayout";
import AssistantBot from "./components/AssistantBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
    <SemesterProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student" element={<SelectSemester />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/admin" element={<Admin />} />
            <Route element={<StudentLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/syllabus" element={<Syllabus />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/assistant" element={<Assistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AssistantBot />
        </BrowserRouter>
      </TooltipProvider>
    </SemesterProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;
