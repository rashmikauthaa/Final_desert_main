import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page9Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

// Video Configuration
const VIDEO_SRC = '/assets/videos/concert_venue_vid.mp4';
const VIDEO_DURATION = 10000; // Reduced to 10s to prevent stuck feeling
const TEXT_DISPLAY_TIME = 1500; // Text appears at 1.5s
const TEXT_FADE_TIME = 8000; // Text stays until 8s (more hold time)

export const Page9: React.FC<Page9Props> = ({
  isActive,
  onSlideshowComplete,
  isPaused,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTimeCheckRef = useRef<NodeJS.Timeout | null>(null);
  const textShownRef = useRef(false);

  const [showText, setShowText] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  /* ---------------- Pause / Resume ---------------- */
  useEffect(() => {
    if (!videoRef.current || !isVideoReady || hasCompleted) return;

    if (isPaused) {
      videoRef.current.pause();
    } else if (isActive) {
      videoRef.current.play().catch(() => { });
    }
  }, [isPaused, isVideoReady, isActive, hasCompleted]);

  /* ---------------- Initialize Video ---------------- */
  useEffect(() => {
    if (!isActive) {
      // Reset ONLY when page becomes inactive
      setShowText(false);
      setHasCompleted(false);
      setIsVideoReady(false);
      setIsVideoPlaying(false);
      textShownRef.current = false;

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      if (videoTimeCheckRef.current) clearTimeout(videoTimeCheckRef.current);
      return;
    }

    if (hasCompleted) return;

    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      if (hasCompleted) return;

      setIsVideoReady(true);
      if (!isPaused) {
        video.play().catch(() => { });
      }
    };

    const handlePlaying = () => {
      if (hasCompleted) return;

      setIsVideoPlaying(true);

      const checkVideoTime = () => {
        if (isPaused) {
          videoTimeCheckRef.current = setTimeout(checkVideoTime, 100);
          return;
        }

        if (!video || hasCompleted) return;

        const currentTime = video.currentTime * 1000;

        // Text timing
        if (currentTime >= TEXT_DISPLAY_TIME && currentTime < TEXT_FADE_TIME) {
          if (!textShownRef.current) {
            textShownRef.current = true;
            setShowText(true);
          }
        } else if (currentTime >= TEXT_FADE_TIME && textShownRef.current) {
          setShowText(false);
        }

        // Finish - trigger earlier to prevent stuck feeling
        if (currentTime >= VIDEO_DURATION - 200) {
          setHasCompleted(true);
          video.pause();

          // Immediately call onSlideshowComplete
          onSlideshowComplete?.();

          if (videoTimeCheckRef.current)
            clearTimeout(videoTimeCheckRef.current);

          return;
        }

        videoTimeCheckRef.current = setTimeout(checkVideoTime, 100);
      };

      videoTimeCheckRef.current = setTimeout(checkVideoTime, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);

    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      if (videoTimeCheckRef.current) clearTimeout(videoTimeCheckRef.current);
    };
  }, [isActive, hasCompleted, isPaused, onSlideshowComplete]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      {/* ---------------- Video Layer ---------------- */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0">
        <div
          className="absolute inset-0 bg-black z-0"
          style={{
            opacity: isVideoReady && isVideoPlaying ? 0 : 1,
            transition: 'opacity 500ms ease-in',
          }}
        />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh] z-10"
          style={{
            opacity: isVideoReady ? 1 : 0,
            transition: 'opacity 500ms ease-in',
          }}
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       min-w-full min-h-full object-cover"
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

      {/* ---------------- Text Overlay ---------------- */}
      <div className="relative z-30 w-full h-full flex items-start justify-center pt-24 md:pt-32 pointer-events-none">
        <div
          className={`transition-all duration-[3000ms] ease-out ${
            showText 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <div className="px-10 py-5 flex flex-col items-center text-center">
            <div className={`w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-2 transition-opacity duration-[3000ms] ${showText ? 'opacity-50' : 'opacity-0'}`} />

            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-[0.2em] uppercase drop-shadow-md whitespace-nowrap">
              The Concert Venues
            </h1>

            <div className={`w-20 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent mt-2 transition-opacity duration-[3000ms] ${showText ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
