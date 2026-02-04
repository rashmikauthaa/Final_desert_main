import React, { useEffect, useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";

// Artist Images
const naisiri = "/assets/images/artisits/World/nasiri.JPG";
const apiChimba = "/assets/images/artisits/World/api_chimba.JPG";
const konyaWhirling = "/assets/images/artisits/World/konya_whirling.JPG";
const duduk = "/assets/images/artisits/World/duduk.JPG";
const ismet = "/assets/images/artisits/World/ismet.jpeg";
const bahramji = "/assets/images/artisits/World/bahramji.jpg";

interface Page13Props {
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
        name: "Naisiri",
        image: naisiri,
        description:
            "Renowned Iranian multi-instrumentalist & producer blending oud, flute & clarinet with deep bass & rhythmic synths, weaving Sufi traditions into a modern electronic soundscape.",
    },
    {
        name: "Ismet Aydin",
        image: ismet,
        description:
            "Vocalist, composer and educator from Anatolia, Turkey. His folk and Sufi-inspired compositions are deeply emotional, moving audiences across the world.",
    },
    {
        name: "Konya Whirling Dervishes",
        image: konyaWhirling,
        description:
            "Sacred Sufi dance performers presenting the Sema ceremony — a ritual of spiritual ecstasy and divine connection through sacred whirling.",
    },
    {
        name: "Duduk Ensemble",
        image: duduk,
        description:
            "Masters of the Armenian duduk, a double-reed woodwind carved from apricot wood, known for its haunting timbre and soul-penetrating emotional depth.",
    },
    {
        name: "Bahram-Ji",
        image: bahramji,
        description:
            "Kurdish new-age musician from Iran whose work fuses Rumi’s poetry, Persian instruments like the santoor, and meditative rhythms into hypnotic soundscapes.",
    },
];

const ANIMATION_DELAY_PER_ITEM = 300; // 300ms delay between each item
const PAGE_DISPLAY_DURATION = 8000; // 8 seconds total display time

export const Page13: React.FC<Page13Props> = ({
    isActive,
    onSlideshowComplete,
    isPaused,
}) => {
    const [showHeader, setShowHeader] = useState(false);
    const [visibleItems, setVisibleItems] = useState<number[]>([]);

    useEffect(() => {
        if (isActive) {
            setShowHeader(false);
            setVisibleItems([]);

            // Show header first
            const headerTimer = setTimeout(() => setShowHeader(true), 300);

            // Then animate each artist card one by one from right to left
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

    // Auto move to next page
    useEffect(() => {
        if (!isActive || isPaused) return;

        const timer = setTimeout(() => {
            onSlideshowComplete?.();
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
                            ARTISTS IN CONVERSATION – WORLD
                        </h1>
                        <div className="mt-4 h-px w-full bg-white/30" />
                    </div>

                    {/* -------- Artists Row -------- */}
                    <div className="max-w-[1400px] mx-auto">
                        <div className="grid grid-cols-5 gap-x-12">

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
                                    {artist.image ? (
                                        <img
                                            src={artist.image}
                                            alt={artist.name}
                                            className="w-24 h-24 rounded-none object-cover mb-5"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-none bg-white/10 flex items-center justify-center mb-5">
                                            <span className="text-xs text-white/60">
                                                Coming Soon
                                            </span>
                                        </div>
                                    )}

                                    {/* Name */}
                                    <h3 className="text-[15px] font-bold tracking-wide text-white uppercase mb-2">
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
