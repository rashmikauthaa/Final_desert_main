import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page18Props {
    isActive: boolean;
    isPaused?: boolean;
    onSlideshowComplete?: () => void;
}

export const Page18: React.FC<Page18Props> = ({ isActive, isPaused, onSlideshowComplete }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 800);

            // Auto-advance after content is shown
            const advanceTimer = setTimeout(() => {
                if (onSlideshowComplete && !isPaused) {
                    onSlideshowComplete();
                }
            }, 15000); // 15 seconds on this page

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
            {/* Background */}
            <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#60584d]">
                {/* Subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6a625a] via-[#60584d] to-[#545049]" />

                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 md:py-16">
                    
                    {/* Header */}
                    <div
                        className={`max-w-5xl transition-all duration-[3000ms] ease-in ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
                        }`}
                    >
                        {/* Headline */}
                        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-[hsl(40,30%,92%)] tracking-[0.2em] uppercase mb-10">
                            Why Partner With The Festival?
                        </h1>

                        {/* Paragraph 1 */}
                        <p className="font-display text-base md:text-lg lg:text-xl text-[hsl(40,25%,88%)] tracking-[0.08em] leading-relaxed mb-8 normal-case">
                            Partnering with us puts you at the center of one of the most exclusive cultural events in India, the country the entire world has fully woken up to. There is no way around India anymore, in innumerable ways, and with that, you become more than a 'partner', but rather a part of the story.
                        </p>

                        {/* Paragraph 2 */}
                        <p className="font-display text-base md:text-lg lg:text-xl text-[hsl(40,25%,88%)] tracking-[0.08em] leading-relaxed mb-8 normal-case">
                            The creative vision & superior implementation of the event will ensure long term awareness, prestige and opening up direct intimate channels to audience which would be very hard to curate or duplicate in any 'normal marketing strategy'.
                        </p>

                        {/* Paragraph 3 */}
                        <p className="font-display text-base md:text-lg lg:text-xl text-[hsl(40,25%,88%)] tracking-[0.08em] leading-relaxed normal-case">
                            High end cinematic video, photography and media placement covering the event will guarantee exposure in tightly handpicked outlets, fully aligned with the Innovators & Pioneers which are our audience.
                        </p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
