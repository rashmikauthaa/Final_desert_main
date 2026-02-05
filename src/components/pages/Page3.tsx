import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

// Images
const sunriseConcert = '/assets/images/Jaisalmer/1-CROP +IF POSS. TEXT \'SUNRISE CONCERT STAGE\' .png';
const jaisalmerBhrama = '/assets/images/Jaisalmer/Bhrama_3187.webp';
const jaisalmerShutterstock1 = '/assets/images/Jaisalmer/shutterstock_1832570845.jpg';
// const jaisalmerBeige08 = '/assets/images/Jaisalmer/Beige08.webp';
const jaisalmeriStock = '/assets/images/Jaisalmer/iStock-1201530843 (1).jpg';
const jaisalmerShutterstock2 = '/assets/images/Jaisalmer/shutterstock_645264559.jpg';
const jaisalmer2 = '/assets/images/Jaisalmer/2.jpg';
const jaisalmer3 = '/assets/images/Jaisalmer/3.jpg';
const jaisalmer4 = '/assets/images/Jaisalmer/4.jpg';
const jaisalmer5 = '/assets/images/Jaisalmer/5.jpg';
const jaisalmer55 = '/assets/images/Jaisalmer/55.jpg';

interface Page3Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}


const textBlocks = [
  `A UNESCO World Heritage site, the mystical desert town of Jaisalmer & its Fort lies in the heart of the Thar Desert in Rajasthan, India.`,
  `The city’s honey-colored sandstone architecture reflects sunlight beautifully, earning it the name “The Golden City”.`,
  `A rare living fort, where people still reside within its massive walls, creating a bustling medieval atmosphere, an ever-present rich tribal presence, to folk music on every street corner adding to the city's enigmatic charm, Jaisalmer pulsates with Rajasthani culture.`,
  `Jaisalmer's magic is its ability to transport visitors back in time, to a bygone era, offering a sensory experience of golden landscapes, intricate artistry, and enduring traditions.`,
];


export const Page3: React.FC<Page3Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeText, setActiveText] = useState(0);
  const [textAnimationsComplete, setTextAnimationsComplete] = useState(false);
  const hasCompletedRef = useRef(false);

  // Consolidate images into a single slideshow array
  const slideshowImages = [
    jaisalmerShutterstock2,
    jaisalmer2,
    jaisalmer3,
    jaisalmer5,
    jaisalmer55,
    jaisalmeriStock,
    jaisalmerShutterstock1,
    jaisalmerBhrama
  ];

  const SLIDE_DURATION = 2500; // 2.5s per slide for faster sliding
  const TEXT_DURATION = 4000; // 1s slow appear + 3s hold time

  useEffect(() => {
    if (!isActive) {
      setCurrentImageIndex(0);
      setActiveText(0);
      setTextAnimationsComplete(false);
      hasCompletedRef.current = false;
      return;
    }
  }, [isActive]);

  // Text Timer - runs first
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setActiveText((prev) => {
        if (prev < textBlocks.length - 1) {
          return prev + 1;
        } else {
          // All text blocks shown, mark as complete
          setTextAnimationsComplete(true);
        }
        return prev;
      });
    }, TEXT_DURATION);

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  // Image Slideshow Timer - only starts after text animations are complete
  useEffect(() => {
    if (!isActive || isPaused || !textAnimationsComplete) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = prev + 1;
        if (next >= slideshowImages.length) {
          // Slideshow complete
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            if (onSlideshowComplete) setTimeout(onSlideshowComplete, 500);
          }
          return prev;
        }
        return next;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [isActive, isPaused, textAnimationsComplete, onSlideshowComplete, slideshowImages.length]);

  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden">

        {/* Static Background during Text Animations */}
        <div
          className={`absolute inset-0 transition-opacity duration-[4000ms] ease-in-out ${textAnimationsComplete ? 'opacity-0' : 'opacity-100'
            }`}
        >
          <img
            src={sunriseConcert}
            className="w-full h-full object-cover"
            alt="Sunrise Concert Stage"
          />
          {/* Dark Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </div>

        {/* Slideshow Background - starts after text animations */}
        {textAnimationsComplete && slideshowImages.map((image, index) => {
          // Don't crop these specific images
          const noCropImages = ['5.jpg', 'shutterstock_1832570845.jpg', 'Bhrama_3187.webp'];
          const shouldNotCrop = noCropImages.some(name => image.includes(name));

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-[4000ms] ease-in-out ${index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
            >
              <img
                src={image}
                className={`w-full h-full ${shouldNotCrop ? 'object-contain bg-black' : 'object-cover'}`}
                alt={`Jaisalmer Slide ${index}`}
              />
              {/* Dark Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
            </div>
          );
        })}

        {/* Text Overlay - fades out when slideshow starts */}
        <div className={`relative z-10 h-full flex items-start justify-center px-8 pt-[2rem] transition-opacity duration-[4000ms] ${textAnimationsComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
          <div
            className="max-w-4xl text-center"
          >
            {textBlocks.map((text, index) => (
              <div
                key={index}
                className={`absolute top-[2rem] left-0 right-0 m-auto max-w-4xl px-8 text-lg md:text-xl lg:text-2xl font-thin leading-relaxed text-white transition-all duration-[3000ms] ease-out ${index === activeText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
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
