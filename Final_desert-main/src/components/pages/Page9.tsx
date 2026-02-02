import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page9Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

// YouTube Video ID - UPDATE THIS with your YouTube link later
const YOUTUBE_VIDEO_ID = ''; // TODO: Add your YouTube video ID here
const VIDEO_START_TIME = 0; // Start at 0 seconds
const VIDEO_END_TIME = 12; // End at 12 seconds
const VIDEO_DURATION = (VIDEO_END_TIME - VIDEO_START_TIME) * 1000; // 12 seconds in milliseconds
const TEXT_DISPLAY_TIME = 5000; // Show text at 5 seconds
const TEXT_ZOOM_DURATION = 3000; // 3 seconds for text zoom
const ZOOM_SCALE = 1.3; // Zoom scale for text

export const Page9: React.FC<Page9Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
  const [showText, setShowText] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const playerRef = useRef<any>(null);
  const videoTimeCheckRef = useRef<NodeJS.Timeout | null>(null);
  const textShownRef = useRef(false);

  // Timer state for fallback animation
  const [timerMetric, setTimerMetric] = useState(0); // ms elapsed

  // Pause/Resume Effect for Video
  useEffect(() => {
    if (!playerRef.current || !isVideoReady) return;

    if (isPaused) {
      if (playerRef.current.pauseVideo) playerRef.current.pauseVideo();
    } else {
      if (isActive && playerRef.current.playVideo) playerRef.current.playVideo();
    }
  }, [isPaused, isVideoReady, isActive]);

  // Fallback animation logic (when no YT video)
  useEffect(() => {
    if (!isActive || YOUTUBE_VIDEO_ID) {
      setTimerMetric(0);
      return;
    }

    if (isPaused) return;

    const interval = setInterval(() => {
      setTimerMetric(prev => {
        const refined = prev + 100;

        // Check events based on time
        if (refined >= TEXT_DISPLAY_TIME && prev < TEXT_DISPLAY_TIME) {
          setShowText(true);
          textShownRef.current = true;
        }

        if (refined >= VIDEO_DURATION && prev < VIDEO_DURATION) {
          setHasCompleted(true);
          setShowText(true);

          setTimeout(() => {
            setTextScale(ZOOM_SCALE);
            setTimeout(() => {
              if (onSlideshowComplete) onSlideshowComplete();
            }, TEXT_ZOOM_DURATION);
          }, 300);
        }

        return refined;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isPaused, onSlideshowComplete]);

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
      if (videoTimeCheckRef.current) clearTimeout(videoTimeCheckRef.current);
      return;
    }

    // Fallback mode is handled by other useEffect
    if (!YOUTUBE_VIDEO_ID) return;

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
        playerRef.current = new window.YT.Player('youtube-player-page9', {
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
      if (videoTimeCheckRef.current) clearTimeout(videoTimeCheckRef.current);
    };
  }, [isActive, hasCompleted, onSlideshowComplete]);

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
        {YOUTUBE_VIDEO_ID && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh] z-10"
            style={{
              opacity: isVideoReady && showPlayer ? 1 : 0,
              transition: 'opacity 500ms ease-in',
            }}
          >
            <div
              id="youtube-player-page9"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh]"
            />
          </div>
        )}

        {/* Placeholder message if no video ID */}
        {!YOUTUBE_VIDEO_ID && (
          <div className="absolute inset-0 flex items-center justify-center z-5">
            <div className="w-full h-full max-w-6xl max-h-[80vh] bg-black/50 flex items-center justify-center border-2 border-foreground/20 rounded-lg">
              <p className="font-display text-lg md:text-xl text-foreground/60 text-center px-8">
                YouTube video will be added here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Text Overlay */}
      <div className="relative z-30 w-full h-full flex items-center justify-center">
        <div
          className="text-center transition-all ease-out"
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? 'translateY(0) scale(' + textScale + ')' : 'translateY(20px) scale(1)',
            transitionDuration: hasCompleted ? `${TEXT_ZOOM_DURATION}ms` : '1500ms',
          }}
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            The Concert Venues
          </h1>
        </div>
      </div>
    </PageWrapper>
  );
};
