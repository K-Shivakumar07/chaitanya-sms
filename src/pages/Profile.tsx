import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Book, Camera, Pencil, Save, X, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { useSubjects } from '@/hooks/useSemesterData';
import { useStudentProfile, initials, StudentProfile } from '@/hooks/useStudentProfile';
import { useToast } from '@/hooks/use-toast';

const fields: { name: keyof StudentProfile; label: string }[] = [
  { name: 'name', label: 'Full name' },
  { name: 'studentId', label: 'Student ID' },
  { name: 'email', label: 'Email' },
  { name: 'phone', label: 'Phone' },
  { name: 'address', label: 'Address' },
  { name: 'enrollmentDate', label: 'Enrolled on' },
  { name: 'program', label: 'Program' },
  { name: 'major', label: 'Major' },
  { name: 'year', label: 'Academic year' },
  { name: 'gpa', label: 'Current GPA' },
];

const Profile = () => {
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const { profile, save } = useStudentProfile();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<StudentProfile>(profile);
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const set = (name: keyof StudentProfile, value: string) =>
    setDraft((prev) => ({ ...prev, [name]: value }));

  const onSave = () => {
    if (!draft.name.trim()) {
      toast({ title: 'Please enter your name', variant: 'destructive' });
      return;
    }
    save(draft);
    setEditing(false);
    toast({ title: 'Profile updated' });
  };

  const pickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please choose an image file', variant: 'destructive' });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast({ title: 'Image too large', description: 'Please pick an image under 3 MB.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const avatar = String(reader.result);
      if (editing) set('avatar', avatar);
      else save({ ...profile, avatar });
      toast({ title: 'Profile photo updated' });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeImage = () => {
    if (editing) set('avatar', '');
    else save({ ...profile, avatar: '' });
    toast({ title: 'Profile photo removed' });
  };

  const shown = editing ? draft : profile;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
              <p className="text-gray-600">Your academic information and details</p>
            </div>
          </div>
          {editing ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button size="sm" onClick={onSave}>
                <Save className="w-4 h-4 mr-2" /> Save changes
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={startEdit}>
              <Pencil className="w-4 h-4 mr-2" /> Edit profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={shown.avatar || undefined} alt={`${shown.name} profile photo`} />
                  <AvatarFallback className="text-2xl font-bold">{initials(shown.name)}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-md transition hover:opacity-90"
                  aria-label="Change profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={pickImage}
                />
              </div>
              {shown.avatar && (
                <Button variant="ghost" size="sm" className="mx-auto text-destructive" onClick={removeImage}>
                  <Trash2 className="w-4 h-4 mr-2" /> Remove photo
                </Button>
              )}
              <CardTitle className="text-2xl">{shown.name}</CardTitle>
              <p className="text-gray-600">{shown.studentId}</p>
              <Badge className="mt-2">{shown.year}</Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm break-all">{shown.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{shown.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{shown.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm">Enrolled: {shown.enrollmentDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{editing ? 'Edit your details' : 'Academic Information'}</CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map((f) => (
                      <div key={f.name} className={f.name === 'address' ? 'sm:col-span-2' : ''}>
                        <Label htmlFor={`profile-${f.name}`} className="text-xs">
                          {f.label}
                        </Label>
                        <Input
                          id={`profile-${f.name}`}
                          type={f.name === 'enrollmentDate' ? 'date' : 'text'}
                          value={String(draft[f.name] ?? '')}
                          onChange={(e) => set(f.name, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Program</p>
                      <p className="font-medium">{profile.program}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Major</p>
                      <p className="font-medium">{profile.major}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Academic Year</p>
                      <p className="font-medium">{profile.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current GPA</p>
                      <p className="font-medium text-green-600">{profile.gpa}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="w-5 h-5" />
                  <span>Current Subjects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subjectsLoading && <p className="text-sm text-gray-500">Loading subjects…</p>}
                  {!subjectsLoading && subjects.length === 0 && (
                    <p className="text-sm text-gray-500">No subjects found for this semester.</p>
                  )}
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-gray-500">{subject.faculty} • {subject.credits} credits</p>
                      </div>
                      <Badge variant="outline" className="font-medium">
                        {subject.code}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
