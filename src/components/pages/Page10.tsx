import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

// Images
const sunriseConcertStage = '/assets/images/Concert_Venues/1-CROP +IF POSS. TEXT \'SUNRISE CONCERT STAGE\' .png';
const sereneLakes = '/assets/images/Concert_Venues/shutterstock_1510771793.jpg';
const sunsetConcertOasis = '/assets/images/Concert_Venues/7. +TEXT SUNSET CONCERT OASIS .jpg';
const stepwellsTemples = '/assets/images/Concert_Venues/shutterstock_1251077002.jpg';

interface Page10Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

const TEXT_STAGGER_DELAY = 800;
const IMAGE_DISPLAY_DURATION = 3000;

const venueImages = [
  null,
  sunriseConcertStage,
  sereneLakes,
  sunsetConcertOasis,
  stepwellsTemples,
];

type VisibleKey =
  | 'intro'
  | 'forts'
  | 'palaces'
  | 'lakes'
  | 'stepwells'
  | 'temples'
  | 'continuation'
  | 'highlight';

export const Page10: React.FC<Page10Props> = ({
  isActive,
  onSlideshowComplete,
  isPaused,
}) => {
  const [visible, setVisible] = useState<Set<VisibleKey>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);

  const show = (key: VisibleKey) =>
    setVisible(v => new Set(v).add(key));

  const setImage = (index: number) => {
    setPreviousImageIndex(currentImageIndex);
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (!isActive || isPaused) return;

    let cancelled = false;
    let totalDelay = 0;

    const timeline = [
      { d: 500, a: () => show('intro') },
      { d: TEXT_STAGGER_DELAY, a: () => { show('forts'); setImage(1); } },
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => show('palaces') },
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => { show('lakes'); setImage(2); } },
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => { show('stepwells'); setImage(3); } },
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => { show('temples'); setImage(4); } },
      { d: IMAGE_DISPLAY_DURATION * 0.3, a: () => show('continuation') },
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => show('highlight') },
      { d: 3000, a: () => onSlideshowComplete?.() },
    ];

    timeline.forEach(item => {
      totalDelay += item.d;
      setTimeout(() => {
        if (!cancelled) item.a();
      }, totalDelay);
    });

    return () => {
      cancelled = true;
      setVisible(new Set());
      setCurrentImageIndex(0);
      setPreviousImageIndex(0);
    };
  }, [isActive, isPaused]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      {/* MAIN SPLIT CONTAINER */}
      <div className="w-full h-screen flex">

        {/* LEFT — TEXT */}
        <div className="w-2/5 h-full flex items-center px-14 bg-background relative z-10">
          <div className="max-w-md space-y-6">

            {visible.has('intro') && (
              <p className="text-lg font-light leading-relaxed">
                The Festival unfolds in some of Rajasthan's most iconic heritage sites and breathtaking settings.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {visible.has('forts') && (
                <span className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-primary/30 rounded-full text-primary text-lg font-light">
                  Ancient Forts
                </span>
              )}
              {visible.has('palaces') && (
                <span className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-primary/30 rounded-full text-primary text-lg font-light">
                  Palaces
                </span>
              )}
              {visible.has('lakes') && (
                <span className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-primary/30 rounded-full text-primary text-lg font-light">
                  Serene Lakes
                </span>
              )}
              {visible.has('stepwells') && (
                <span className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-primary/30 rounded-full text-primary text-lg font-light">
                  Timeless Stepwells
                </span>
              )}
              {visible.has('temples') && (
                <span className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-primary/30 rounded-full text-primary text-lg font-light">
                  Candle-lit Desert Temples
                </span>
              )}
            </div>

            {visible.has('continuation') && (
              <p className="text-lg font-light leading-relaxed pt-4">
                These spectacular UNESCO World Heritage Sites have been exclusively opened to us by His Highness
              </p>
            )}

            {visible.has('highlight') && (
              <div className="inline-block px-6 py-4 bg-black/60 backdrop-blur-sm rounded-xl border border-primary/20 mt-4">
                <p className="text-xl md:text-2xl font-light text-primary drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
                  Maharadjadhiraj Maharawal of Jaisalmer Chaitainya Raj
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — IMAGES */}
        <div className="w-3/5 h-full relative overflow-hidden">
          <div className="absolute inset-0 perspective-[1200px]">
            {venueImages.map((image, index) => {
              if (!image) return null;

              const isActiveImg = index === currentImageIndex;
              const wasActive = index === previousImageIndex;

              return (
                <div
                  key={index}
                  className="absolute inset-0 transition-all duration-1000 ease-in-out"
                  style={{
                    opacity: isActiveImg ? 1 : 0,
                    transform: isActiveImg
                      ? 'rotateY(0deg)'
                      : wasActive
                        ? 'rotateY(-90deg)'
                        : 'rotateY(90deg)',
                    zIndex: isActiveImg ? 10 : 5,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={image}
                    className="w-full h-full object-cover"
                    alt="Venue"
                  />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};
