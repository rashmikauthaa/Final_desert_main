import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page17Props {
    isActive: boolean;
    isPaused?: boolean;
}

const BACKGROUND_IMAGE = '/assets/images/Suryagarh/8...jpg';

export const Page17: React.FC<Page17Props> = ({ isActive, isPaused }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isActive) {
            // Small delay for fade in
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isActive]);

    return (
        <PageWrapper isActive={isActive} overlayOpacity={0}>
            <div className="fixed inset-0 w-screen h-screen overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={BACKGROUND_IMAGE}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    {/* Dark overlay for text readability - slightly darker as requested */}
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full h-full">
                    {/* Credits - Bottom Right */}
                    <div className={`absolute bottom-12 right-8 md:bottom-16 md:right-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                        <a
                            href="https://www.linkedin.com/in/unsparsh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <p className="font-display text-xs md:text-sm text-white/50 tracking-[0.2em] mb-2 text-right group-hover:text-white/70 transition-colors">
                                MADE BY
                            </p>
                            <p className="font-display text-base md:text-lg text-white/90 tracking-[0.1em] font-light group-hover:text-primary transition-colors">
                                unsparsh
                            </p>
                        </a>
                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};
