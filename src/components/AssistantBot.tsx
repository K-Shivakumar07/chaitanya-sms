import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { X, Maximize2 } from 'lucide-react';
import AssistantChat from '@/components/AssistantChat';
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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const open = searchParams.get('assistant') === 'open';

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

  const setOpen = (next: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (next) params.set('assistant', 'open');
    else params.delete('assistant');
    setSearchParams(params, { replace: !next });
  };

  // The dedicated /assistant route renders the full-page chat instead.
  if (location.pathname === '/assistant') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[21rem] sm:w-96 h-[30rem] flex flex-col rounded-2xl border bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
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
            <button
              onClick={() => navigate('/assistant')}
              aria-label="Open assistant in full page"
              className="mr-1"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="w-4 h-4" />
            </button>
          </div>

          <AssistantChat className="flex-1" onNavigate={() => setOpen(false)} />
        </div>
      )}

      <div className="relative">
        {!open && cloud && (
          <div className="absolute right-full bottom-6 mr-3 w-52 animate-in fade-in slide-in-from-right-2">
            <div className="relative rounded-2xl bg-white px-4 py-2 text-sm text-gray-800 shadow-xl border">
              {cloud}
              <span className="absolute -right-1.5 bottom-3 h-3 w-3 rotate-45 bg-white border-r border-b" />
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
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
