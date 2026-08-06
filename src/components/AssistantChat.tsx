import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, FileText, Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { buildDocumentIndex, searchDocuments, SearchResult } from '@/data/documents';
import { useMaterials, useNotes, useAssignments } from '@/hooks/useSemesterData';
import { useSemester, romanSemester } from '@/context/SemesterContext';

const QUICK_ASKS = [
  "Today's classes",
  'Monday classes',
  'Pending assignments',
  'Upcoming deadlines',
  'Latest announcements',
];

interface ChatMessage {
  id: number;
  from: 'bot' | 'user';
  text: string;
  docs?: SearchResult[];
  time: string;
}

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

let idSeq = 0;
const nextId = () => ++idSeq;

interface Props {
  onNavigate?: () => void;
  initialQuery?: string;
  className?: string;
}

const AssistantChat = ({ onNavigate, initialQuery, className = '' }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [typing, setTyping] = useState(false);
  const { semester } = useSemester();
  const { data: materials } = useMaterials();
  const { data: notes } = useNotes();
  const { data: assignments } = useAssignments();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextId(),
      from: 'bot',
      text: "Hi! I'm your Campus Assistant 🤖 Ask me about your classes, assignments, deadlines, announcements, syllabus, notes or materials.",
      time: now(),
    },
  ]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [typing]);

  const historyRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const ask = async (raw: string) => {
    const q = raw.trim();
    if (!q || typing) return;

    setMessages((prev) => [...prev, { id: nextId(), from: 'user', text: q, time: now() }]);
    setQuery('');
    setTyping(true);

    const docs = searchDocuments(buildDocumentIndex(materials, notes, assignments), q).slice(0, 4);
    historyRef.current = [...historyRef.current, { role: 'user', content: q }];

    const botId = nextId();
    let answer = '';
    let started = false;

    const pushChunk = (chunk: string) => {
      answer += chunk;
      setMessages((prev) => {
        if (!started) return prev;
        return prev.map((m) => (m.id === botId ? { ...m, text: answer } : m));
      });
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/campus-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ semester, messages: historyRef.current }),
        },
      );

      if (res.status === 429) throw new Error('The assistant is busy right now. Please try again in a moment.');
      if (res.status === 402) throw new Error('AI credits are exhausted. Please add credits to continue.');
      if (!res.ok || !res.body) throw new Error('Sorry, I could not reach the assistant service.');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === '[DONE]') continue;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (delta) {
              if (!started) {
                started = true;
                setTyping(false);
                setMessages((prev) => [
                  ...prev,
                  { id: botId, from: 'bot', text: '', docs: docs.length ? docs : undefined, time: now() },
                ]);
              }
              pushChunk(delta);
            }
          } catch {
            /* ignore partial json */
          }
        }
      }

      if (!started) {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: botId,
            from: 'bot',
            text: "I couldn't find an answer for that. Try asking about your timetable, assignments or syllabus.",
            docs: docs.length ? docs : undefined,
            time: now(),
          },
        ]);
      } else {
        historyRef.current = [...historyRef.current, { role: 'assistant', content: answer }];
      }
    } catch (err) {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          from: 'bot',
          text: err instanceof Error ? err.message : 'Something went wrong.',
          docs: docs.length ? docs : undefined,
          time: now(),
        },
      ]);
    }
  };

  const askedRef = useRef(false);
  useEffect(() => {
    if (initialQuery && !askedRef.current && semester) {
      askedRef.current = true;
      ask(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, semester]);

  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50">
        {semester && (
          <p className="text-center text-[11px] text-gray-400">
            Answering from your Semester {romanSemester(semester)} dashboard
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.from === 'bot' && (
              <span className="h-7 w-7 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </span>
            )}
            <div className={`max-w-[78%] ${m.from === 'user' ? 'items-end' : ''}`}>
              <div
                className={`px-3 py-2 text-sm shadow-sm whitespace-pre-wrap ${
                  m.from === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
                    : 'bg-white text-gray-800 border rounded-2xl rounded-bl-sm'
                }`}
              >
                {m.text || '…'}
              </div>

              {m.docs && (
                <div className="mt-2 space-y-2">
                  {m.docs.map((doc, i) => (
                    <Link
                      key={i}
                      to={doc.link}
                      onClick={onNavigate}
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
          placeholder="Ask about classes, assignments, syllabus…"
          className="h-9 rounded-full"
        />
        <Button type="submit" size="sm" disabled={typing} className="h-9 w-9 p-0 rounded-full shrink-0" aria-label="Send">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default AssistantChat;
