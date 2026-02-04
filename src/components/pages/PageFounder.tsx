import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface PageFounderProps {
    isActive: boolean;
    isPaused?: boolean;
    onSlideshowComplete?: () => void;
}

export const PageFounder: React.FC<PageFounderProps> = ({ isActive, isPaused, onSlideshowComplete }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 500);

            // Auto-advance after reading time (approx 18 seconds)
            const advanceTimer = setTimeout(() => {
                if (onSlideshowComplete && !isPaused) {
                    onSlideshowComplete();
                }
            }, 18000);

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
            {/* Background Image with Fade */}
            <div className="fixed inset-0 w-screen h-screen overflow-hidden">
                 <div 
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-[4000ms]"
                    style={{ 
                        backgroundImage: "url('/assets/images/Founder_Page/founder_bg.jpg')",
                        opacity: 0.4 // "Make it fade" - interpreting as a faded background image or overlay
                    }}
                />
                
                {/* Dark overlay for better text readability and "fade" consistency with other pages if needed */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex flex-row items-center p-6 md:p-10 lg:p-12 pb-24">
                    
                    {/* Left Center Content */}
                    <div className="flex-1 flex flex-col justify-center max-w-3xl pr-4">
                        {/* "The founder" - appears first */}
                        <span 
                            className={`font-display text-base md:text-lg text-[hsl(40,30%,92%)] tracking-[0.2em] uppercase mb-1 block transition-all duration-[4000ms] ease-out ${
                                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                            }`}
                        >
                            The founder
                        </span>
                        
                        {/* "Nadja Reiche" - appears second (delay 2s) */}
                        <h2 
                            className={`font-display text-3xl md:text-4xl lg:text-5xl text-white mb-1 transition-all duration-[4000ms] delay-[2000ms] ease-out ${
                                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                            }`}
                        >
                            Nadja Reiche
                        </h2>
                        
                        {/* "Founder" - appears third (delay 4s) */}
                        <span 
                            className={`font-display text-lg md:text-xl text-[hsl(40,25%,88%)] uppercase tracking-widest mb-4 block transition-all duration-[4000ms] delay-[4000ms] ease-out ${
                                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                            }`}
                        >
                            Founder
                        </span>

                        {/* Paragraph - appears last (delay 6s) */}
                        <div 
                            className={`font-display text-sm md:text-base text-[hsl(40,25%,88%)] leading-relaxed space-y-2 text-justify transition-all duration-[3500ms] delay-[6000ms] ease-out ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}
                        >
                            <p>
                                Nadia Reiche is an international talent curator with over 20 years of
                                experience working across all continents. Her passion for world and sacred
                                music has taken her deeply in finest detail and off the most unbeaten tracks
                                across all continents, sourcing emerging talent, exploring native music in its
                                rawest form paired with the most innovative sound technologies, curating
                                unforgettable cultural experiences.
                            </p>
                            <p>
                                In the last 10 years her dedication has
                                taken her in a more and more concentrated form to India, travelling the
                                countries' every corner to expand horizon and knowledge musically here,
                                with her main focus finally landing her into Rajasthan.
                            </p>
                            <p>
                                In the Middle East,
                                she has produced projects commissioned by Crown Prince Sheikh Hamdan
                                bin Mohammed Al Maktoum and in India she has holds very close relations
                                with HH Maharaja Gai Singh of Jodhpur of RIFF & Sacred World Music
                                Festival and recently presented her work to the Trustees of Mehrangarh Fort,
                                reflecting the deep trust she holds within global artistic circles.
                            </p>
                        </div>
                    </div>

                    {/* Right Bottom Image - smaller, positioned bottom right above buttons */}
                    <div className="absolute right-8 md:right-12 lg:right-16 bottom-20 md:bottom-24">
                        <div
                             className={`transition-all duration-[4000ms] delay-[1000ms] ease-out ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        >
                            <div className="w-52 md:w-64 lg:w-80 h-52 md:h-64 lg:h-80 rounded-xl overflow-hidden border-4 border-[hsl(40,25%,88%)]/30 shadow-2xl">
                                <img 
                                    src="/assets/images/Founder_Page/nadja-removebg-preview.png" 
                                    alt="Nadja Reiche" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};
