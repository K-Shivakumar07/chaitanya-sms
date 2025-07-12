
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Upload, Eye, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';

const Syllabus = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File}>({});
  
  // Load saved files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('syllabusFiles');
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      // Convert the saved file data back to File objects if needed
      // For now, we'll just track that files were uploaded
      setUploadedFiles(parsedFiles);
    }
  }, []);
  
  const subjects = [
    {
      name: 'Operational Research',
      color: 'bg-blue-500'
    },
    {
      name: 'Software Engineering',
      color: 'bg-green-500'
    },
    {
      name: 'Operating System',
      color: 'bg-purple-500'
    },
    {
      name: 'Data Visualization',
      color: 'bg-orange-500'
    },
    {
      name: 'Machine Learning',
      color: 'bg-red-500'
    },
    {
      name: 'Constitution of India',
      color: 'bg-yellow-500'
    }
  ];

  const handleFileUpload = (subjectName: string, file: File) => {
    const updatedFiles = {
      ...uploadedFiles,
      [subjectName]: file
    };
    setUploadedFiles(updatedFiles);
    
    // Save to localStorage permanently
    const fileData = {
      ...updatedFiles,
      [subjectName]: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }
    };
    localStorage.setItem('syllabusFiles', JSON.stringify(fileData));
  };

  const handleViewSyllabus = (subjectName: string) => {
    const file = uploadedFiles[subjectName];
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
  };

  const allSyllabusUploaded = subjects.every(subject => uploadedFiles[subject.name]);


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
            <h1 className="text-3xl font-bold text-gray-900">Course Syllabus</h1>
            <p className="text-gray-600">Track your academic progress across all subjects</p>
          </div>
        </div>

        <div className="space-y-6">
          {subjects.map((subject, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${subject.color} text-white`}>
                      <Book className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{subject.name}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {uploadedFiles[subject.name] && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSyllabus(subject.name)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Syllabus Copy
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(subject.name, file);
                          }
                        }}
                        className="flex-1"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    {uploadedFiles[subject.name] && (
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {uploadedFiles[subject.name].name}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* View Your Syllabus Button */}
          {Object.keys(uploadedFiles).length > 0 && (
            <div className="flex justify-center pt-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-all hover:scale-105"
                onClick={() => {
                  Object.entries(uploadedFiles).forEach(([subjectName, file]) => {
                    if (file instanceof File) {
                      const url = URL.createObjectURL(file);
                      window.open(url, '_blank');
                    }
                  });
                }}
              >
                <FileText className="w-5 h-5 mr-2" />
                View Your Syllabus
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Syllabus;
