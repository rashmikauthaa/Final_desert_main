import React, { useEffect, useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";

// Images
const sri = "/assets/images/artisits/speakers/RAVI_SHANKAR.jpg";
const sadhguru = "/assets/images/artisits/speakers/sadhguru.JPG";
const deepak = "/assets/images/artisits/speakers/deepak_chopra.JPG";
const satish = "/assets/images/artisits/speakers/satish.JPG";
const salman = "/assets/images/artisits/speakers/salman_rushdie.JPG";
const ar = "/assets/images/artisits/speakers/ar_raman.JPG";

interface Page15Props {
    isActive: boolean;
    onSlideshowComplete?: () => void;
    isPaused?: boolean;
}

interface Artist {
    name: string;
    image?: string;
    description: string;
}

const artists: Artist[] = [
    {
        name: "Sir Ahmed Salman Rushdie",
        image: salman,
        description:
            "Critically acclaimed British Indian Booker prize-winning author blending magical realism with historical fiction. Champion of free speech, knighted in 2007.",
    },
    {
        name: "Satish Kumar",
        image: satish,
        description:
            "British Indian peace activist, author, nuclear disarmament advocate and former Jain monk. Global voice for ecology, simplicity and compassion.",
    },
    {
        name: "Sadhguru Jaggi Vasudev",
        image: sadhguru,
        description:
            "Indian mystic and yogi. Global voice on spirituality, empowerment and environmental action. Keynote speaker at the UN and World Economic Forum.",
    },
    {
        name: "Deepak Chopra",
        image: deepak,
        description:
            "Indian-American author of 90+ books translated into 43 languages. Pioneer in mind-body medicine bridging science and spirituality.",
    },
    {
        name: "A.R. Rahman",
        image: ar,
        description:
            "Two-time Academy Award and Grammy winner. One of the most influential composers of our time with genre-defying global work.",
    },
    {
        name: "Sri Sri Ravi Shankar",
        image: sri,
        description: "An Indian spiritual leader,peace ambassador & globally leading humanitarian.Founder of the Art of living Foundation,operates in over 180 countries.",
    },
];

const ANIMATION_DELAY_PER_ITEM = 300;
const PAGE_DISPLAY_DURATION = 8000;

export const Page15: React.FC<Page15Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
    const [showHeader, setShowHeader] = useState(false);
    const [visibleItems, setVisibleItems] = useState<number[]>([]);

    useEffect(() => {
        if (isActive) {
            setShowHeader(false);
            setVisibleItems([]);

            // Show header first
            const headerTimer = setTimeout(() => setShowHeader(true), 300);

            // Then animate each artist card one by one
            const itemTimers: NodeJS.Timeout[] = [];
            artists.forEach((_, index) => {
                const timer = setTimeout(() => {
                    setVisibleItems(prev => [...prev, index]);
                }, 600 + (index * ANIMATION_DELAY_PER_ITEM));
                itemTimers.push(timer);
            });

            return () => {
                clearTimeout(headerTimer);
                itemTimers.forEach(timer => clearTimeout(timer));
            };
        } else {
            setShowHeader(false);
            setVisibleItems([]);
        }
    }, [isActive]);

    // Auto-advance timer
    useEffect(() => {
        if (!isActive || isPaused) return;

        const timer = setTimeout(() => {
            if (onSlideshowComplete) {
                onSlideshowComplete();
            }
        }, PAGE_DISPLAY_DURATION);

        return () => clearTimeout(timer);
    }, [isActive, isPaused, onSlideshowComplete]);

    return (
        <PageWrapper isActive={isActive} overlayOpacity={0}>
            <section className="fixed inset-0 w-screen h-screen bg-gold overflow-hidden">
                <div className="h-full w-full px-16 pt-16">

                    {/* -------- Header -------- */}
                    <div
                        className="mb-12 transition-all duration-[4000ms] ease-out"
                        style={{
                            opacity: showHeader ? 1 : 0,
                            transform: showHeader ? "translateY(0)" : "translateY(12px)",
                        }}
                    >
                        <h1 className="text-sm tracking-[0.35em] font-medium text-white uppercase">
                            SPEAKERS IN CONVERSATION
                        </h1>
                        <div className="mt-4 h-px w-full bg-white/30" />
                    </div>

                    {/* -------- Speakers Grid -------- */}
                    <div className="max-w-[1400px] mx-auto">
                        <div className="grid grid-cols-6 gap-x-12">

                            {artists.map((artist, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col px-3 transition-all duration-[4000ms]"
                                    style={{
                                        opacity: visibleItems.includes(index) ? 1 : 0,
                                        transform: visibleItems.includes(index)
                                            ? "translateX(0)"
                                            : "translateX(100px)",
                                        transitionTimingFunction: "ease-in",
                                    }}
                                >

                                    {/* Image */}
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-24 h-24 rounded-full object-cover mb-5"
                                    />

                                    {/* Name */}
                                    <h3 className="text-[12px] font-medium tracking-wide text-white uppercase mb-2">
                                        {artist.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[11.5px] leading-relaxed text-white/70 text-left">
                                        {artist.description}
                                    </p>

                                </div>
                            ))}

                        </div>
                    </div>

                </div>
            </section>
        </PageWrapper>
    );
};
