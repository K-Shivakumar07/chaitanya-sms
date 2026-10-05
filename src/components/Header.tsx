import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Search, FileText, Book, ClipboardList, Tag, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NotificationsBell from '@/components/NotificationsBell';
import {
  buildDocumentIndex,
  searchDocuments,
  getSuggestions,
  SearchResult,
  Suggestion,
} from '@/data/documents';
import { useMaterials, useNotes, useAssignments } from '@/hooks/useSemesterData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStudentProfile, initials } from '@/hooks/useStudentProfile';
import universityLogo from '@/assets/chaitanya-university-logo.webp';

const sectionSuggestions = [
  { title: 'Study Materials', link: '/materials' },
  { title: 'Notes & PDFs', link: '/notes' },
  { title: 'Assignments', link: '/assignments' },
  { title: 'Timetable', link: '/timetable' },
  { title: 'Syllabus', link: '/syllabus' },
  { title: 'Announcements', link: '/announcements' },
];

const kindIcon = (kind: string) => {
  if (kind === 'material') return <Book className="w-4 h-4 text-purple-500" />;
  if (kind === 'note') return <FileText className="w-4 h-4 text-orange-500" />;
  return <ClipboardList className="w-4 h-4 text-red-500" />;
};

const Highlight = ({ text, query }: { text: string; query: string }) => {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-blue-600">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
};

type Item =
  | { kind: 'suggestion'; suggestion: Suggestion }
  | { kind: 'doc'; doc: SearchResult }
  | { kind: 'section'; section: { title: string; link: string } }
  | { kind: 'all' };

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [autocomplete, setAutocomplete] = useState<Suggestion[]>([]);
  const [docResults, setDocResults] = useState<SearchResult[]>([]);
  const [sectionResults, setSectionResults] = useState<typeof sectionSuggestions>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { profile } = useStudentProfile();

  const { data: materials } = useMaterials();
  const { data: notes } = useNotes();
  const { data: assignments } = useAssignments();

  const docs = useMemo(
    () => buildDocumentIndex(materials, notes, assignments),
    [materials, notes, assignments],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length > 0) {
      setAutocomplete(getSuggestions(docs, q, 5));
      setDocResults(searchDocuments(docs, q).slice(0, 5));
      setSectionResults(sectionSuggestions.filter((s) => s.title.toLowerCase().includes(q)).slice(0, 3));
      setShowSuggestions(true);
    } else {
      setAutocomplete([]);
      setDocResults([]);
      setSectionResults([]);
      setShowSuggestions(false);
    }
    setActiveIndex(-1);
  }, [searchQuery, docs]);

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [
      ...autocomplete.map((suggestion) => ({ kind: 'suggestion' as const, suggestion })),
      ...docResults.map((doc) => ({ kind: 'doc' as const, doc })),
      ...sectionResults.map((section) => ({ kind: 'section' as const, section })),
    ];
    if (searchQuery.trim()) list.push({ kind: 'all' });
    return list;
  }, [autocomplete, docResults, sectionResults, searchQuery]);

  const runSearch = (query: string) => {
    navigate(`/dashboard?search=${encodeURIComponent(query.trim())}`);
    setShowSuggestions(false);
  };

  const goTo = (link: string) => {
    navigate(link);
    setShowSuggestions(false);
  };

  const selectItem = (item: Item) => {
    if (item.kind === 'suggestion') {
      setSearchQuery(item.suggestion.value);
      runSearch(item.suggestion.value);
    } else if (item.kind === 'doc') {
      goTo(item.doc.link);
    } else if (item.kind === 'section') {
      goTo(item.section.link);
    } else {
      runSearch(searchQuery);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && items[activeIndex]) selectItem(items[activeIndex]);
    else if (searchQuery.trim()) runSearch(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'Tab' && activeIndex >= 0) {
      const item = items[activeIndex];
      if (item.kind === 'suggestion') {
        e.preventDefault();
        setSearchQuery(item.suggestion.value);
      }
    }
  };

  const itemClass = (index: number) =>
    `w-full text-left px-4 py-2 border-b border-gray-100 flex items-start gap-2 ${
      activeIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
    }`;

  let cursor = -1;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="h-14 w-auto sm:h-16">
              <img
                src={universityLogo}
                alt="Chaitanya (Deemed to be University)"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search materials, notes, assignments..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                role="combobox"
                aria-expanded={showSuggestions}
                aria-autocomplete="list"
              />

              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  {items.length <= 1 && autocomplete.length === 0 && docResults.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">No matching documents</div>
                  )}

                  {autocomplete.length > 0 && (
                    <div className="px-4 pt-2 pb-1 text-xs uppercase tracking-wide text-gray-400">Suggestions</div>
                  )}
                  {autocomplete.map((s) => {
                    cursor += 1;
                    const index = cursor;
                    return (
                      <button
                        key={`sug-${s.type}-${s.value}`}
                        type="button"
                        className={itemClass(index)}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectItem({ kind: 'suggestion', suggestion: s })}
                      >
                        <span className="mt-0.5">
                          {s.type === 'subject' ? (
                            <Tag className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Search className="w-4 h-4 text-gray-400" />
                          )}
                        </span>
                        <span className="flex-1 text-sm text-gray-900">
                          <Highlight text={s.value} query={searchQuery} />
                          {s.type === 'subject' && (
                            <span className="ml-2 text-xs text-gray-500">subject • {s.count} item(s)</span>
                          )}
                        </span>
                      </button>
                    );
                  })}

                  {docResults.length > 0 && (
                    <div className="px-4 pt-2 pb-1 text-xs uppercase tracking-wide text-gray-400">Documents</div>
                  )}
                  {docResults.map((doc, i) => {
                    cursor += 1;
                    const index = cursor;
                    return (
                      <button
                        key={`doc-${i}`}
                        type="button"
                        className={itemClass(index)}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectItem({ kind: 'doc', doc })}
                      >
                        <span className="mt-0.5">{kindIcon(doc.kind)}</span>
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-gray-900">
                            <Highlight text={doc.title} query={searchQuery} />
                          </span>
                          <span className="block text-xs text-gray-500">
                            {doc.kindLabel} • {doc.subject} • {doc.meta}
                          </span>
                        </span>
                      </button>
                    );
                  })}

                  {sectionResults.map((s, i) => {
                    cursor += 1;
                    const index = cursor;
                    return (
                      <button
                        key={`sec-${i}`}
                        type="button"
                        className={`${itemClass(index)} text-sm`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectItem({ kind: 'section', section: s })}
                      >
                        <Search className="w-3 h-3 mt-1 text-gray-400" />
                        <span>Go to {s.title}</span>
                      </button>
                    );
                  })}

                  {searchQuery.trim() && (() => {
                    cursor += 1;
                    const index = cursor;
                    return (
                      <button
                        type="button"
                        className={`${itemClass(index)} text-sm text-blue-600`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectItem({ kind: 'all' })}
                      >
                        <CornerDownLeft className="w-3 h-3 mt-1" />
                        <span>See all results for "{searchQuery.trim()}"</span>
                      </button>
                    );
                  })()}
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <NotificationsBell />

            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={profile.avatar || undefined} alt="Profile photo" />
                  <AvatarFallback className="text-[10px]">{initials(profile.name)}</AvatarFallback>
                </Avatar>
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
