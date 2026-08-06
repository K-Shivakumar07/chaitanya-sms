import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertTriangle, Info, Megaphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAnnouncements } from '@/hooks/useSemesterData';

const categoryIcon = (category: string) => {
  if (category === 'urgent') return <AlertTriangle className="w-4 h-4 text-red-500" />;
  if (category === 'important') return <Megaphone className="w-4 h-4 text-orange-500" />;
  return <Info className="w-4 h-4 text-blue-500" />;
};

const NotificationsBell = () => {
  const { data } = useAnnouncements();
  const announcements = useMemo(() => (data ?? []).slice(0, 8), [data]);
  const [readIds, setReadIds] = useState<string[]>([]);

  const unread = announcements.filter((a) => !readIds.includes(a.id));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {unread.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-red-500 text-[10px] font-semibold text-white flex items-center justify-center">
              {unread.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <p className="text-sm font-semibold">Notifications</p>
          {unread.length > 0 && (
            <button
              onClick={() => setReadIds(announcements.map((a) => a.id))}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {announcements.length === 0 && (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications yet.</p>
          )}
          {announcements.map((a) => {
            const isUnread = !readIds.includes(a.id);
            return (
              <button
                key={a.id}
                onClick={() => setReadIds((prev) => (prev.includes(a.id) ? prev : [...prev, a.id]))}
                className={`w-full text-left px-4 py-3 border-b flex gap-2 hover:bg-gray-50 ${isUnread ? 'bg-blue-50/50' : ''}`}
              >
                <span className="mt-0.5">{categoryIcon(a.category)}</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-gray-900">{a.title}</span>
                  <span className="block text-xs text-gray-600 line-clamp-2">{a.body}</span>
                  <span className="block text-[11px] text-gray-400 mt-1">
                    {a.posted_by} • {new Date(a.posted_at).toLocaleDateString()}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-2 border-t">
          <Link to="/announcements">
            <Button variant="ghost" size="sm" className="w-full text-blue-600">
              View all announcements
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBell;
