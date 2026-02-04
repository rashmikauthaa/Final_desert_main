import React, { useEffect, useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";

// Artist images
const amjadAliKhan = "/assets/images/artisits/India/amjad_ali_khan.JPG";
const anoushkaShankar = "/assets/images/artisits/India/anoushka_shankar.JPG";
const madanGopal = "/assets/images/artisits/India/madan_gopal.JPG";
const padmaShriAnwarKhan = "/assets/images/artisits/India/padma_shri_anwar_khan.JPG";
const rishab = "/assets/images/artisits/India/rishab.JPG";

interface Page12Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

interface Artist {
  name: string;
  image: string;
  description: string;
}

const artists: Artist[] = [
  {
    name: "Amjad Ali Khan",
    image: amjadAliKhan,
    description:
      "Sarod Master, Grammy Award winner. Recipient of India's highest civilian honors including Padma Shri, Padma Bhushan and Padma Vibhushan. Double awardee of the Indian Lifetime Achievement Award.",
  },
  {
    name: "Anoushka Shankar",
    image: anoushkaShankar,
    description:
      "11-time Grammy nominee, listed by TIME as one of the most influential Asian women. Honorary Doctor of Music from the University of Oxford and UNHCR Goodwill Ambassador.",
  },
  {
    name: "Rishab Rikhiram Sharma",
    image: rishab,
    description:
      "Multi-instrumentalist and composer known for reimagining Indian classical music through contemporary expression, blending tradition with modern sonic storytelling.",
  },
  {
    name: "Madan Gopal Singh",
    image: madanGopal,
    description:
      "Composer, singer and scholar whose work spans poetry, Sufi traditions and global performance. Renowned for bringing the philosophy of mysticism to contemporary audiences worldwide.",
  },
  {
    name: "Padma Shri Anwar Khan",
    image: padmaShriAnwarKhan,
    description:
      "Indian folk and Sufi vocalist celebrated for preserving Manganiyar music. Awarded the Padma Shri in 2024. Has performed globally from Philharmonie Paris to Lincoln Center, New York.",
  },
];

const ANIMATION_DELAY_PER_ITEM = 300; // 300ms delay between each item
const PAGE_DISPLAY_DURATION = 8000; // 8 seconds total display time

export const Page12: React.FC<Page12Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
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
        }, 600 + (index * ANIMATION_DELAY_PER_ITEM)); // Start after header, stagger each item
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
              ARTISTS IN CONVERSATION – INDIA
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
