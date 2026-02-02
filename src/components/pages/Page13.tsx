import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { Description } from '@radix-ui/react-toast';

// Import artist images

const naisiri = '/assets/images/artisits/World/nasiri.JPG';
const apiChimba = '/assets/images/artisits/World/api_chimba.JPG';
const konyaWhirling = '/assets/images/artisits/World/konya_whirling.JPG';
const duduk = '/assets/images/artisits/World/duduk.JPG';
const ismet = '/assets/images/artisits/World/ismet.JPG';

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
        name: 'Duduk Ensemble',
        image: duduk,
        description: 'Armenian Duduk Masters \n The Armenian duduk is a double reed woodwind instrument made of apricot wood originating from Armenia. Duduk is an incredibly emotional wind instrument, capable of penetrating with its timbre into the deepest and most secret corners of the soul.',
    },
    {
        name: 'Ismet Aydin',
        image: ismet,
        description: 'Vocalist, Composer, Songwriter and Educator from Anatolia Turkey \n Traditional folk-inspired and Sufi inspired compositions. His profoundly emotional and heart stirring music has deeply moved people all over the globe.',
    },
    {
        name: 'Naisiri',
        image: naisiri,
        description: 'Renowned Iranian Multi-instrumentalist and Producer \n Blending oud, flute, and clarinet with deep bass, rhythmic synths, and organic percussion. From the Pyramids to Petra, he weaves Middle Eastern Sufi traditions into a modern electronic soundscape, carrying the soulful essence of his heritage into today\'s urban world.',
    },
    {
        name: 'Api Chimba',
        image: apiChimba,
        description: 'World Music Artist \n A captivating performer bringing traditional sounds and spiritual music to global audiences, bridging ancient traditions with contemporary expressions.',
    },
    {
        name: 'Konya Whirling Dervishes',
        image: konyaWhirling,
        description: 'Sacred Sufi Dance Performers \n The Whirling Dervishes of Konya perform the Sema ceremony, a mesmerizing Sufi ritual of spiritual ecstasy and divine connection through sacred spinning dance.',
    },
    {
        name: 'Bahram-Ji',
        description: 'Kurdish New Age musician from Iran \n Having spent most of his adult life in India studying music.His music is a special combination between the old and the traditional, a fusion of Rumi\'s spiritual poems with modern and technical rhythms that invite to meditation.The fusion between spirituality and meditative rhythms, combined with traditional Persian instruments such as the santoor, has a hypnotic effect.',
    },
];

const ARTIST_DISPLAY_DURATION = 4000; // 4 seconds per artist
const TITLE_DISPLAY_DURATION = 2000; // 2 seconds for title
const GALLERY_DISPLAY_DURATION = 4000; // 4 seconds for gallery view

export const Page13: React.FC<Page13Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
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

        // Timeline:
        // Step 0: Initial wait (500ms) -> Show Title
        // Step 1: Show Title (TITLE_DISPLAY_DURATION) -> Hide Title, Show Artist 0
        // Step 2...N: Show Artist i (ARTIST_DISPLAY_DURATION) -> Show Artist i+1
        // Step N+1: Show Gallery (GALLERY_DISPLAY_DURATION) -> Complete

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
                                Artists In Conversation
                            </h1>
                            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-foreground/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-4">
                                World
                            </p>
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
                                    const content = parts[1]?.trim();
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
                                                <p className="font-display text-sm md:text-base lg:text-lg font-light leading-relaxed text-foreground/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-3xl mx-auto">
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
                                World Artists
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
