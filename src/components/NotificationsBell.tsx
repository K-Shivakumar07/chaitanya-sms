import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertTriangle, Info, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { announcements } from '@/data/announcements';

const typeIcon = (type: string) => {
  if (type === 'urgent') return <AlertTriangle className="w-4 h-4 text-red-500" />;
  if (type === 'important') return <Bell className="w-4 h-4 text-yellow-500" />;
  return <Info className="w-4 h-4 text-blue-500" />;
};

const NotificationsBell = () => {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const unread = announcements.filter((a) => !readIds.includes(a.title));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {unread.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unread.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-sm font-semibold">Notifications</span>
          {unread.length > 0 && (
            <button
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              onClick={() => setReadIds(announcements.map((a) => a.title))}
            >
              <CheckCheck className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {announcements.map((a) => {
            const isRead = readIds.includes(a.title);
            return (
              <button
                key={a.title}
                onClick={() => setReadIds((prev) => (isRead ? prev : [...prev, a.title]))}
                className={`w-full text-left flex gap-2 px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 ${
                  isRead ? 'opacity-60' : ''
                }`}
              >
                <span className="mt-0.5">{typeIcon(a.type)}</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-gray-900">{a.title}</span>
                  <span className="block text-xs text-gray-600 line-clamp-2">{a.content}</span>
                  <span className="block text-[11px] text-gray-400 mt-1">
                    {a.author} • {a.date}
                  </span>
                </span>
                {!isRead && <span className="mt-2 h-2 w-2 rounded-full bg-blue-500" />}
              </button>
            );
          })}
        </div>
        <Link
          to="/announcements"
          onClick={() => setOpen(false)}
          className="block px-4 py-2 text-center text-sm text-blue-600 border-t hover:bg-gray-50"
        >
          View all announcements
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBell;
