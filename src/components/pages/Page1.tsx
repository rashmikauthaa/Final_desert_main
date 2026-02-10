import { useEffect, useState, useRef, useCallback } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { useAudio } from '@/contexts/AudioContext';

interface Page1Props {
  isActive: boolean;
  audioRef?: React.RefObject<HTMLVideoElement>;
  isPaused?: boolean;
  hasInteracted: boolean;
}

const VIDEO_CLIPS = ['https://ik.imagekit.io/c2g5xtzznq/clip1.mp4', 'https://ik.imagekit.io/c2g5xtzznq/clip2.mp4'];

export const Page1: React.FC<Page1Props> = ({ isActive, audioRef, isPaused = false, hasInteracted }) => {
  const [showCaravana, setShowCaravana] = useState(false);
  const [showCenter, setShowCenter] = useState(false);
  const [showIndia, setShowIndia] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadVideoRef = useRef<HTMLVideoElement>(null);
  const clipIndexRef = useRef(0);
  const { isMuted } = useAudio();

  // Eagerly preload both video clips into browser cache on mount
  useEffect(() => {
    VIDEO_CLIPS.forEach((src) => {
      const preloadEl = document.createElement('video');
      preloadEl.preload = 'auto';
      preloadEl.muted = true;
      preloadEl.src = src;
      // Trigger loading by calling load()
      preloadEl.load();
    });
  }, []);

  const playNextClip = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    clipIndexRef.current = (clipIndexRef.current + 1) % VIDEO_CLIPS.length;
    video.src = VIDEO_CLIPS[clipIndexRef.current];
    video.play().catch(console.error);

    // Pre-buffer the next clip in the hidden preload element  
    const nextIndex = (clipIndexRef.current + 1) % VIDEO_CLIPS.length;
    if (preloadVideoRef.current) {
      preloadVideoRef.current.src = VIDEO_CLIPS[nextIndex];
      preloadVideoRef.current.load();
    }
  }, []);

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    clipIndexRef.current = 0;
    video.src = VIDEO_CLIPS[0];
    video.play().catch(console.error);

    // Pre-buffer clip 2 while clip 1 plays
    if (preloadVideoRef.current) {
      preloadVideoRef.current.src = VIDEO_CLIPS[1];
      preloadVideoRef.current.load();
    }

    if (audioRef?.current) {
      audioRef.current.currentTime = 195;
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(console.error);
    }
  }, [audioRef, isMuted]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsVideoLoaded(true);
    const handleEnded = () => playNextClip();

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, [playNextClip]);

  // Pause/resume
  useEffect(() => {
    if (!isActive) return;

    if (isPaused) {
      videoRef.current?.pause();
      audioRef?.current?.pause();
    } else {
      videoRef.current?.play().catch(console.error);
      if (audioRef?.current?.paused) audioRef.current.play().catch(console.error);
    }
  }, [isPaused, isActive, audioRef]);

  // Mute sync
  useEffect(() => {
    if (audioRef?.current) audioRef.current.muted = isMuted;
  }, [isMuted, audioRef]);

  // Animation order + start playback when active
  useEffect(() => {
    if (isActive && hasInteracted) {
      setTimeout(() => setShowCaravana(true), 1000);
      setTimeout(() => setShowIndia(true), 3000);
      setTimeout(() => setShowCenter(true), 5000);

      if (!isPaused) startPlayback();
    } else {
      setShowCaravana(false);
      setShowIndia(false);
      setShowCenter(false);
      videoRef.current?.pause();
    }
  }, [isActive, hasInteracted, isPaused, startPlayback]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0.3}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.78vh] scale-[1.35]">
        <video
          ref={videoRef}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover transition-opacity duration-700 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          muted
          playsInline
          preload="auto"
        />
        {/* Hidden preload element for next clip */}
        <video
          ref={preloadVideoRef}
          className="hidden"
          muted
          playsInline
          preload="auto"
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
        <div className={`absolute bottom-48 right-10 text-right transition-all duration-[3000ms] ease-out ${showIndia ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
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
