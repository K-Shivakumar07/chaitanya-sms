import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/context/SessionContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [name, setName] = useState('Aarav Sharma');
  const [rollNo, setRollNo] = useState('20B81A0512');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim()) return;
    signIn({
      name: name.trim(),
      rollNo: rollNo.trim().toUpperCase(),
      branch: 'B.Tech — Computer Science & Engineering',
      section: 'A',
      email: `${rollNo.trim().toLowerCase()}@college.edu`,
    });
    navigate('/semesters', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-7 w-7" />
          </div>
          <CardTitle className="font-display text-2xl">StudyHub Student Portal</CardTitle>
          <CardDescription>Sign in to access your B.Tech semester dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Student name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roll">Roll number</Label>
              <Input id="roll" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Continue</Button>
            <p className="text-center text-xs text-muted-foreground">Demo login — no password required.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
