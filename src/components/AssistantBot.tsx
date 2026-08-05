import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Send, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchDocuments, SearchResult } from '@/data/documents';
import robotVideo from '@/assets/assistant-robot.mp4.asset.json';

/** Time windows (seconds) in the loop where the robot raises its hands. */
const GESTURE_WINDOWS: { start: number; end: number; message: string }[] = [
  { start: 2.6, end: 4.4, message: 'Hello student! 👋 Need any notes?' },
  { start: 4.8, end: 6.6, message: 'I can find materials & assignments for you.' },
  { start: 7.0, end: 9.2, message: 'Tap me and just type a subject name!' },
];

const AssistantBot = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cloud, setCloud] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      const t = video.currentTime;
      const hit = GESTURE_WINDOWS.find((w) => t >= w.start && t <= w.end);
      setCloud(hit ? hit.message : null);
    };
    video.addEventListener('timeupdate', onTime);
    return () => video.removeEventListener('timeupdate', onTime);
  }, []);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setResults(q ? searchDocuments(q).slice(0, 6) : []);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div className="w-[19rem] sm:w-80 rounded-2xl border bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <span className="text-sm font-semibold">Campus Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto p-3 space-y-2">
            <p className="text-sm text-gray-600">
              Ask me for any note, study material or assignment.
            </p>
            {results?.length === 0 && (
              <p className="text-sm text-gray-500">I couldn't find anything for that. Try a subject name.</p>
            )}
            {results?.map((doc, i) => (
              <Link
                key={i}
                to={doc.link}
                onClick={() => setOpen(false)}
                className="flex items-start gap-2 rounded-lg border p-2 hover:bg-gray-50"
              >
                <FileText className="w-4 h-4 mt-0.5 text-blue-600" />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-gray-900">{doc.title}</span>
                  <span className="block text-xs text-gray-500">
                    {doc.kindLabel} • {doc.subject} • {doc.meta}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <form onSubmit={handleAsk} className="flex items-center gap-2 border-t p-2">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. DBMS notes"
              className="h-9"
            />
            <Button type="submit" size="sm" className="h-9 px-3" aria-label="Ask">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      <div className="relative">
        {/* Cloud message rendered outside the circle */}
        {!open && cloud && (
          <div className="absolute right-full bottom-6 mr-3 w-52 animate-in fade-in slide-in-from-right-2">
            <div className="relative rounded-2xl bg-white px-4 py-2 text-sm text-gray-800 shadow-xl border">
              {cloud}
              <span className="absolute -right-1.5 bottom-3 h-3 w-3 rotate-45 bg-white border-r border-b" />
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Open campus assistant"
          className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-2 ring-blue-500/40 transition-transform hover:scale-105"
        >
          <video
            ref={videoRef}
            src={robotVideo.url}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover scale-125"
          />
        </button>
      </div>
    </div>
  );
};

export default AssistantBot;
