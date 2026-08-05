import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import AssistantChat from '@/components/AssistantChat';

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? undefined;

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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="w-7 h-7 text-blue-600" /> Campus Assistant
            </h1>
            <p className="text-gray-600">Ask for any note, study material or assignment</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl h-[70vh] flex flex-col rounded-2xl border bg-white shadow-sm overflow-hidden">
          <AssistantChat className="flex-1" initialQuery={initialQuery} />
        </div>
      </main>
    </div>
  );
};

export default Assistant;
