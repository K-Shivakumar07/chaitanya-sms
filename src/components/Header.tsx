
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Bell, Search, FileText, Book, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchDocuments, SearchResult } from '@/data/documents';

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

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [docResults, setDocResults] = useState<SearchResult[]>([]);
  const [sectionResults, setSectionResults] = useState<typeof sectionSuggestions>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    if (q.length > 1) {
      setDocResults(searchDocuments(q).slice(0, 6));
      setSectionResults(sectionSuggestions.filter((s) => s.title.toLowerCase().includes(q)).slice(0, 3));
      setShowSuggestions(true);
    } else {
      setDocResults([]);
      setSectionResults([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const goTo = (link: string) => {
    navigate(link);
    setShowSuggestions(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-12 w-auto">
              <img 
                src="/lovable-uploads/63f128ca-12f8-480a-9026-c6299e38a2c2.png" 
                alt="Chaitanya College Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search materials, notes, assignments..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              />
              
              {/* Search Suggestions */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                  {docResults.length === 0 && sectionResults.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">No documents found</div>
                  )}

                  {docResults.map((doc, index) => (
                    <button
                      key={`doc-${index}`}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 flex items-start gap-2"
                      onClick={() => goTo(doc.link)}
                    >
                      <span className="mt-0.5">{kindIcon(doc.kind)}</span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-gray-900">{doc.title}</span>
                        <span className="block text-xs text-gray-500">
                          {doc.kindLabel} • {doc.subject} • {doc.meta}
                        </span>
                      </span>
                    </button>
                  ))}

                  {sectionResults.map((s, index) => (
                    <button
                      key={`sec-${index}`}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      onClick={() => goTo(s.link)}
                    >
                      <Search className="inline w-3 h-3 mr-2 text-gray-400" />
                      Go to {s.title}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                    onClick={() => {
                      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
                      setShowSuggestions(false);
                    }}
                  >
                    See all results for "{searchQuery.trim()}"
                  </button>
                </div>
              )}
            </form>
          </div>


          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5 mr-2" />
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
