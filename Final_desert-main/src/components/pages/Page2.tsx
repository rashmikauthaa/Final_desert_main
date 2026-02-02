import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page2Props {
  isActive: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

// YouTube Video Configuration
const YOUTUBE_VIDEO_ID = 'j1X5ejWIKfI';
const VIDEO_START_TIME = 406; // 6:44 in seconds
const VIDEO_END_TIME = 426; // 7:06 in seconds

// Text overlay timing (relative to video start time)
const TEXT_APPEAR_TIME = 409; // 6:45 - text appears (1 second after video starts)
const TEXT_FADE_TIME = 412; // 6:48 - text fades out (4 seconds after video starts)

export const Page2: React.FC<Page2Props> = ({ isActive, videoRef }) => {
  const [showText, setShowText] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const timeCheckInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      setShowText(false);
      setShowVideo(false);
      setPlayerReady(false);
      if (playerRef.current && playerRef.current.pauseVideo) {
        playerRef.current.pauseVideo();
      }
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current);
        timeCheckInterval.current = null;
      }
      return;
    }

    if (!YOUTUBE_VIDEO_ID) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        playerRef.current = new window.YT.Player('youtube-player-page2', {
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            mute: 1, // Muted - no audio
            enablejsapi: 1,
            start: VIDEO_START_TIME,
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true);
              setShowVideo(true);
              event.target.mute(); // Ensure muted
              event.target.seekTo(VIDEO_START_TIME);
              event.target.playVideo();

              // Start monitoring video time for text overlay and loop
              timeCheckInterval.current = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                  const currentTime = playerRef.current.getCurrentTime();

                  // Show text between TEXT_APPEAR_TIME and TEXT_FADE_TIME
                  if (currentTime >= TEXT_APPEAR_TIME && currentTime < TEXT_FADE_TIME) {
                    setShowText(true);
                  } else {
                    setShowText(false);
                  }

                  // Loop back to start when reaching end time
                  if (currentTime >= VIDEO_END_TIME) {
                    playerRef.current.seekTo(VIDEO_START_TIME);
                  }
                }
              }, 100); // Check every 100ms for smooth timing
            },
            onStateChange: (event: any) => {
              // If video ends or pauses, restart from start time
              if (event.data === window.YT.PlayerState.ENDED) {
                if (playerRef.current) {
                  playerRef.current.seekTo(VIDEO_START_TIME);
                  playerRef.current.playVideo();
                }
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
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current);
        timeCheckInterval.current = null;
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isActive]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="relative w-full h-full">
        {/* YouTube Video */}
        {YOUTUBE_VIDEO_ID && (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${showVideo && playerReady ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh]">
              <div
                id="youtube-player-page2"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh]"
              />
            </div>
          </div>
        )}

        {/* JAISALMER Text Introduction */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 z-10 ${showText ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
          <div className="text-center">
            <h1 className="font-display text-5xl md:text-7xl lg:text-9xl font-light tracking-[0.2em] text-foreground drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Jaisalmer
            </h1>
          </div>
        </div>

        {/* Placeholder message if no video ID */}
        {!YOUTUBE_VIDEO_ID && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-full h-full max-w-6xl max-h-[80vh] bg-black/50 flex items-center justify-center border-2 border-foreground/20 rounded-lg">
              <p className="font-display text-lg md:text-xl text-foreground/60 text-center px-8">
                YouTube video will be added here
              </p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
