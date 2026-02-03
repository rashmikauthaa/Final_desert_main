import React, { useEffect, useRef, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page4Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

const VIDEO_SRC = '/assets/videos/suryagarg_vid.mp4';
const TEXT_DISPLAY_TIME = 3500;  // +3s from 500ms
const TEXT_HIDE_TIME = 8500;     // +3s from 5500ms

export const Page4: React.FC<Page4Props> = ({
  isActive,
  onSlideshowComplete,
  isPaused,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showText, setShowText] = useState(false);
  const textTimerRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Video Control ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    video.currentTime = 0;
    if (!isPaused) video.play().catch(() => { });

    const handleEnded = () => {
      if (onSlideshowComplete) onSlideshowComplete();
    };

    video.addEventListener('ended', handleEnded);

    // Text timing (simple & clean)
    textTimerRef.current = setTimeout(() => setShowText(true), TEXT_DISPLAY_TIME);
    setTimeout(() => setShowText(false), TEXT_HIDE_TIME);

    return () => {
      video.pause();
      video.removeEventListener('ended', handleEnded);
      if (textTimerRef.current) clearTimeout(textTimerRef.current);
    };
  }, [isActive, isPaused, onSlideshowComplete]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      {/* ---------------- Video Layer ---------------- */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0 bg-black">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     min-w-full min-h-full object-cover"
          playsInline
          preload="auto"
        />
      </div>

      {/* ---------------- Text Overlay ---------------- */}
      <div className="relative z-20 w-full h-full flex items-start justify-center pt-24 md:pt-32 pointer-events-none">
        <div
          className="transition-all duration-[4000ms] ease-in"
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div className="px-8 py-6 md:px-16 md:py-8 flex flex-col items-center text-center">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-3 opacity-60" />

            <h1 className="font-display text-2xl md:text-3xl lg:text-6xl font-light text-zinc-600 tracking-[0.2em] uppercase drop-shadow-md">
              Suryagarh
            </h1>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent mt-3" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
