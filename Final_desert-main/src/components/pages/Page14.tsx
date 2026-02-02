import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

// Image paths
const nicolas = '/assets/images/artisits/Electronic/nicolas.JPG';
const nils = '/assets/images/artisits/Electronic/nils.jpg';
const svendsen = '/assets/images/artisits/Electronic/svedan.jpg';
const viken = '/assets/images/artisits/Electronic/viken.jpg';
const sabo = '/assets/images/artisits/Electronic/SABO.jpg';
const sahale = '/assets/images/artisits/Electronic/sahale.jpg';

declare module '*.JPG' {
    const value: string;
    export default value;
}

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
        name: 'Viken Arman',
        image: viken,
        description: 'French producer/ DJ and musician \n Viken Arman crafts a distinctive sound that blends the timeless and modern from a collage of samples, modular grooves, and acoustic composition. Viken reimagines tradition into a sound that surprises and captivates, always staying one step ahead of expectation.',
    },
    {
        name: 'Hraach & Armen Miran',
        // No image
        description: 'Music Producers & DJs \n Hraach is an Armenian music producer Known for creating deep house, melodic, and atmospheric, often with oriental. He has developed a musical world rich with melancholic tones, stellar landscapes, and magnetic, deep rhythms that captivate and elevate the experience of his listeners. \n Iran born, Los Angeles based DJ/producer/multi-instrumentalist Armen Miran has established himself as an iconic and powerful name in this industry. The two of them have been consistent sources of stability to him and guide his creative process.',
    },
    {
        name: 'Sabo',
        image: sabo,
        description: 'DJ & Producer \n Sabo\'s sound is inspired by his extensive World travels, and will take you on a mystical journey that crosses several musical borders a sonic landscape that crosses several musical borders with mixtures of tropical poly-rhythms, warm bass frequencies, rich percussion, lush tribal vocals, and smooth organic textures.',
    },
    {
        name: 'Nicolas Jarr',
        image: nicolas,
        description: 'A renowned Chilean-American Composer and Electronic Producer \n celebrated for reinventing downtempo, minimal techno, and ambient music with a deeply emotive, avant-garde style. Nicolas Jaar weaves together sounds with textures and eras, leading his listeners on a sojourn of sonic exploration and otherworldly experiences. Jaar is one of the finest things to happen to electronic music. He is a master and a marvel as a producer and a live musician',
    },
    {
        name: 'Nils Frahm',
        image: nils,
        description: 'German Musician, Composer, and Record Producer based in Berlin \n He is known for combining classical and electronic music and for an unconventional approach to the piano in which he mixes a grand piano, upright piano, Berlin-based contemporary composer He has built a steady reputation for his intimate, poignant piano recordings, yet they so far only showed a fragment of what to expect from a Nils Frahm concert. Frahm’s heart lies in improvisation, inspired by the space and the audience',
    },
    {
        name: 'Be Svendsen',
        image: svendsen,
        description: 'Danish Musician and Producer \n He has become a proponent of a uniquely organic, genre-bending sound His performance takes the audience on a deep experimental journey, providing a cinematic soundscape allowing the receivers to celebrate. It is through these playful interchanges of style that Be Svendsen expresses a profound and ever self-interrogating talent for innovation and alchemy',
    },
    {
        name: 'Sahale',
        image: sahale,
        description: 'Parisian Music Producer \n Draws inspiration from world music to electronic, blending both traditional and contemporary influences in his work of Deep Ancient Persian Background Music. Sahalé presents us with a multifaceted sound paradise composed of the most varied cultural references, clearly present and evident in his compositions, His form of expression, unique in electronic music, takes us from his performances to unknown arenas of world music. By mixing analogical and electronic instruments together.'
    },
];

const ARTIST_DISPLAY_DURATION = 4000; // 4 seconds per artist
const TITLE_DISPLAY_DURATION = 2000; // 2 seconds for title
const GALLERY_DISPLAY_DURATION = 4000; // 4 seconds for gallery view

export const Page14: React.FC<Page14Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
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
                                Artists In Conversation
                            </h1>
                            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-foreground/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-4">
                                Electronic
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
                                    const content = parts.slice(1).join('\n').trim(); // Join remaining parts in case multiple newlines
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
                                Electronic Artists
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
