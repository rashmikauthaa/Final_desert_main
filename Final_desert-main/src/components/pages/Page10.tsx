import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

// Import Concert Venues images
const sunriseConcertStage = '/assets/images/Concert_Venues/1-CROP +IF POSS. TEXT \'SUNRISE CONCERT STAGE\' .png';
const sereneLakes = '/assets/images/Concert_Venues/shutterstock_1510771793.jpg';
const sunsetConcertOasis = '/assets/images/Concert_Venues/7. +TEXT SUNSET CONCERT OASIS .jpg';
const stepwellsTemples = '/assets/images/Concert_Venues/shutterstock_1251077002.jpg';

interface Page10Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

const TEXT_STAGGER_DELAY = 800; // Delay between each text section
const IMAGE_DISPLAY_DURATION = 3000; // Duration to show each image with text

// Array of all venue images for page-turn animation
const venueImages = [
  null, // index 0 - no image initially
  sunriseConcertStage, // index 1
  sereneLakes, // index 2
  sunsetConcertOasis, // index 3
  stepwellsTemples, // index 4
];

export const Page10: React.FC<Page10Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
  const [showIntro, setShowIntro] = useState(false);
  const [showForts, setShowForts] = useState(false);
  const [showPalaces, setShowPalaces] = useState(false);
  const [showLakes, setShowLakes] = useState(false);
  const [showStepwells, setShowStepwells] = useState(false);
  const [showTemples, setShowTemples] = useState(false);
  const [showContinuation, setShowContinuation] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [showValues, setShowValues] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);

  // Manage steps explicitly
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setShowIntro(false);
      setShowForts(false);
      setShowPalaces(false);
      setShowLakes(false);
      setShowStepwells(false);
      setShowTemples(false);
      setShowContinuation(false);
      setShowHighlight(false);
      setShowValues(false);
      setCurrentImageIndex(0);
      setPreviousImageIndex(0);
      setStep(0);
      return;
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    let timer: NodeJS.Timeout;

    // Mapping steps to actions and delays
    // Step 0: Start -> Wait 500ms -> Intro
    if (step === 0) {
      timer = setTimeout(() => {
        setShowIntro(true);
        setStep(1);
      }, 500);
    } else if (step === 1) {
      // Wait TEXT_STAGGER_DELAY -> Forts
      timer = setTimeout(() => {
        setShowForts(true);
        setPreviousImageIndex(currentImageIndex);
        setCurrentImageIndex(1);
        setStep(2);
      }, TEXT_STAGGER_DELAY);
    } else if (step === 2) {
      // Wait IMAGE_DISPLAY_DURATION * 0.5 -> Palaces
      timer = setTimeout(() => {
        setShowPalaces(true);
        setStep(3);
      }, IMAGE_DISPLAY_DURATION * 0.5);
    } else if (step === 3) {
      // Wait (IMAGE_DISPLAY_DURATION - (IMAGE_DISPLAY_DURATION * 0.5) + TEXT_STAGGER_DELAY... wait, original logic was absolute delays)
      // Original:
      // Intro: 500
      // Forts: 500 + STAGGER
      // Palaces: 500 + STAGGER + IMAGE*0.5
      // Lakes: 500 + STAGGER + IMAGE

      // My step 2 delay was correct (IMAGE*0.5 gap from Forts to Palaces)
      // Step 3: Palaces to Lakes. Gap = IMAGE - IMAGE*0.5 = IMAGE*0.5?
      // Let's recheck original math.
      // Forts at T1 = 500 + STAGGER
      // Palaces at T2 = T1 + IMAGE*0.5
      // Lakes at T3 = T1 + IMAGE
      // So yes, gap between Palaces and Lakes is IMAGE*0.5

      timer = setTimeout(() => {
        setShowLakes(true);
        setPreviousImageIndex(currentImageIndex);
        setCurrentImageIndex(2);
        setStep(4);
      }, IMAGE_DISPLAY_DURATION * 0.5);
    } else if (step === 4) {
      // Lakes (T3) to Stepwells (T4 = T1 + IMAGE*1.5). Gap = IMAGE*0.5
      timer = setTimeout(() => {
        setShowStepwells(true);
        setPreviousImageIndex(currentImageIndex);
        setCurrentImageIndex(3);
        setStep(5);
      }, IMAGE_DISPLAY_DURATION * 0.5);
    } else if (step === 5) {
      // Stepwells (T4) to Temples (T5 = T1 + IMAGE*2). Gap = IMAGE*0.5
      timer = setTimeout(() => {
        setShowTemples(true);
        setPreviousImageIndex(currentImageIndex);
        setCurrentImageIndex(4);
        setStep(6);
      }, IMAGE_DISPLAY_DURATION * 0.5);
    } else if (step === 6) {
      // Temples (T5) to Values (T6 = T1 + IMAGE*2.2). Gap = IMAGE*0.2
      timer = setTimeout(() => {
        setShowValues(true);
        setStep(7);
      }, IMAGE_DISPLAY_DURATION * 0.2);
    } else if (step === 7) {
      // Values (T6) to Continuation (T7 = T1 + IMAGE*2.5). Gap = IMAGE*0.3
      timer = setTimeout(() => {
        setShowContinuation(true);
        setStep(8);
      }, IMAGE_DISPLAY_DURATION * 0.3);
    } else if (step === 8) {
      // Continuation (T7) to Highlight (T8 = T1 + IMAGE*3). Gap = IMAGE*0.5
      timer = setTimeout(() => {
        setShowHighlight(true);
        setStep(9);
      }, IMAGE_DISPLAY_DURATION * 0.5);
    } else if (step === 9) {
      // Highlight shown. Wait 3000ms then complete.
      timer = setTimeout(() => {
        if (onSlideshowComplete) onSlideshowComplete();
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [isActive, isPaused, step, currentImageIndex, onSlideshowComplete]);


  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden" style={{ zIndex: 0 }}>
        {/* Background Images - Full screen with page-turn animation */}
        <div className="absolute inset-0 perspective-[1000px]">
          {venueImages.map((image, index) => {
            if (!image) return null; // Skip null images

            const isActive = index === currentImageIndex;
            const wasActive = index === previousImageIndex && index !== currentImageIndex;
            const shouldShow = isActive || wasActive;

            return (
              <div
                key={index}
                className="absolute inset-0 transition-all duration-1000 ease-in-out"
                style={{
                  opacity: shouldShow ? (isActive ? 1 : 0) : 0,
                  transform: isActive
                    ? 'perspective(1000px) rotateY(0deg) scale(1)'
                    : wasActive
                      ? 'perspective(1000px) rotateY(-90deg) scale(0.95)'
                      : index < currentImageIndex
                        ? 'perspective(1000px) rotateY(-90deg) scale(0.95)'
                        : 'perspective(1000px) rotateY(90deg) scale(0.95)',
                  zIndex: isActive ? 10 : wasActive ? 5 : index < currentImageIndex ? 5 : 0,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={image}
                  alt="Concert Venue"
                  className="w-full h-full object-cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Text Content */}
      <div className="relative z-20 w-full h-full flex items-center justify-center px-8 md:px-16 lg:px-24">
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl text-center space-y-6 md:space-y-8">
          {/* Intro Text */}
          <p
            className={`font-display text-base md:text-lg lg:text-xl font-light leading-relaxed text-foreground/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-1500 ease-out ${showIntro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            The Festival unfolds in some of Rajasthan's most iconic heritage sites and breathtaking settings.
          </p>

          {/* Royal Block Format - Venue Texts in Pill Containers */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {/* Ancient forts - with image */}
            {showForts && (
              <span
                className="font-display text-lg md:text-xl lg:text-2xl font-light text-primary px-3 py-1 border border-primary/30 rounded-full transition-all duration-1500 ease-out opacity-100 translate-y-0"
                style={{
                  textShadow: '0 2px 10px hsl(var(--background) / 0.8)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Ancient Forts
              </span>
            )}

            {/* Palaces - with image */}
            {showPalaces && (
              <span
                className="font-display text-lg md:text-xl lg:text-2xl font-light text-primary px-3 py-1 border border-primary/30 rounded-full transition-all duration-1500 ease-out opacity-100 translate-y-0"
                style={{
                  textShadow: '0 2px 10px hsl(var(--background) / 0.8)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Palaces
              </span>
            )}

            {/* Serene lakes - with image */}
            {showLakes && (
              <span
                className="font-display text-lg md:text-xl lg:text-2xl font-light text-primary px-3 py-1 border border-primary/30 rounded-full transition-all duration-1500 ease-out opacity-100 translate-y-0"
                style={{
                  textShadow: '0 2px 10px hsl(var(--background) / 0.8)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Serene Lakes
              </span>
            )}

            {/* Timeless stepwells - with image */}
            {showStepwells && (
              <span
                className="font-display text-lg md:text-xl lg:text-2xl font-light text-primary px-3 py-1 border border-primary/30 rounded-full transition-all duration-1500 ease-out opacity-100 translate-y-0"
                style={{
                  textShadow: '0 2px 10px hsl(var(--background) / 0.8)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Timeless Stepwells
              </span>
            )}

            {/* Candle-lit desert temples - with image */}
            {showTemples && (
              <span
                className="font-display text-lg md:text-xl lg:text-2xl font-light text-primary px-3 py-1 border border-primary/30 rounded-full transition-all duration-1500 ease-out opacity-100 translate-y-0"
                style={{
                  textShadow: '0 2px 10px hsl(var(--background) / 0.8)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Candle-lit Desert Temples
              </span>
            )}
          </div>

          {/* Continuation text */}
          {showContinuation && (
            <p
              className="font-display text-base md:text-lg lg:text-xl font-light leading-relaxed text-foreground/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-1500 ease-out opacity-100 translate-y-0"
            >
              These spectacular UNESCO World Heritage Sites, oozing with history and atmosphere, have been graciously and exclusively opened to us by His Highness
            </p>
          )}

          {/* Highlighted text */}
          <p
            className={`font-display text-lg md:text-2xl lg:text-3xl font-light leading-relaxed text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-1500 ease-out ${showHighlight ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            style={{
              textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 0 20px rgba(212, 175, 55, 0.3)',
            }}
          >
            Maharadjadhiraj Maharawal of
            Jaisalmer Chaitainya Raj.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};
