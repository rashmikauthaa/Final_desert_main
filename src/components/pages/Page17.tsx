import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page17Props {
    isActive: boolean;
    isPaused?: boolean;
}

const BACKGROUND_IMAGE = '/assets/images/Suryagarh/790978138.jpg';

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

                    {/* Booking Contact - Top Left */}
                    <div className={`absolute top-12 left-8 md:top-16 md:left-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                        <div className="text-left max-w-md">
                            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-white mb-8 tracking-[0.15em] drop-shadow-lg">
                                BOOKING CONTACT
                            </h2>

                            <div className="space-y-4">
                                <p className="font-display text-xl md:text-2xl text-white font-light drop-shadow-md">
                                    NADJA REICHE
                                </p>
                                <p className="font-display text-sm md:text-base text-white/80 tracking-[0.15em] drop-shadow-md">
                                    BOOKINGS
                                </p>
                                <p className="font-display text-lg md:text-xl text-primary font-light drop-shadow-md">
                                    CARAVANA
                                </p>

                                <div className="pt-6 space-y-2">
                                    <a
                                        href="mailto:nadja@caravana.world"
                                        className="block font-display text-base md:text-lg text-white hover:text-primary transition-colors drop-shadow-md"
                                    >
                                        NADJA@CARAVANA.WORLD
                                    </a>
                                    <a
                                        href="tel:+4915144694744"
                                        className="block font-display text-base md:text-lg text-white/80 hover:text-primary transition-colors drop-shadow-md"
                                    >
                                        +49 151 4469 4744
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credits - Bottom Right */}
                    <div className={`absolute bottom-12 right-8 md:bottom-16 md:right-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                        <a
                            href="https://www.linkedin.com/in/rashmika-autha"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <p className="font-display text-xs md:text-sm text-white/50 tracking-[0.2em] mb-2 text-right group-hover:text-white/70 transition-colors">
                                MADE BY
                            </p>
                            <p className="font-display text-base md:text-lg text-white/90 tracking-[0.1em] font-light group-hover:text-primary transition-colors">
                                AUTHA RASHMIKA
                            </p>
                        </a>
                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};
