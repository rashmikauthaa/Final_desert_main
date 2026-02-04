import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { useAudio } from '@/contexts/AudioContext';

interface Page8Props {
  isActive: boolean;
  onVideoStart?: () => void;
  onVideoEnd?: () => void;
  onSlideshowComplete?: () => void;
  audioRef?: React.RefObject<HTMLVideoElement>;
  isPaused?: boolean;
}

// Images from public/assets/Slideshow folder
const images = [
  "/assets/images/Manganiyars/1.jpg",
  "/assets/images/Manganiyars/2...jpg",
  "/assets/images/Manganiyars/3...jpg",
  "/assets/images/Manganiyars/4.jpg",
  "/assets/images/Manganiyars/5...jpg",
  "/assets/images/Manganiyars/8...jpg",
];

const SLIDE_DURATION = 3000; // 3s per slide for smooth crossfade (4s transition overlaps)

export const Page8: React.FC<Page8Props> = ({ isActive, onVideoStart, onVideoEnd, onSlideshowComplete, audioRef, isPaused }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isMuted } = useAudio();
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      setCurrentIndex(0);
      hasCompletedRef.current = false;
      return;
    }

    onVideoStart?.();
  }, [isActive, onVideoStart]);

  // Slideshow Timer
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        // When slideshow reaches end, navigate to next page
        if (nextIndex >= images.length) {
          if (!hasCompletedRef.current && onSlideshowComplete) {
            hasCompletedRef.current = true;
            setTimeout(() => onSlideshowComplete(), 500);
          }
          return prev; // Stay on last slide
        }
        return nextIndex;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [isActive, isPaused, onSlideshowComplete]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[4000ms] ease-out ${index === currentIndex
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
              }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${image})`,
                backgroundColor: 'hsl(var(--muted))',
              }}
            />
          </div>
        ))}

        {/* Subtle vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,hsl(var(--background)/0.4)_100%)]" />
      </div>
    </PageWrapper>
  );
};
