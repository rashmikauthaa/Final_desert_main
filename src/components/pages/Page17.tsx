import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page17Props {
    isActive: boolean;
    isPaused?: boolean;
    onSlideshowComplete?: () => void;
}

const pillars = [
    {
        title: "Access",
        description: "To a UHNW conscious community that actively invests in brands aligning with their values. There is opportunity to engage with them in moments that trigger conversation and deep connection."
    },
    {
        title: "Visibility",
        description: "Our crowd are global citizens, connecting with others as they travel across the world. This is an opportunity to travel with them on their own inspiring and exploratory journeys."
    },
    {
        title: "Engaging",
        description: "with our exclusive community in the intimate setting of our physical events and connecting with our broader audience through social media channels and our podcast."
    }
];

export const Page17: React.FC<Page17Props> = ({ isActive, isPaused, onSlideshowComplete }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showPillars, setShowPillars] = useState(false);

    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 800);

            const pillarsTimer = setTimeout(() => {
                setShowPillars(true);
            }, 2000);
            
            // Auto-advance to next page after content is shown
            const advanceTimer = setTimeout(() => {
                if (onSlideshowComplete && !isPaused) {
                    onSlideshowComplete();
                }
            }, 15000); // 15 seconds on this page
            
            return () => {
                clearTimeout(timer);
                clearTimeout(pillarsTimer);
                clearTimeout(advanceTimer);
            };
        } else {
            setIsVisible(false);
            setShowPillars(false);
        }
    }, [isActive, isPaused, onSlideshowComplete]);

    return (
        <PageWrapper isActive={isActive} overlayOpacity={0}>
            {/* Darker warm background */}
            <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[hsl(35,25%,55%)]">
                {/* Subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(38,28%,60%)] via-[hsl(35,25%,55%)] to-[hsl(32,22%,48%)]" />

                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex flex-col px-8 md:px-16 lg:px-24 py-12 md:py-16">
                    
                    {/* Header Section */}
                    <div
                        className={`max-w-4xl mb-10 md:mb-14 transition-all duration-[3000ms] ease-in ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
                        }`}
                    >
                        {/* Headline */}
                        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-[hsl(40,30%,92%)] tracking-[0.2em] uppercase mb-8">
                            Why Partner With The Festival?
                        </h1>

                        {/* Main tagline */}
                        <p className="font-display text-base md:text-lg lg:text-xl text-[hsl(40,25%,88%)] tracking-[0.1em] leading-relaxed mb-4 normal-case">
                            We're here to blur the line between reality and magic - through experiences you feel in your bones and a community that lasts.
                        </p>
                        
                        {/* Sub tagline */}
                        <p className="font-display text-sm md:text-base lg:text-lg text-[hsl(40,20%,80%)] tracking-[0.1em] leading-relaxed normal-case">
                            Partnering with us means stepping into that journey, unlocking opportunities for your organisation to:
                        </p>
                    </div>

                    {/* Three Pillars */}
                    <div className="flex-1 flex items-start">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 w-full max-w-6xl">
                            {pillars.map((pillar, index) => (
                                <div
                                    key={index}
                                    className={`border-t border-[hsl(40,25%,70%)] pt-6 transition-all duration-[2500ms] ease-in ${
                                        showPillars 
                                            ? 'opacity-100 translate-y-0' 
                                            : 'opacity-0 translate-y-6'
                                    }`}
                                    style={{
                                        transitionDelay: `${index * 400}ms`
                                    }}
                                >
                                    {/* Pillar Title */}
                                    <h2 className="font-display text-xl md:text-2xl lg:text-3xl text-[hsl(40,30%,92%)] tracking-[0.15em] uppercase mb-4">
                                        {pillar.title}
                                    </h2>
                                    
                                    {/* Pillar Description */}
                                    <p className="font-display text-sm md:text-base text-[hsl(40,20%,80%)] tracking-[0.08em] leading-relaxed normal-case">
                                        {pillar.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
