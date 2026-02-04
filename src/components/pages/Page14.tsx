import React, { useEffect, useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";

// Artist Images
const nicolas = "/assets/images/artisits/Electronic/nicolas.JPG";
const nils = "/assets/images/artisits/Electronic/nils.jpg";
const svendsen = "/assets/images/artisits/Electronic/svedan.jpg";
const paul = "/assets/images/artisits/Electronic/acid_pauli.jpg";

interface Page14Props {
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
        name: "Nicolas Jaar",
        image: nicolas,
        description:
            "Chilean-American composer and electronic producer celebrated for redefining downtempo, minimal techno and ambient music with deeply emotive, avant-garde soundscapes.",
    },
    {
        name: "Nils Frahm",
        image: nils,
        description:
            "German composer and producer known for merging classical piano with electronic textures, creating intimate and emotionally resonant performances.",
    },
    {
        name: "Be Svendsen",
        image: svendsen,
        description:
            "Danish producer crafting organic, genre-blending electronic music with cinematic depth and playful experimentation.",
    },
    {
        name: "Acid Pauli",
        image: paul,
        description: "Berlin based German electronic musician, one of the most prominent and pioneering figure worldwide. He known for a genre-bending fusion of psychedelic techno, house, and eclectic samples, taking the listener on a deepest emotional sensory journey.",
    },
];

const ANIMATION_DELAY_PER_ITEM = 300; // 300ms delay between each item
const PAGE_DISPLAY_DURATION = 8000; // 8 seconds total display time

export const Page14: React.FC<Page14Props> = ({
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

    // Auto slide after 5s
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
                        className="mb-12 transition-all duration-1000 ease-out"
                        style={{
                            opacity: showHeader ? 1 : 0,
                            transform: showHeader ? "translateY(0)" : "translateY(12px)",
                        }}
                    >
                        <h1 className="text-sm tracking-[0.35em] font-medium text-white uppercase">
                            ARTISTS IN CONVERSATION – ELECTRONIC
                        </h1>
                        <div className="mt-4 h-px w-full bg-white/30" />
                    </div>

                    {/* -------- Artists Grid -------- */}
                    <div className="max-w-[1400px] mx-auto">
                        <div className="grid grid-cols-4 gap-x-14">

                            {artists.map((artist, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col px-3 transition-all duration-700"
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
                                            className="w-28 h-28 rounded-full object-cover mb-5"
                                        />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center mb-5">
                                            <span className="text-xs text-white/60">
                                                Coming Soon
                                            </span>
                                        </div>
                                    )}

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
