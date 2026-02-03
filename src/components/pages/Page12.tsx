import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

// Import artist images
// Artist images are now static assets in public folder
const amjadAliKhan = '/assets/images/artisits/India/amjad_ali_khan.JPG';
const anoushkaShankar = '/assets/images/artisits/India/anoushka_shankar.JPG';
const madanGopal = '/assets/images/artisits/India/madan_gopal.JPG';
const padmaShriAnwarKhan = '/assets/images/artisits/India/padma_shri_anwar_khan.JPG';
const rishab = '/assets/images/artisits/India/rishab.JPG';

interface Page12Props {
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
    name: 'Amjad Ali Khan',
    image: amjadAliKhan,
    description: 'Sarod Master, Grammy award Winner \n Holds the title of All highest honors in Indian music, Padma Bhushan, Padma Shri, Padma Vibushan. Double award winner of Indian Lifetime Achievement Award.',
  },
  {
    name: 'Anoushka Shankar',
    image: anoushkaShankar,
    description: '11-time Grammy Nominee \n TIME Magazine "Top Influential Asian Women" University of Oxford awarded her an Honorary Doctor of Music degree UNHCR - The UN Refugee Agency ambassador.',
  },
  {
    name: 'Rishab Rikhiram Sharma',
    image: rishab,
    description: 'Multi-instrumentalist and Composer \n Rishab Rikhiram Sharma is known for his innovative approach to traditional Indian music, blending classical techniques with contemporary sounds.',
  },
  {
    name: 'Madan Gopal',
    image: madanGopal,
    description: 'Indian Composer, Singer, Lyricist, Actor, Screenwriter, Film Theorist, Editor and Polyglot \nMadan Gopal Singh has composed and sung the poetry of Rumi, Shah Husain, Sultan Bahu and Bulle Shah. Travels all continents with his tales and songs of Sufism, connecting the west to the profound and heartfelt philosophy like no other.',
  },
  {
    name: 'Padma Shri Anwar Khan',
    image: padmaShriAnwarKhan,
    description: 'Vocalist / Singer \n He is an Indian folk and Sufi singer known for his contribution to the preservation and promotion of traditional Manganiyar music. He was honored with the Padma Shri in 2024 by the Government of India for his contributions to the arts. He has performed with international superstars such as Mick Jagger, Luciana Pavarotti from the Philharmonie Paris to the Lincoln Center New York.',
  },
];

const ARTIST_DISPLAY_DURATION = 4000; // 4 seconds per artist
const TITLE_DISPLAY_DURATION = 3000; // 3 seconds for title (increased for longer hold)
const GALLERY_DISPLAY_DURATION = 4000; // 4 seconds for gallery view

export const Page12: React.FC<Page12Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
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

    const totalSteps = 2 + artists.length + 1;

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
      const artistIndex = step - 2;
      // If it's not the first artist (which is set at step 2 start), we need to advance index
      // Actually step 2 starts showing artist 0.
      // We wait ARTIST_DISPLAY_DURATION then move to next.

      timer = setTimeout(() => {
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
            {/* Subtle amber tinted background for India section */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/25 via-transparent to-orange-950/20" />
            <div
              className="text-center transition-all ease-out relative z-10"
              style={{
                opacity: showTitle ? 1 : 0,
                transform: showTitle ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                transitionDuration: '3500ms',
              }}
            >
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-foreground drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                Artists In Conversation
              </h1>
              <p className="font-display text-xl md:text-2xl lg:text-3xl font-light text-foreground/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-4">
                India
              </p>
              <p className="font-devanagari text-lg md:text-xl lg:text-2xl text-primary/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-2">
                भारत
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
                        <h3 className="font-display text-lg md:text-xl lg:text-2xl font-normal text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-4" style={{ color: '#D4AF37' }}>
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
                Featured Artists
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
