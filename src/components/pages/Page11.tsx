import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page11Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

const DISPLAY_DURATION = 3000; // 3 seconds to display the title

export const Page11: React.FC<Page11Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setShowTitle(false);
      setStep(0);
      return;
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    let timer: NodeJS.Timeout;

    // Timeline:
    // 0 -> 500ms -> Show Title (step 1)
    // 1 -> DISPLAY_DURATION (3000ms) -> Complete (step 2)

    if (step === 0) {
      timer = setTimeout(() => {
        setShowTitle(true);
        setStep(1);
      }, 500);
    } else if (step === 1) {
      timer = setTimeout(() => {
        if (onSlideshowComplete) {
          onSlideshowComplete();
        }
        setStep(2);
      }, DISPLAY_DURATION);
    }

    return () => clearTimeout(timer);
  }, [isActive, isPaused, step, onSlideshowComplete]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center">
        <div
          className="text-center transition-all ease-out"
          style={{
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
            transitionDuration: '3500ms',
          }}
        >
          <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-light text-foreground drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            Artists In Conversation
          </h1>
        </div>
      </div>
    </PageWrapper>
  );
};
