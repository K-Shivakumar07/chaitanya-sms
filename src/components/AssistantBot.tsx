import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Send, FileText, Bot } from 'lucide-react';
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

const QUICK_ASKS = ['DBMS notes', 'Physics material', 'Pending assignments', 'Mathematics'];

interface ChatMessage {
  id: number;
  from: 'bot' | 'user';
  text: string;
  docs?: SearchResult[];
  time: string;
}

const now = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

let idSeq = 0;
const nextId = () => ++idSeq;

const AssistantBot = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cloud, setCloud] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextId(),
      from: 'bot',
      text: "Hi! I'm your Campus Assistant 🤖 Ask me for any note, study material or assignment.",
      time: now(),
    },
  ]);

  useEffect(() => {
    const video = videoRef.current;
    let gotTime = false;
    const onTime = () => {
      gotTime = true;
      const t = video!.currentTime;
      const hit = GESTURE_WINDOWS.find((w) => t >= w.start && t <= w.end);
      setCloud(hit ? hit.message : null);
    };
    video?.addEventListener('timeupdate', onTime);

    // Fallback: if the video can't play, still cycle the cloud messages.
    let i = 0;
    const fallback = window.setInterval(() => {
      if (gotTime) return;
      setCloud((prev) => (prev ? null : GESTURE_WINDOWS[i++ % GESTURE_WINDOWS.length].message));
    }, 3000);

    return () => {
      video?.removeEventListener('timeupdate', onTime);
      window.clearInterval(fallback);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, typing]);

  const ask = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { id: nextId(), from: 'user', text: q, time: now() }]);
    setQuery('');
    setTyping(true);
    window.setTimeout(() => {
      const docs = searchDocuments(q).slice(0, 5);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          from: 'bot',
          text: docs.length
            ? `I found ${docs.length} document${docs.length > 1 ? 's' : ''} for “${q}”:`
            : `I couldn't find anything for “${q}”. Try a subject name like Physics or DBMS.`,
          docs: docs.length ? docs : undefined,
          time: now(),
        },
      ]);
    }, 650);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div className="w-[21rem] sm:w-96 h-[30rem] flex flex-col rounded-2xl border bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white">
            <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-white/70 shrink-0">
              <video src={robotVideo.url} autoPlay loop muted playsInline className="h-full w-full object-cover scale-125" />
            </div>
            <div className="flex-1 leading-tight">
              <p className="text-sm font-semibold">Campus Assistant</p>
              <p className="text-[11px] text-blue-100 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.from === 'bot' && (
                  <span className="h-7 w-7 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </span>
                )}
                <div className={`max-w-[78%] ${m.from === 'user' ? 'items-end' : ''}`}>
                  <div
                    className={`px-3 py-2 text-sm shadow-sm ${
                      m.from === 'user'
                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
                        : 'bg-white text-gray-800 border rounded-2xl rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.docs && (
                    <div className="mt-2 space-y-2">
                      {m.docs.map((doc, i) => (
                        <Link
                          key={i}
                          to={doc.link}
                          onClick={() => setOpen(false)}
                          className="flex items-start gap-2 rounded-xl border bg-white p-2 hover:bg-blue-50 transition-colors"
                        >
                          <FileText className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                          <span className="flex-1">
                            <span className="block text-sm font-medium text-gray-900">{doc.title}</span>
                            <span className="block text-xs text-gray-500">
                              {doc.kindLabel} • {doc.subject} • {doc.meta}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <p className={`mt-1 text-[10px] text-gray-400 ${m.from === 'user' ? 'text-right' : ''}`}>{m.time}</p>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2">
                <span className="h-7 w-7 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </span>
                <div className="bg-white border rounded-2xl rounded-bl-sm px-3 py-3 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="flex gap-2 overflow-x-auto px-3 py-2 border-t bg-white">
            {QUICK_ASKS.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(query);
            }}
            className="flex items-center gap-2 border-t p-2 bg-white"
          >
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a message…"
              className="h-9 rounded-full"
            />
            <Button type="submit" size="sm" className="h-9 w-9 p-0 rounded-full shrink-0" aria-label="Send">
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
