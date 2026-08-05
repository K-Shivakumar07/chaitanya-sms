
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Syllabus from "./pages/Syllabus";
import Timetable from "./pages/Timetable";
import Materials from "./pages/Materials";
import Notes from "./pages/Notes";
import Assignments from "./pages/Assignments";
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AssistantBot from "./components/AssistantBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <AssistantBot />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
