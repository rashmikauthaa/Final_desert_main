import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

// Image paths
const vandana = '/assets/images/artisits/speakers/vandana.JPG';
const sadhguru = '/assets/images/artisits/speakers/sadhguru.JPG';
const deepak = '/assets/images/artisits/speakers/deepak_chopra.JPG';
const satish = '/assets/images/artisits/speakers/satish.JPG';

declare module '*.JPG' {
    const value: string;
    export default value;
}

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
        name: 'Sir Ahmed Salman Rushdie',
        // No image found
        description: 'British-Indian Author \n Sir Ahmed Salman Rushdie is a critically acclaimed, Booker Prize-winning British-Indian author known for blending magical realism with historical fiction. Multiple winner of literary awards globally, He is a renowned novelist, essayist, and champion of free speech, knighted in 2007 as well as a Fellow of the Royal Society of Literature and member of the American Academy of Arts and Letters',
    },
    {
        name: 'Vandana Shiva',
        image: vandana,
        description: 'Environmental Activist, Author, and Scholar \n Vandana Shiva is one of the world’s most respected voices for ecological sustainability and food sovereignty. Recipient of the Right Livelihood Award, she has shaped global policy and inspired movements to protect biodiversity, indigenous knowledge, and the future of our planet.',
    },
    {
        name: 'Sadhguru',
        image: sadhguru,
        description: 'Visionary Mystic, Yogi, and Founder of the Isha Foundation \n Sadhguru is a global voice on spirituality, human empowerment, and environmental action. A New York Times bestselling author and keynote speaker at the United Nations and World Economic Forum, he has touched the lives of millions across the world',
    },
    {
        name: 'Deepak Chopra',
        image: deepak,
        description: 'World-renowned pioneer in mind-body medicine, author of over 90 books translated into 43 languages, and founder of The Chopra Foundation \n Recognised globally for bridging science and spirituality, Dr. Chopra has transformed the conversation on wellbeing, consciousness, and human potential, inspiring millions through his teachings, research, and leadership',
    },
    {
        name: 'Satish Kumar',
        image: satish,
        description: 'Peace activist, Author, and former Jain monk \n Satish Kumar is the long-time editor of Resurgence & Ecologist and founder of Schumacher College. A world-renowned advocate for ecology and simplicity, he has inspired millions through his walking pilgrimages for peace and his vision of a life rooted in compassion and harmony.',
    },
];

const ARTIST_DISPLAY_DURATION = 4000; // 4 seconds per artist
const TITLE_DISPLAY_DURATION = 2000; // 2 seconds for title
const GALLERY_DISPLAY_DURATION = 4000; // 4 seconds for gallery view

export const Page15: React.FC<Page15Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
    const [showTitle, setShowTitle] = useState(false);
    const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
    const [showArtist, setShowArtist] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    const [step, setStep] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setShowTitle(false);
            setCurrentArtistIndex(0);
            setShowArtist(false);
            setShowGallery(false);
            setStep(0);
            return;
        }
    }, [isActive]);

    useEffect(() => {
        if (!isActive || isPaused) return;

        let timer: NodeJS.Timeout;

        if (step === 0) {
            timer = setTimeout(() => {
                setShowTitle(true);
                setStep(1);
            }, 500);
        } else if (step === 1) {
            timer = setTimeout(() => {
                setShowTitle(false);
                setShowArtist(true);
                setCurrentArtistIndex(0);
                setStep(2);
            }, TITLE_DISPLAY_DURATION);
        } else if (step >= 2 && step < 2 + artists.length) {
            // Artist steps
            timer = setTimeout(() => {
                const artistIndex = step - 2;
                const nextIndex = artistIndex + 1;
                if (nextIndex < artists.length) {
                    setCurrentArtistIndex(nextIndex);
                    setStep(step + 1);
                } else {
                    // Done with artists, show gallery
                    setShowArtist(false);
                    setShowGallery(true);
                    setStep(step + 1);
                }
            }, ARTIST_DISPLAY_DURATION);
        } else if (step === 2 + artists.length) {
            // Gallery View
            timer = setTimeout(() => {
                if (onSlideshowComplete) {
                    onSlideshowComplete();
                }
            }, GALLERY_DISPLAY_DURATION);
        }

        return () => clearTimeout(timer);
    }, [isActive, isPaused, step, onSlideshowComplete]);

    const currentArtist = artists[currentArtistIndex];

    return (
        <PageWrapper isActive={isActive} overlayOpacity={0}>
            <div className="fixed inset-0 w-screen h-screen overflow-hidden">
                {/* Title Section */}
                {showTitle && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="text-center transition-all duration-1500 ease-out"
                            style={{
                                opacity: showTitle ? 1 : 0,
                                transform: showTitle ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                            }}
                        >
                            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                                Speakers In Conversation
                            </h1>
                        </div>
                    </div>
                )}

                {/* Individual Artists Section */}
                {showArtist && currentArtist && (
                    <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16 lg:px-24">
                        <div className="max-w-6xl w-full">
                            <div
                                key={currentArtistIndex}
                                className="text-center transition-all duration-1000 ease-out"
                                style={{
                                    opacity: showArtist ? 1 : 0,
                                    transform: showArtist ? 'translateY(0)' : 'translateY(20px)',
                                }}
                            >
                                {/* Artist Image */}
                                {currentArtist.image ? (
                                    <div className="mb-8 flex justify-center">
                                        <img
                                            src={currentArtist.image}
                                            alt={currentArtist.name}
                                            className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover rounded-lg shadow-2xl"
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="mb-8 flex justify-center">
                                        <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-foreground/10 rounded-lg flex items-center justify-center border-2 border-foreground/20">
                                            <p className="font-display text-lg text-foreground/60">Image Coming Soon</p>
                                        </div>
                                    </div>
                                )}

                                {/* Artist Name */}
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-6">
                                    {currentArtist.name}
                                </h2>

                                {/* Artist Title (before \n) - Highlighted, and Content (after \n) */}
                                {(() => {
                                    const parts = currentArtist.description.split(/\\n|\n/);
                                    const title = parts[0]?.trim();
                                    const content = parts.slice(1).join('\n').trim();
                                    return (
                                        <>
                                            {/* Artist Title - Highlighted in Gold */}
                                            {title && (
                                                <h3 className="font-display text-lg md:text-xl lg:text-2xl font-semibold text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-4" style={{ color: '#D4AF37' }}>
                                                    {title}
                                                </h3>
                                            )}
                                            {/* Artist Content */}
                                            {content && (
                                                <p className="font-display text-sm md:text-base lg:text-lg font-light leading-relaxed text-foreground/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-3xl mx-auto whitespace-pre-line">
                                                    {content}
                                                </p>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery View - All Artists */}
                {showGallery && (
                    <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8 lg:px-16">
                        <div
                            className="w-full max-w-7xl transition-all duration-1000 ease-out"
                            style={{
                                opacity: showGallery ? 1 : 0,
                                transform: showGallery ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                            }}
                        >
                            {/* Gallery Title */}
                            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center mb-8">
                                Speakers
                            </h2>

                            {/* Artists Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                                {artists.map((artist, index) => (
                                    <div
                                        key={index}
                                        className="text-center transition-all duration-500 ease-out"
                                        style={{
                                            opacity: showGallery ? 1 : 0,
                                            transform: showGallery ? 'translateY(0)' : 'translateY(20px)',
                                            transitionDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        {/* Artist Image */}
                                        {artist.image ? (
                                            <div className="mb-3 flex justify-center">
                                                <img
                                                    src={artist.image}
                                                    alt={artist.name}
                                                    className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 object-cover rounded-lg shadow-xl"
                                                    style={{
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="mb-3 flex justify-center">
                                                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-foreground/10 rounded-lg flex items-center justify-center border-2 border-foreground/20">
                                                    <p className="font-display text-xs text-foreground/60 text-center px-2">Coming Soon</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Artist Name */}
                                        <p className="font-display text-xs md:text-sm lg:text-base font-light text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                            {artist.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};
