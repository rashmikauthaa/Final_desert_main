import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page6Props {
  isActive: boolean;
  isPaused?: boolean;
}

export const Page6: React.FC<Page6Props> = ({ isActive, isPaused }) => {
  const [showPara1, setShowPara1] = useState(false);
  const [showPara2, setShowPara2] = useState(false);
  const [showPara3, setShowPara3] = useState(false);
  const [showPara4, setShowPara4] = useState(false);
  const [showOutro, setShowOutro] = useState(false);

  // Use a step-based timer to allow pausing
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setShowPara1(false);
      setShowPara2(false);
      setShowPara3(false);
      setShowPara4(false);
      setShowOutro(false);
      setStep(0);
      return;
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    let timer: NodeJS.Timeout;

    // Timeline
    // 0 -> 300ms -> Para1
    // 1 -> 1500ms (1200 diff) -> Para2
    // 2 -> 3000ms (1500 diff) -> Para3
    // 3 -> 5000ms (2000 diff) -> Para4
    // 4 -> 7000ms (2000 diff) -> Outro

    if (step === 0) {
      timer = setTimeout(() => {
        setShowPara1(true);
        setStep(1);
      }, 300);
    } else if (step === 1) {
      timer = setTimeout(() => {
        setShowPara2(true);
        setStep(2);
      }, 1200);
    } else if (step === 2) {
      timer = setTimeout(() => {
        setShowPara3(true);
        setStep(3);
      }, 1500);
    } else if (step === 3) {
      timer = setTimeout(() => {
        setShowPara4(true);
        setStep(4);
      }, 2000);
    } else if (step === 4) {
      timer = setTimeout(() => {
        setShowOutro(true);
        setStep(5);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [isActive, isPaused, step]);

  return (
    <PageWrapper
      isActive={isActive}
      backgroundImage="/assets/images/Manganiyars/PAGE_6_PHOTO.jpg"
      overlayOpacity={0.6}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <div className="space-y-5 md:space-y-6">
          {/* Title */}
          <h2
            className={`font-display text-xl md:text-2xl lg:text-3xl font-light text-primary mb-6 transition-all duration-[4000ms] tracking-[0.15em] ${showPara1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ textShadow: '0 2px 20px hsl(var(--background) / 0.9)' }}
          >
            THE MANGANIYAR MUSICIANS
          </h2>

          <p
            className={`font-display text-base md:text-lg lg:text-xl font-light text-foreground/90 leading-relaxed transition-all duration-[4000ms] ${showPara1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ textShadow: '0 2px 20px hsl(var(--background) / 0.9)' }}
          >
            A caste of hereditary musicians from the Thar Desert in Rajasthan, India
          </p>

          <p
            className={`font-display text-sm md:text-base lg:text-lg font-light text-foreground/85 leading-relaxed transition-all duration-[4000ms] ${showPara2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ textShadow: '0 2px 20px hsl(var(--background) / 0.9)' }}
          >
            Famed for preserving oral histories & devotional poetry through captivating songs for centuries.
          </p>

          <p
            className={`font-display text-sm md:text-base lg:text-lg font-light text-foreground/85 leading-relaxed transition-all duration-[4000ms] ${showPara3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ textShadow: '0 2px 20px hsl(var(--background) / 0.9)' }}
          >
            They are vital custodians of Rajasthani culture, keeping desert tradition alive through melody & rhythm, creating haunting melodies used for storytelling using distinctive instruments exclusive to their community.
          </p>

          <p
            className={`font-display text-sm md:text-base lg:text-lg font-light text-foreground/85 leading-relaxed transition-all duration-[4000ms] ${showPara4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ textShadow: '0 2px 20px hsl(var(--background) / 0.9)' }}
          >
            Several musicians have received highest awards in Music, such as The Padma Shri, one of the highest civilian awards of the Republic of India.
          </p>

          <p
            className={`font-display text-sm md:text-base lg:text-lg font-light text-foreground/80 leading-relaxed transition-all duration-[4000ms] ${showPara4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ textShadow: '0 2px 20px hsl(var(--background) / 0.9)' }}
          >
            They are truly grand masters in their arts and are recognised globally as such.
          </p>

          <p
            className={`font-display text-lg md:text-xl lg:text-2xl font-light text-primary italic leading-relaxed transition-all duration-[4000ms] pt-4 ${showOutro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ textShadow: '0 2px 20px hsl(var(--background) / 0.9)' }}
          >
            Generation after Generation. After Generation.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};
