import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page17Props {
    isActive: boolean;
    isPaused?: boolean;
    onSlideshowComplete?: () => void;
}

export const Page17: React.FC<Page17Props> = ({ isActive, isPaused, onSlideshowComplete }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 800);
            
            // Auto-advance to next page after content is shown
            const advanceTimer = setTimeout(() => {
                if (onSlideshowComplete && !isPaused) {
                    onSlideshowComplete();
                }
            }, 12000); // 12 seconds on this page
            
            return () => {
                clearTimeout(timer);
                clearTimeout(advanceTimer);
            };
        } else {
            setIsVisible(false);
        }
    }, [isActive, isPaused, onSlideshowComplete]);

    return (
        <PageWrapper isActive={isActive} overlayOpacity={0}>
            {/* Darker sandy background for better visibility */}
            <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[hsl(35,25%,55%)]">
                {/* Subtle gradient overlay - darker tones */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(38,28%,60%)] via-[hsl(35,25%,55%)] to-[hsl(32,22%,48%)]" />
                
                {/* Decorative subtle pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[hsl(35,45%,40%)] blur-3xl" />
                    <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-[hsl(25,35%,35%)] blur-3xl" />
                </div>

                {/* Content Container - No scroll, fits on page */}
                <div className="relative z-10 w-full h-full flex flex-col px-8 md:px-16 lg:px-24 py-12 md:py-16">
                    {/* Title - Top Left */}
                    <div
                        className={`transition-all duration-[3000ms] ease-in ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
                        }`}
                    >
                        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-[hsl(40,30%,95%)] tracking-[0.2em] uppercase mb-8 md:mb-12">
                            Why Partner With The Festival ?
                        </h1>
                    </div>

                    {/* Content - Bigger font, fits on screen */}
                    <div
                        className={`max-w-5xl flex-1 flex flex-col justify-center transition-all duration-[3500ms] ease-in delay-500 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    >
                        {/* First Paragraph */}
                        <p className="font-display text-base md:text-lg lg:text-xl text-[hsl(40,25%,92%)] tracking-[0.12em] leading-relaxed mb-6 md:mb-8 normal-case">
                            Partnering with us puts you at the center of one of the most exclusive cultural events in India, the country the entire world has fully woken up to. There is no way around India anymore, in innumerable ways, and with that, you become more than a 'partner', but rather a part of the story.
                        </p>

                        {/* Second Paragraph */}
                        <p className="font-display text-base md:text-lg lg:text-xl text-[hsl(40,25%,92%)] tracking-[0.12em] leading-relaxed mb-6 md:mb-8 normal-case">
                            The creative vision & superior implementation of the event will ensure long term awareness, prestige and opening up direct intimate channels to audience which would be very hard to curate or duplicate in any 'normal marketing strategy'.
                        </p>

                        {/* Third Paragraph */}
                        <p className="font-display text-base md:text-lg lg:text-xl text-[hsl(40,25%,92%)] tracking-[0.12em] leading-relaxed normal-case">
                            High end cinematic video, photography and media placement covering the event will guarantee exposure in tightly handpicked outlets, fully aligned with the Innovators & Pioneers which are our audience.
                        </p>
                    </div>

                    {/* Decorative line */}
                    <div
                        className={`pt-8 transition-all duration-[4000ms] ease-in delay-1000 ${
                            isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div className="w-32 h-[1px] bg-gradient-to-r from-[hsl(40,40%,75%)] via-[hsl(38,35%,65%)] to-transparent" />
                    </div>

                    {/* Credits - Bottom Right */}
                    <div
                        className={`absolute bottom-6 right-6 md:bottom-8 md:right-8 transition-all duration-[3000ms] ease-in delay-1500 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                    >
                        <a
                            href="https://www.linkedin.com/in/unsparsh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2"
                        >
                            
                        </a>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
