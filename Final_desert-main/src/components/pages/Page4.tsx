import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page4Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

// YouTube Video ID
const YOUTUBE_VIDEO_ID = 'If4lodZ5cHo';
const VIDEO_START_TIME = 0; // Start at 0 seconds
const VIDEO_END_TIME = 12; // End at 12 seconds
const VIDEO_DURATION = (VIDEO_END_TIME - VIDEO_START_TIME) * 1000; // 12 seconds in milliseconds
const TEXT_DISPLAY_TIME = 7000; // Show text at 5 seconds
const TEXT_ZOOM_DURATION = 3000; // 3 seconds for text zoom
const ZOOM_SCALE = 1.3; // Zoom scale for text

export const Page4: React.FC<Page4Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
  const [showText, setShowText] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const playerRef = useRef<any>(null);
  const textIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoTimeCheckRef = useRef<NodeJS.Timeout | null>(null);
  const textShownRef = useRef(false);

  // Initialize YouTube Player API
  useEffect(() => {
    if (!isActive) {
      setShowText(false);
      setTextScale(1);
      setHasCompleted(false);
      setIsVideoReady(false);
      setIsVideoPlaying(false);
      setShowPlayer(true);
      textShownRef.current = false;
      if (playerRef.current && playerRef.current.pauseVideo) {
        playerRef.current.pauseVideo();
      }
      if (textIntervalRef.current) clearTimeout(textIntervalRef.current);
      if (videoTimeCheckRef.current) clearTimeout(videoTimeCheckRef.current);
      return;
    }

    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Wait for API to load then create player
    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        playerRef.current = new window.YT.Player('youtube-player-page4', {
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            mute: 0,
            start: VIDEO_START_TIME,
            end: VIDEO_END_TIME,
            enablejsapi: 1,
            origin: window.location.origin,
            widget_referrer: window.location.origin,
            suggestedQuality: 'hd1080',
          },
          events: {
            onReady: (event: any) => {
              setIsVideoReady(true);
              event.target.seekTo(VIDEO_START_TIME, true);
              if (!isPaused) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              // Hide player when video ends to prevent thumbnail/end screen
              if (event.data === window.YT.PlayerState.ENDED) {
                setShowPlayer(false);
              }
              // Track when video is playing
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsVideoPlaying(true);

                // Start checking video time once playing
                const checkVideoTime = () => {
                  if (isPaused) {
                    videoTimeCheckRef.current = setTimeout(checkVideoTime, 100);
                    return;
                  }

                  if (playerRef.current && !hasCompleted) {
                    const currentTime = playerRef.current.getCurrentTime();

                    // Show text at specified time (only once)
                    if (currentTime >= TEXT_DISPLAY_TIME / 1000 && !textShownRef.current) {
                      textShownRef.current = true;
                      setShowText(true);
                    }

                    // When video reaches end (around 12 seconds), zoom text and complete
                    if (currentTime >= VIDEO_END_TIME - 0.5) {
                      setHasCompleted(true);
                      setShowText(true);

                      // Hide player to prevent thumbnail
                      setShowPlayer(false);

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

                      // Stop checking
                      if (videoTimeCheckRef.current) clearTimeout(videoTimeCheckRef.current);
                      return;
                    }

                    videoTimeCheckRef.current = setTimeout(checkVideoTime, 100);
                  }
                };

                // Start checking video time
                videoTimeCheckRef.current = setTimeout(checkVideoTime, 100);
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (textIntervalRef.current) clearTimeout(textIntervalRef.current);
      if (videoTimeCheckRef.current) clearTimeout(videoTimeCheckRef.current);
    };
  }, [isActive, hasCompleted, onSlideshowComplete]);

  // Pause/Resume Effect
  useEffect(() => {
    if (!playerRef.current || !isVideoReady) return;

    if (isPaused) {
      if (playerRef.current.pauseVideo) playerRef.current.pauseVideo();
    } else {
      if (isActive && playerRef.current.playVideo) playerRef.current.playVideo();
    }
  }, [isPaused, isVideoReady, isActive]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden" style={{ zIndex: 0 }}>
        {/* Black background to hide loader/thumbnail - only show when video is not ready */}
        <div
          className="absolute inset-0 bg-black z-0"
          style={{
            opacity: isVideoReady && isVideoPlaying && showPlayer ? 0 : 1,
            transition: 'opacity 500ms ease-in',
          }}
        />

        {/* YouTube Video - show when ready */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh] z-10"
          style={{
            opacity: isVideoReady && showPlayer ? 1 : 0,
            transition: 'opacity 500ms ease-in',
          }}
        >
          <div
            id="youtube-player-page4"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh]"
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

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
