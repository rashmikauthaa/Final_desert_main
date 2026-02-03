import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page9Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

// Video Configuration
const VIDEO_SRC = '/assets/videos/concert_venue_vid.mp4';
const VIDEO_DURATION = 10000; // 10 seconds in milliseconds
const TEXT_DISPLAY_TIME = 1500; // Show text earlier at 1.5 seconds
const TEXT_FADE_TIME = 8000; // Hold text much longer until 8 seconds
const TEXT_ZOOM_DURATION = 3000; // 3 seconds for text zoom
const ZOOM_SCALE = 1.3; // Zoom scale for text

export const Page9: React.FC<Page9Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
  const [showText, setShowText] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTimeCheckRef = useRef<NodeJS.Timeout | null>(null);
  const textShownRef = useRef(false);

  // Pause/Resume Effect
  useEffect(() => {
    if (!videoRef.current || !isVideoReady) return;

    if (isPaused) {
      videoRef.current.pause();
    } else {
      if (isActive) videoRef.current.play().catch(() => { });
    }
  }, [isPaused, isVideoReady, isActive]);

  // Initialize Video
  useEffect(() => {
    if (!isActive) {
      setShowText(false);
      setTextScale(1);
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

    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoReady(true);
      if (!isPaused) {
        video.play().catch(() => { });
      }
    };

    const handlePlaying = () => {
      setIsVideoPlaying(true);

      // Start checking video time
      const checkVideoTime = () => {
        if (isPaused) {
          videoTimeCheckRef.current = setTimeout(checkVideoTime, 100);
          return;
        }

        if (video && !hasCompleted) {
          const currentTime = video.currentTime * 1000; // Convert to ms

          // Show text between TEXT_DISPLAY_TIME and TEXT_FADE_TIME
          if (currentTime >= TEXT_DISPLAY_TIME && currentTime < TEXT_FADE_TIME) {
            if (!textShownRef.current) {
              textShownRef.current = true;
              setShowText(true);
            }
          } else if (currentTime >= TEXT_FADE_TIME && textShownRef.current) {
            // Fade out text after TEXT_FADE_TIME
            setShowText(false);
          }

          // When video reaches end, complete and move to next page
          if (currentTime >= VIDEO_DURATION - 500) {
            setHasCompleted(true);

            // Pause video to freeze on last frame
            video.pause();

            // Navigate to next page
            setTimeout(() => {
              if (onSlideshowComplete) {
                onSlideshowComplete();
              }
            }, 500);

            if (videoTimeCheckRef.current) clearTimeout(videoTimeCheckRef.current);
            return;
          }

          videoTimeCheckRef.current = setTimeout(checkVideoTime, 100);
        }
      };

      videoTimeCheckRef.current = setTimeout(checkVideoTime, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);

    // Trigger load
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      if (videoTimeCheckRef.current) clearTimeout(videoTimeCheckRef.current);
    };
  }, [isActive, hasCompleted, onSlideshowComplete, isPaused]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden" style={{ zIndex: 0 }}>
        {/* Black background to hide loader - only show when video is not ready */}
        <div
          className="absolute inset-0 bg-black z-0"
          style={{
            opacity: isVideoReady && isVideoPlaying ? 0 : 1,
            transition: 'opacity 500ms ease-in',
          }}
        />

        {/* Local Video */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh] z-10"
          style={{
            opacity: isVideoReady ? 1 : 0,
            transition: 'opacity 500ms ease-in',
          }}
        >
          <video
            ref={videoRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto min-w-full min-h-full object-cover"
            src={VIDEO_SRC}
            playsInline
            preload="auto"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

      {/* Text Overlay - Creative Glassmorphism */}
      <div className="relative z-30 w-full h-full flex items-start justify-center pt-24 md:pt-32 pointer-events-none">
        <div
          className="transition-all ease-out"
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? 'translateY(0) scale(' + textScale + ')' : 'translateY(30px) scale(1)',
            transitionDuration: '2500ms',
          }}
        >
          <div className="relative overflow-hidden group rounded-full">
            <div className="relative px-10 py-5 flex flex-col items-center justify-center">
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-2 opacity-50" />

              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-[0.2em] uppercase drop-shadow-md whitespace-nowrap">
                The Concert Venues
              </h1>

              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent mt-2" />
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};
