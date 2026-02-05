import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page16Props {
    isActive: boolean;
    onSlideshowComplete?: () => void;
    isPaused?: boolean;
}

const slideImages = [
    '/assets/images/slideshow/1.JPG',
    '/assets/images/slideshow/2.JPG',
    '/assets/images/slideshow/3.JPG',
    '/assets/images/slideshow/4.JPG',
    '/assets/images/slideshow/5.JPG',
    '/assets/images/slideshow/6.JPG',
];

const slideTitles = [
    'The Golden Era of Travel goes Jaisalmer',
    'Temple Morning Concert',
    'Temple Breakfast Experience',
    'On the road with our guests',
    'Ancient Ruins Sunrise Concert',
    'Royal Stepwell Grand Finale',
];

const SLIDE_DURATION = 3000; // 4s per slide for smooth crossfade

export const Page16: React.FC<Page16Props> = ({
    isActive,
    onSlideshowComplete,
    isPaused,
}) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [showSlide, setShowSlide] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Reset when page becomes inactive
    useEffect(() => {
        if (!isActive) {
            setCurrentSlideIndex(0);
            setShowSlide(false);
            setIsComplete(false);
            return;
        }
        setShowSlide(true);
    }, [isActive]);

    // Slideshow timing
    useEffect(() => {
        if (!isActive || isPaused || isComplete) return;

        const timer = setInterval(() => {
            setCurrentSlideIndex((prev) => {
                if (prev < slideImages.length - 1) {
                    return prev + 1;
                } else {
                    setIsComplete(true);
                    onSlideshowComplete?.();
                    return prev;
                }
            });
        }, SLIDE_DURATION);

        return () => clearInterval(timer);
    }, [isActive, isPaused, isComplete, onSlideshowComplete]);

    return (
        <PageWrapper isActive={isActive} overlayOpacity={0}>
            <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">

                {slideImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-[4000ms] ease-in-out ${index === currentSlideIndex
                                ? 'opacity-100'
                                : 'opacity-0'
                            }`}
                    >
                        {/* Background Image */}
                        <img
                            src={img}
                            alt={slideTitles[index]}
                            className="w-full h-full object-cover"
                        />

                        {/* Full-page black film */}
                        <div className="absolute inset-0 bg-black/35 z-[2]" />

                        {/* Title Overlay */}
                        <div className="absolute inset-x-0 top-[15%] md:top-[20%] flex justify-center z-[3] pointer-events-none">
                            <div className="px-8 py-4 md:px-12 md:py-5 flex flex-col items-center">

                                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-2 opacity-60" />

                                <h2 className="font-display text-lg md:text-xl lg:text-2xl font-light text-white tracking-[0.2em] uppercase text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] whitespace-nowrap">
                                    {slideTitles[index]}
                                </h2>

                                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent mt-2 opacity-70" />

                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </PageWrapper>
    );
};
