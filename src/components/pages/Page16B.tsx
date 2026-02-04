import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page16BProps {
    isActive: boolean;
    isPaused?: boolean;
    onSlideshowComplete?: () => void;
}

const crowdBg = "/assets/images/crowd_bg.jpeg";

export const Page16B: React.FC<Page16BProps> = ({ isActive, isPaused, onSlideshowComplete }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        if (isActive) {
            setIsVisible(false);
            setShowList(false);

            const timer = setTimeout(() => setIsVisible(true), 500);
            const listTimer = setTimeout(() => setShowList(true), 1500);

            // Auto-advance after 15 seconds
            const advanceTimer = setTimeout(() => {
                if (onSlideshowComplete && !isPaused) {
                    onSlideshowComplete();
                }
            }, 15000);

            return () => {
                clearTimeout(timer);
                clearTimeout(listTimer);
                clearTimeout(advanceTimer);
            };
        } else {
            setIsVisible(false);
            setShowList(false);
        }
    }, [isActive, isPaused, onSlideshowComplete]);

    const crowdList = [
        "Boundary-breaking CEOs",
        "Tech visionaries",
        "Hollywood icons",
        "Sharp-eyed investors",
        "Grammy-winning artists",
        "Silicon Valley game-changers",
        "Under-the-radar entrepreneurs",
        "Trailblazing businesswomen"
    ];

    return (
        <PageWrapper isActive={isActive} overlayOpacity={0}>
            <div className="fixed inset-0 w-screen h-screen overflow-hidden">
                {/* Background Image with Fade */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                    style={{ backgroundImage: `url(${crowdBg})` }}
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/75" />

                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex px-10 md:px-16 lg:px-20 py-10 md:py-14">
                    
                    {/* Left Column - THE CROWD */}
                    <div className="flex-1 pr-8 flex flex-col justify-center">
                        {/* The Crowd Header */}
                        <h2 
                            className={`font-display text-lg md:text-xl text-white tracking-[0.2em] uppercase mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-[4000ms] ease-out ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                            }`}
                        >
                            THE CROWD
                        </h2>

                        {/* Crowd Description */}
                        <p 
                            className={`font-display text-sm md:text-base text-white/95 leading-relaxed mb-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-all duration-[4000ms] ease-out delay-200 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            Our crowd is made up of rebels with curiosity, makers who move the needle, dreamers who don't sleep and yes, a few ex-Burners — all chasing the same thing: something real, raw and unforgettable.
                        </p>

                        {/* "Our crowd brings together" label */}
                        <p 
                            className={`font-display text-xs md:text-sm text-white/70 tracking-wide uppercase mb-3 transition-all duration-[4000ms] ease-out delay-300 ${
                                isVisible ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            Our crowd brings together:
                        </p>

                        {/* List in 2 columns */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            {crowdList.map((item, index) => (
                                <p 
                                    key={index}
                                    className={`font-display text-xs md:text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-500 ${
                                        showList ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                    }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    • {item}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - WHO ARE THEY */}
                    <div className="flex-1 pl-8 flex flex-col justify-center border-l border-white/20">
                        {/* Heading */}
                        <h1 
                            className={`font-display text-2xl md:text-3xl lg:text-4xl text-white tracking-[0.25em] uppercase mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-[4000ms] ease-out ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                            }`}
                        >
                            WHO ARE THEY?
                        </h1>

                        {/* Paragraph 1 */}
                        <p 
                            className={`font-display text-sm md:text-base text-white leading-relaxed mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-all duration-[4000ms] ease-out delay-200 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            The single biggest global community of diversely cultural trend setters from around the world. 
                            International tastemakers, cultural nomads and change-makers aged 25–60.
                        </p>

                        {/* Paragraph 2 */}
                        <p 
                            className={`font-display text-sm md:text-base text-white leading-relaxed mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-all duration-[4000ms] ease-out delay-300 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            From wealthy to ultra-high-net-worth, they span 52+ nationalities — all gathering in one intimate space. 
                            They're visionary philanthropists: people with influence, resources and the will to make a mark on the world.
                        </p>

                        {/* Paragraph 3 */}
                        <p 
                            className={`font-display text-sm md:text-base text-white/95 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-all duration-[4000ms] ease-out delay-500 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            Our tight selection process keeps the circle intentionally exclusive, attracting those who value discretion and command influence on a global stage.
                        </p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
