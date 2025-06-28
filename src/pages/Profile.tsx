
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Book } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const Profile = () => {
  const studentInfo = {
    name: 'John Doe',
    studentId: 'STU2024001',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567',
    address: '123 University Ave, College Town, CT 06510',
    enrollmentDate: '2023-09-01',
    program: 'Bachelor of Science',
    major: 'Computer Science',
    year: 'Sophomore',
    gpa: '3.8'
  };

  const subjects = [
    { name: 'Mathematics', grade: 'A', credits: 4 },
    { name: 'Physics', grade: 'A-', credits: 4 },
    { name: 'Chemistry', grade: 'B+', credits: 3 },
    { name: 'English', grade: 'A', credits: 3 },
    { name: 'Computer Science', grade: 'A+', credits: 4 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl font-bold">JD</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{studentInfo.name}</CardTitle>
              <p className="text-gray-600">{studentInfo.studentId}</p>
              <Badge className="mt-2">{studentInfo.year}</Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{studentInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{studentInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{studentInfo.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm">Enrolled: {studentInfo.enrollmentDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Program</p>
                    <p className="font-medium">{studentInfo.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Major</p>
                    <p className="font-medium">{studentInfo.major}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Academic Year</p>
                    <p className="font-medium">{studentInfo.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current GPA</p>
                    <p className="font-medium text-green-600">{studentInfo.gpa}</p>
                  </div>
                </div>
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
                  {subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-gray-500">{subject.credits} credits</p>
                      </div>
                      <Badge variant="outline" className="font-medium">
                        {subject.grade}
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
