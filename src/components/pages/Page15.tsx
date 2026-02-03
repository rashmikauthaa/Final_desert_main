import React, { useEffect } from "react";
import { PageWrapper } from "@/components/PageWrapper";

// Images
const sri = "/assets/images/artisits/speakers/sri.JPG";
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
        description: "Coming soon...",
    },
];

const PAGE_DISPLAY_DURATION = 8000; // 8 seconds before auto-advance

export const Page15: React.FC<Page15Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
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
            <div className="fixed inset-0 w-screen h-screen flex items-center justify-center px-14">
                <div className="max-w-7xl w-full">

                    {/* ===== Header Section (Like PDF) ===== */}
                    <div className="mb-12">
                        <h1 className="text-sm md:text-base uppercase tracking-[0.35em] text-white/80 font-light">
                            INDIA
                        </h1>

                        {/* Divider Line */}
                        <div className="w-full h-[1px] bg-white/20 mt-4" />
                    </div>

                    {/* ===== Speakers Grid ===== */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-14 gap-y-16">

                        {artists.map((artist, index) => (
                            <div key={index} className="flex flex-col items-start">

                                {/* Image */}
                                <img
                                    src={artist.image}
                                    alt={artist.name}
                                    className="w-20 h-20 object-cover rounded-md mb-4 shadow-md"
                                />

                                {/* Name */}
                                <h2 className="text-sm md:text-base font-semibold uppercase tracking-wide text-white mb-2">
                                    {artist.name}
                                </h2>

                                {/* Description */}
                                <p className="text-xs md:text-sm text-white/70 leading-snug text-left">
                                    {artist.description}
                                </p>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
