import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

// Images
const sunriseConcertStage = '/assets/images/Concert_Venues/1-CROP +IF POSS. TEXT \'SUNRISE CONCERT STAGE\' .png';
const img2 = '/assets/images/Concert_Venues/img2.jpg';
const img3 = '/assets/images/Concert_Venues/img3.jpg';
const img5 = '/assets/images/Concert_Venues/img5.webp';
const img6 = '/assets/images/Concert_Venues/img6.jpg';
const sereneLakes = '/assets/images/Concert_Venues/shutterstock_1510771793.jpg';
const sunsetConcertOasis = '/assets/images/Concert_Venues/7. +TEXT SUNSET CONCERT OASIS .jpg';
const img4 = '/assets/images/Concert_Venues/img4.jpg';

interface Page10Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

const TEXT_STAGGER_DELAY = 800;
const IMAGE_DISPLAY_DURATION = 3000;

const venueImages = [
  sunriseConcertStage,
  img2,
  sunsetConcertOasis,
  img3,
  img5,
  img4,
  sereneLakes,
  img6
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
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => { show('palaces'); setImage(5); } },
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => { show('lakes'); setImage(2); } },
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => { show('stepwells'); setImage(3); } },
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => { show('temples'); setImage(4); } },
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => { show('continuation'); setImage(6); } },
      { d: IMAGE_DISPLAY_DURATION * 0.5, a: () => { show('highlight'); setImage(7); } },
      { d: 3000, a: () => onSlideshowComplete?.() },
    ];

    timeline.forEach(item => {
      totalDelay += item.d;
      setTimeout(() => !cancelled && item.a(), totalDelay);
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
      {/* FULLSCREEN IMAGE SLIDESHOW */}
      <div className="fixed inset-0 overflow-hidden">
        {venueImages.map((image, index) => {
          const isActiveImg = index === currentImageIndex;
          const wasActive = index === previousImageIndex;

          return (
            <div
              key={index}
              className="absolute inset-0 transition-all duration-1000 ease-in-out"
              style={{
                opacity: isActiveImg ? 1 : 0,
                transform: isActiveImg
                  ? 'scale(1)'
                  : wasActive
                    ? 'scale(1.1)'
                    : 'scale(0.95)',
                zIndex: isActiveImg ? 10 : 5,
              }}
            >
              <img
                src={image}
                alt="Venue"
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}

        {/* subtle gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-20" />
      </div>

      {/* FLOATING TEXT OVERLAY */}
      <div className="relative z-30 h-full flex items-center px-16 md:px-24 max-w-3xl">
        <div className="space-y-6 text-white">

          {visible.has('intro') && (
            <p className="text-xl font-light leading-relaxed">
              The Festival unfolds in some of Rajasthan's most iconic heritage sites and breathtaking settings.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {visible.has('forts') && <Tag>Ancient Forts</Tag>}
            {visible.has('palaces') && <Tag>Palaces</Tag>}
            {visible.has('lakes') && <Tag>Serene Lakes</Tag>}
            {visible.has('stepwells') && <Tag>Timeless Stepwells</Tag>}
            {visible.has('temples') && <Tag>Candle-lit Desert Temples</Tag>}
          </div>

          {visible.has('continuation') && (
            <p className="text-lg font-light pt-4">
              These spectacular UNESCO World Heritage Sites have been exclusively opened to us by His Highness
            </p>
          )}

          {visible.has('highlight') && (
            <p className="text-2xl font-light text-primary pt-4">
              Maharadjadhiraj Maharawal of Jaisalmer Chaitainya Raj
            </p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

/* ---------- Small Helper ---------- */
const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="px-4 py-1 border border-primary/40 rounded-full text-primary text-lg font-light backdrop-blur-sm bg-black/40">
    {children}
  </span>
);