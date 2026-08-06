import React from 'react';
import Header from '@/components/Header';
import AssistantBot from '@/components/AssistantBot';

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-8 animate-fade-up">{children}</main>
    <AssistantBot />
  </div>
);

export default AppLayout;
