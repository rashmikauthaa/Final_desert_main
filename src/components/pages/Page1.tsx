import { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { useAudio } from '@/contexts/AudioContext';

interface Page1Props {
  isActive: boolean;
  audioRef?: React.RefObject<HTMLVideoElement>;
  isPaused?: boolean;
}

const YOUTUBE_CLIPS = [
  { start: 42, end: 51 },
  { start: 69, end: 77 },
];

const YOUTUBE_VIDEO_ID = 'TQrxavU5dTI';

export const Page1: React.FC<Page1Props> = ({ isActive, audioRef, isPaused = false }) => {
  const [showCaravana, setShowCaravana] = useState(false);
  const [showCenter, setShowCenter] = useState(false);
  const [showIndia, setShowIndia] = useState(false);
  const playerRef = useRef<any>(null);
  const clipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { isMuted } = useAudio();

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.getElementsByTagName('script')[0].parentNode?.insertBefore(tag, null);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        playerRef.current = new window.YT.Player('youtube-player-page1', {
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            mute: 1,
            start: YOUTUBE_CLIPS[0].start,
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              event.target.mute();
              if (isActive && !isPaused) playClipSequence();
            },
          },
        });
      }
    };

    if (window.YT?.Player) initPlayer();
    else (window as any).onYouTubeIframeAPIReady = initPlayer;

    return () => {
      if (clipTimerRef.current) clearTimeout(clipTimerRef.current);
    };
  }, []);

  const playClipSequence = () => {
    if (!playerRef.current) return;

    const playClip = (index: number) => {
      const clip = YOUTUBE_CLIPS[index % YOUTUBE_CLIPS.length];
      const duration = (clip.end - clip.start) * 1000;

      playerRef.current.seekTo(clip.start, true);
      playerRef.current.playVideo();

      clipTimerRef.current = setTimeout(() => playClip(index + 1), duration);
    };

    playClip(0);

    if (audioRef?.current) {
      audioRef.current.currentTime = 195;
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(console.error);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    if (isPaused) {
      playerRef.current?.pauseVideo();
      audioRef?.current?.pause();
      if (clipTimerRef.current) clearTimeout(clipTimerRef.current);
    } else {
      playerRef.current?.playVideo();
      if (audioRef?.current?.paused) audioRef.current.play().catch(console.error);
    }
  }, [isPaused, isActive]);

  useEffect(() => {
    if (audioRef?.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  // ✅ ANIMATION ORDER FIXED HERE
  useEffect(() => {
    if (isActive) {
      setTimeout(() => setShowCenter(true), 1000);    // THE ROAD TO JAISALMER (first)
      setTimeout(() => setShowIndia(true), 4000);     // INDIA + DATE (second)
      setTimeout(() => setShowCaravana(true), 2500);  // CARAVANA (last)

      if (!isPaused) playClipSequence();
    } else {
      setShowCaravana(false);
      setShowIndia(false);
      setShowCenter(false);
      playerRef.current?.pauseVideo();
      if (clipTimerRef.current) clearTimeout(clipTimerRef.current);
    }
  }, [isActive]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0.3}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh] scale-[1.35]">
        <div
          id="youtube-player-page1"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh]"
        />
      </div>

      <div className="absolute inset-0 bg-background/50" />

      <div className="relative z-10 w-full h-full">
        {/* CARAVANA */}
        <div className={`absolute top-10 right-10 transition-all duration-[3000ms] ease-out ${showCaravana ? 'opacity-100' : 'opacity-0 translate-y-12'}`}>
          <h1 className="font-display text-6xl font-thin tracking-[0.3em] text-foreground text-right">
            CARAVANA
          </h1>
        </div>

        {/* CENTER */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-[3000ms] ease-out ${showCenter ? 'opacity-100' : 'opacity-0 translate-y-12'}`}>
          <p className="font-display text-2xl font-thin tracking-[0.25em] text-foreground text-center">
            THE ROAD TO JAISALMER
          </p>
        </div>

        {/* INDIA */}
        <div className={`absolute bottom-56 right-10 text-right transition-all duration-[3000ms] ease-out ${showIndia ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="font-display text-xl font-thin tracking-[0.2em] text-foreground">
            INDIA
          </p>
          <p className="font-display text-base font-thin tracking-[0.2em] text-foreground/80 mt-2">
            2–5 NOVEMBER 2026
          </p>
        </div>
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
