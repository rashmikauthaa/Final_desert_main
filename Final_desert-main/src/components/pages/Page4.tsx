import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page4Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

// Video Configuration
const VIDEO_SRC = '/assets/videos/suryagarg_vid.mp4';
const VIDEO_DURATION = 12000; // 12 seconds in milliseconds
const TEXT_DISPLAY_TIME = 6000; // Show text at 7 seconds
const TEXT_ZOOM_DURATION = 3000; // 3 seconds for text zoom
const ZOOM_SCALE = 1.3; // Zoom scale for text

export const Page4: React.FC<Page4Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
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

          // Show text at specified time (only once)
          if (currentTime >= TEXT_DISPLAY_TIME && !textShownRef.current) {
            textShownRef.current = true;
            setShowText(true);
          }

          // When video reaches end, zoom text and complete
          if (currentTime >= VIDEO_DURATION - 500) {
            setHasCompleted(true);
            setShowText(true);

            // Pause video to freeze on last frame
            video.pause();

            // Zoom in on text
            setTimeout(() => {
              setTextScale(ZOOM_SCALE);

              // Navigate to next page after zoom
              setTimeout(() => {
                if (onSlideshowComplete) {
                  onSlideshowComplete();
                }
              }, TEXT_ZOOM_DURATION);
            }, 300);

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
        </div>
      </div>

      {/* Text Overlay */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        <div
          className="text-center transition-all ease-out"
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? 'translateY(0) scale(' + textScale + ')' : 'translateY(20px) scale(1)',
            transitionDuration: hasCompleted ? `${TEXT_ZOOM_DURATION}ms` : '1500ms',
          }}
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            Suryagarh
          </h1>
          <p className="font-display text-xl md:text-2xl lg:text-3xl font-light text-foreground/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-4">
            The Hotel
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};
