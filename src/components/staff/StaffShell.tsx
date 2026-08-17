import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { romanSemester } from '@/context/SemesterContext';

interface StaffShellProps {
  title: string;
  subtitle: string;
  semester: number;
  onSemesterChange: (n: number) => void;
  children: React.ReactNode;
}

const StaffShell = ({ title, subtitle, semester, onSemesterChange, children }: StaffShellProps) => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/lovable-uploads/63f128ca-12f8-480a-9026-c6299e38a2c2.png"
            alt="Chaitanya College Logo"
            className="h-10 w-auto object-contain"
          />
          <div>
            <p className="font-semibold text-gray-900 leading-tight">{title}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={String(semester)} onValueChange={(v) => onSemesterChange(Number(v))}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="0">All semesters</SelectItem>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  Semester {romanSemester(n)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-1" /> Switch module
            </Link>
          </Button>
        </div>
      </div>
    </header>
    <main className="container mx-auto px-4 py-8">{children}</main>
  </div>
);

export default StaffShell;
