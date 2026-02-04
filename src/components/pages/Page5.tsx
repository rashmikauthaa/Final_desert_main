import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

// Import Suryagarh images
const suryagarh3 = '/assets/images/Suryagarh/3..jpg';
const suryagarh2 = '/assets/images/Suryagarh/2- crop.png';
const suryagarh7 = '/assets/images/Suryagarh/7.webp';
const suryagarh9 = '/assets/images/Suryagarh/9.jpg';
const suryagarh10 = '/assets/images/Suryagarh/10.png';
const suryagarh1 = '/assets/images/Suryagarh/1..webp';
const suryagarh4 = '/assets/images/Suryagarh/4..jpeg';
const suryagarh5 = '/assets/images/Suryagarh/790978138.jpg';

interface Page5Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  audioRef?: React.RefObject<HTMLVideoElement>;
  isPaused?: boolean;
}

// Text blocks for Suryagarh (like Page3 style - showing one at a time)
const suryagarhTextBlocks = [
  "This is where the festival lives when the music stops.",
  "A Haven of Rajasthani heritage, desert-set hotel Suryagarh is a passage into India's past.",
  "The festival's home is more than a place to stay, it's a desert-born palace, where history and most opulent luxury meet under golden skies.",
  "Nestled in the heart of the Thar Desert, Suryagarh offers an escape of most divine grandeur, surrounded by untouched landscapes, every moment invites reflection, connection and a sense of belonging.",
];

// Keywords for Suryagarh - "heaven of Rajasthan" and others
const suryagarhKeywords = ['Luxury', 'Heritage', 'Palace', 'Sanctuary'];

// Slideshow images (2, 7, 9, 10, 1, 4, 5)
const suryagarhSlideshowImages = [
  suryagarh5,
  suryagarh2,
  suryagarh7,
  suryagarh9,
  suryagarh10,
  suryagarh1,
  suryagarh4
];

const TEXT_DURATION = 4500; // Duration for each text block (like Page3)
const TEXT_TOTAL = suryagarhTextBlocks.length * TEXT_DURATION;
const SLIDE_DURATION = 6000; // 6s per slide for smooth crossfade (4s transition overlaps)
const SLIDESHOW_TOTAL = suryagarhSlideshowImages.length * SLIDE_DURATION;

export const Page5: React.FC<Page5Props> = ({ isActive, onSlideshowComplete, audioRef, isPaused }) => {
  const [phase, setPhase] = useState<'text' | 'slideshow'>('text');
  const [activeText, setActiveText] = useState(0);
  const [showKeywords, setShowKeywords] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const resetState = useCallback(() => {
    setPhase('text');
    setActiveText(0);
    setShowKeywords(false);
    setCurrentSlideIndex(0);
  }, []);

  useEffect(() => {
    if (isActive) {
      resetState();
    }
  }, [isActive, resetState]);

  // Main timer logic
  useEffect(() => {
    if (!isActive || isPaused) return;

    let timer: NodeJS.Timeout;
    let keywordTimer: NodeJS.Timeout;

    if (phase === 'text') {
      // Timer to advance text
      timer = setTimeout(() => {
        if (activeText < suryagarhTextBlocks.length - 1) {
          setActiveText(prev => prev + 1);
        } else {
          setPhase('slideshow');
        }
      }, TEXT_DURATION);

      if (activeText === 1 && !showKeywords) {
        keywordTimer = setTimeout(() => {
          setShowKeywords(true);
        }, 2000);
      }
    } else if (phase === 'slideshow') {
      timer = setTimeout(() => {
        setCurrentSlideIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= suryagarhSlideshowImages.length) {
            if (onSlideshowComplete) onSlideshowComplete();
            return prev;
          }
          return nextIndex;
        });
      }, SLIDE_DURATION);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(keywordTimer);
    };
  }, [isActive, isPaused, phase, activeText, currentSlideIndex, showKeywords, onSlideshowComplete]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden">
        {/* Text Phase - Background Image */}
        {phase === 'text' && (
          <>
            <div className="absolute inset-0 transition-opacity duration-[4000ms] z-0">
              <img
                src={suryagarh3}
                alt="Suryagarh Hotel"
                className="w-full h-full object-cover"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

            {/* Text Content - animated like Page3 */}
            <div className="relative z-10 h-full flex items-start justify-center px-8 pt-32">
              <div
                key={activeText}
                className="max-w-4xl text-center space-y-6"
              >
                <p className="text-lg md:text-xl lg:text-2xl font-thin leading-relaxed text-white transition-opacity duration-[4000ms] opacity-100">
                  {suryagarhTextBlocks[activeText]}
                </p>

                {/* Keywords in pill containers - shown when second text block is active */}
                {activeText === 1 && (
                  <div
                    className={`flex flex-wrap justify-center gap-3 md:gap-4 pt-6 transition-all duration-[4000ms] ${showKeywords ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                  >
                    {suryagarhKeywords.map((keyword, index) => (
                      <span
                        key={keyword}
                        className="font-display text-lg md:text-xl lg:text-2xl font-thin text-white px-3 py-1 transition-opacity duration-[4000ms]"
                        style={{
                          transitionDelay: showKeywords ? `${index * 300}ms` : '0ms',
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Slideshow Phase - with page-turn animation */}
        {phase === 'slideshow' && (
          <div className="absolute inset-0 bg-black">
            {suryagarhSlideshowImages.map((image, index) => (
              <div
              key={index}
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-[4000ms] ease-in-out"
                style={{
                  opacity: index === currentSlideIndex ? 1 : 0,
                  zIndex: index === currentSlideIndex ? 10 : 0,
                }}
              >
                <img
                  src={image}
                  alt={`Suryagarh Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
