import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page2Props {
  isActive: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

// Video Configuration
const VIDEO_SRC = '/assets/videos/jaisalmer_vid.mp4';

// Text overlay timing (in seconds from video start)
const TEXT_APPEAR_TIME = 0.5; // Text starts appearing 0.5 seconds after video starts
const TEXT_FADE_TIME = 8; // Text stays until 10 seconds (5s appear + 5s stay)

export const Page2: React.FC<Page2Props> = ({ isActive, videoRef }) => {
  const [showText, setShowText] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const timeCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Use provided ref or local ref
  const videoElement = videoRef?.current || localVideoRef.current;

  useEffect(() => {
    if (!isActive) {
      setShowText(false);
      setShowVideo(false);
      if (localVideoRef.current) {
        localVideoRef.current.pause();
        localVideoRef.current.currentTime = 0;
      }
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current);
        timeCheckInterval.current = null;
      }
      return;
    }

    // Start video playback
    if (localVideoRef.current) {
      localVideoRef.current.currentTime = 0;
      localVideoRef.current.play().then(() => {
        setShowVideo(true);
      }).catch(err => {
        console.log('Video autoplay failed:', err);
        setShowVideo(true);
      });

      // Monitor video time for text overlay
      timeCheckInterval.current = setInterval(() => {
        if (localVideoRef.current) {
          const currentTime = localVideoRef.current.currentTime;

          // Show text between TEXT_APPEAR_TIME and TEXT_FADE_TIME
          if (currentTime >= TEXT_APPEAR_TIME && currentTime < TEXT_FADE_TIME) {
            setShowText(true);
          } else {
            setShowText(false);
          }
        }
      }, 100);
    }

    return () => {
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current);
        timeCheckInterval.current = null;
      }
    };
  }, [isActive]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden">
        {/* Local Video */}
        <div
          className={`absolute inset-0 transition-opacity duration-[4000ms] ${showVideo ? 'opacity-100' : 'opacity-0'}`}
        >
          <video
            ref={localVideoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={VIDEO_SRC}
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>

        {/* JAISALMER Text Introduction */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-[5000ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-10 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
        >
          <div className="text-center">
            <h1 className="font-display text-2xl md:text-4xl lg:text-6xl font-thin tracking-[0.2em] text-foreground drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Jaisalmer
            </h1>
            <h2 className="font-devanagari text-xl md:text-3xl lg:text-5xl font-normal text-foreground/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mt-6">
              जैसलमेर
            </h2>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
