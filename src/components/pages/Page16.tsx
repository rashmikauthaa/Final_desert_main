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
    '/assets/images/slideshow/5...jpg',
    '/assets/images/slideshow/6.JPG',
];

const slideTitles = [
    "The Golden Era of Travel goes Jaisalmer",
    "Temple Morning Concert",
    "Temple Breakfast Experience",
    "On the road with our guests",
    "Ancient Ruins Sunrise Concert",
    "Royal Stepwell Grand Finale"
];

const SLIDE_DURATION = 4000; // 4 seconds per slide

export const Page16: React.FC<Page16Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [showSlide, setShowSlide] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!isActive) {
            setCurrentSlideIndex(0);
            setShowSlide(false);
            setIsComplete(false);
            return;
        }

        setShowSlide(true);
    }, [isActive]);

    useEffect(() => {
        if (!isActive || isPaused || isComplete) return;

        const timer = setTimeout(() => {
            if (currentSlideIndex < slideImages.length - 1) {
                // Fade out current
                setShowSlide(false);
                setTimeout(() => {
                    setCurrentSlideIndex(prev => prev + 1);
                    setShowSlide(true);
                }, 500); // 500ms fade transition
            } else {
                // Done
                setIsComplete(true);
                if (onSlideshowComplete) {
                    onSlideshowComplete();
                }
            }
        }, SLIDE_DURATION);

        return () => clearTimeout(timer);
    }, [isActive, isPaused, currentSlideIndex, isComplete, onSlideshowComplete]);

    return (
        <PageWrapper isActive={isActive} overlayOpacity={0}>
            <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
                {slideImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlideIndex && showSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{ zIndex: 1 }}
                    >
                        <img
                            src={img}
                            alt={slideTitles[index]}
                            className="w-full h-full object-cover"
                        />
                        {/* Text Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <div className="text-center px-4 max-w-4xl">
                                <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] tracking-wide">
                                    {slideTitles[index]}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PageWrapper>
    );
};
