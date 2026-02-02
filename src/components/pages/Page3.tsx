import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

// Images
const sunriseConcert = '/assets/images/Jaisalmer/1-CROP +IF POSS. TEXT \'SUNRISE CONCERT STAGE\' .png';
const jaisalmerBhrama = '/assets/images/Jaisalmer/Bhrama_3187.webp';
const jaisalmerShutterstock1 = '/assets/images/Jaisalmer/shutterstock_1832570845.jpg';
const jaisalmerBeige08 = '/assets/images/Jaisalmer/Beige08.webp';
const jaisalmeriStock = '/assets/images/Jaisalmer/iStock-1201530843 (1).jpg';
const jaisalmerShutterstock2 = '/assets/images/Jaisalmer/shutterstock_645264559.jpg';

interface Page3Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

const gridImages = [
  jaisalmerBhrama,
  jaisalmeriStock,
  jaisalmerBeige08,
  jaisalmerShutterstock1,
];

const textBlocks = [
  `A UNESCO World Heritage site, the mystical desert town of Jaisalmer & its Fort lies in the heart of the Thar Desert in Rajasthan, India.`,
  `The city’s honey-colored sandstone architecture reflects sunlight beautifully, earning it the name “The Golden City”.`,
  `Jaisalmer Fort is one of the world’s few living forts, with bustling bazaars, homes, folk music, and tribal culture thriving within its walls.`,
  `Jaisalmer offers a timeless journey—where golden landscapes, intricate artistry, and enduring traditions transport visitors to another era.`,
];

const TEXT_DURATION = 4500;
const GRID_BOX_DELAY = 600;
const GRID_DURATION = 4000;
const ZOOM_DURATION = 4000;

export const Page3: React.FC<Page3Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeText, setActiveText] = useState(0);
  const hasCompletedRef = useRef(false);

  // Consolidate images into a single slideshow array
  const slideshowImages = [
    sunriseConcert,
    jaisalmerBhrama,
    jaisalmeriStock,
    jaisalmerBeige08,
    jaisalmerShutterstock1,
    jaisalmerShutterstock2
  ];

  /* 
    Timing Calculation:
    6 Images.
    4 Text Blocks.
    
    If we want text to last ~4.5s (TEXT_DURATION), total time is ~18s.
    6 images over 18s = 3s per image.
  */
  const SLIDE_DURATION = 3000;
  const TEXT_DURATION = 4500;

  useEffect(() => {
    if (!isActive) {
      setCurrentImageIndex(0);
      setActiveText(0);
      hasCompletedRef.current = false;
      return;
    }
  }, [isActive]);

  // Image Slideshow Timer
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = prev + 1;
        if (next >= slideshowImages.length) {
          // Slideshow complete
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            // Delay slightly before calling complete to let last image show?
            // Actually, if we hit length, we are done. 
            // Page8 logic waits one cycle on last slide? 
            // No, Page8 logic: if (next >= length) invoke complete.
            if (onSlideshowComplete) setTimeout(onSlideshowComplete, 500);
          }
          return prev;
        }
        return next;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [isActive, isPaused, onSlideshowComplete, slideshowImages.length]);

  // Text Timer
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setActiveText((prev) => {
        if (prev < textBlocks.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, TEXT_DURATION);

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden">

        {/* Slideshow Background */}
        {slideshowImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
          >
            <img
              src={image}
              className="w-full h-full object-cover"
              alt={`Jaisalmer Slide ${index}`}
            />
            {/* Dark Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </div>
        ))}

        {/* Text Overlay */}
        <div className="relative z-10 h-full flex items-start justify-center px-8 pt-32">
          <div
            className="max-w-4xl text-center"
          >
            {textBlocks.map((text, index) => (
              <div
                key={index}
                className={`absolute top-32 left-0 right-0 m-auto max-w-4xl text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-white transition-all duration-1000 ${index === activeText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
              >
                {text}
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};
