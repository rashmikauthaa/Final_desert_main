import { useState, useEffect, useCallback, useRef } from 'react';
import { HarmoniumPagination } from '@/components/HarmoniumPagination';
import { SandTransition } from '@/components/SandTransition';
import { LandingScreen } from '@/components/LandingScreen';
import { PlayPauseToggle } from '@/components/PlayPauseToggle';
import { BackgroundAudio } from '@/components/BackgroundAudio';
import { AudioProvider } from '@/contexts/AudioContext';

import { Page1 } from '@/components/pages/Page1';
import { Page2 } from '@/components/pages/Page2';
import { Page3 } from '@/components/pages/Page3';
import { Page4 } from '@/components/pages/Page4';
import { Page5 } from '@/components/pages/Page5';
import { Page5Video } from '@/components/pages/Page5Video';
import { Page6 } from '@/components/pages/Page6';
import { Page7 } from '@/components/pages/Page7';
import { Page8 } from '@/components/pages/Page8';
import { Page9 } from '@/components/pages/Page9';
import { Page10 } from '@/components/pages/Page10';
import { Page11 } from '@/components/pages/Page11';
import { Page12 } from '@/components/pages/Page12';
import { Page13 } from '@/components/pages/Page13';
import { Page14 } from '@/components/pages/Page14';
import { Page15 } from '@/components/pages/Page15';
import { Page16 } from '@/components/pages/Page16';
import { Page16B } from '@/components/pages/Page16B';
import { Page17 } from '@/components/pages/Page17';
import { Page18 } from '@/components/pages/Page18';
import { PageFounder } from '@/components/pages/PageFounder';
import { Page19 } from '@/components/pages/Page19';

const TOTAL_PAGES = 22; // Total pages in the presentation (Page0 to Page21)
const SWIPE_THRESHOLD = 50;
const WHEEL_THRESHOLD = 30;
const DEBOUNCE_TIME = 800;
const AUTO_SLIDE_DURATION = 13000; // Default: 13 seconds for auto-slide

// Custom timing for specific pages (in milliseconds)
const getPageDuration = (pageIndex: number): number => {
  switch (pageIndex) {
    case 2: return 18000;  // Page 3 - 18 seconds (sunrise 5s + grid 3s + zoom 6s + buffer)
    case 3: return 19000;  // Page 4 (Venues) - 19 seconds (+6s)
    case 6: return 17000;  // Page 7 - 17 seconds
    case 7: return 17000;  // Page 8 - 17 seconds
    case 11: return 14000; // Page 12 (Attendance) - 14 seconds
    default: return AUTO_SLIDE_DURATION;
  }
};

// Video path - using pre-clipped video
const PAGE2_CLIP_PATH = '/assets/videos/page2_clip_compressed.mp4';

const Index = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down'>('down');
  const [showSandTransition, setShowSandTransition] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const touchStartY = useRef(0);
  const lastNavigationTime = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const manganiyarsVideoRef = useRef<HTMLVideoElement>(null);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const navigateToPage = useCallback((targetPage: number, direction?: 'up' | 'down', skipDebounce?: boolean) => {
    const now = Date.now();
    if (!skipDebounce && now - lastNavigationTime.current < DEBOUNCE_TIME) return;
    if (targetPage < 0 || targetPage >= TOTAL_PAGES) return;
    if (targetPage === currentPage) return;

    lastNavigationTime.current = now;
    setIsTransitioning(true);
    setTransitionDirection(direction || (targetPage > currentPage ? 'down' : 'up'));
    setShowSandTransition(true);

    // Change page after sand animation starts
    setTimeout(() => {
      setCurrentPage(targetPage);
    }, 300);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  }, [currentPage]);

  // Auto-slide timer for all pages (except Page5 which has its own slideshow timer)
  useEffect(() => {
    // Clear any existing timer
    if (autoSlideTimerRef.current) {
      clearTimeout(autoSlideTimerRef.current);
      autoSlideTimerRef.current = null;
    }

    // Don't auto-slide if paused, on the last page, or landing screen is still showing
    // Also skip pages with internal slideshows
    if (showLanding || isPaused || currentPage >= TOTAL_PAGES - 1 || currentPage === 2 || currentPage === 3 || currentPage === 4 || currentPage === 5 || currentPage === 8 || currentPage === 9 || currentPage === 10 || currentPage === 11 || currentPage === 12 || currentPage === 13 || currentPage === 14 || currentPage === 15 || currentPage === 16 || currentPage === 17 || currentPage === 18 || currentPage === 20) {
      return;
    }

    // Set timer for auto-slide with custom duration per page
    autoSlideTimerRef.current = setTimeout(() => {
      navigateToPage(currentPage + 1, 'down', true);
    }, getPageDuration(currentPage));

    return () => {
      if (autoSlideTimerRef.current) {
        clearTimeout(autoSlideTimerRef.current);
      }
    };
  }, [currentPage, isPaused, showLanding, navigateToPage]);

  // Handler for Page5 slideshow completion (goes to page 5 - video page)
  const handleSlideshowComplete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(5, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page5Video completion (goes to page 6)
  const handlePage5VideoComplete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(6, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page8 slideshow completion (goes to page 9 - video page)
  const handlePage8SlideshowComplete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(9, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page10 completion (goes to page 11 - Artists In Conversation)
  const handlePage10Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(11, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page11 completion (goes to page 12 - Artists In Conversation India)
  const handlePage11Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(12, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page12 completion (goes to page 13 - Artists In Conversation World)
  const handlePage12Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(13, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page13 completion (goes to page 14 - Artists In Conversation Electronic)
  const handlePage13Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(14, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page14 completion (goes to page 15 - Speakers In Conversation)
  const handlePage14Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(15, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page15 completion (goes to page 16 - Ending Slideshow)
  const handlePage15Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(16, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page16 completion (goes to page 17 - WHO ARE THEY?)
  const handlePage16Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(17, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page16B completion (goes to page 18 - Why Partner)
  const handlePage16BComplete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(18, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page17 completion (goes to page 19)
  const handlePage17Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(19, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page18 completion (goes to page 20 - Final Credits)
  const handlePage18Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(20, 'down', true); // Founder Page
    }
  }, [navigateToPage, isPaused]);

  // Handler for PageFounder completion (goes to page 21 - Final Credits/Page19)
  const handlePageFounderComplete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(21, 'down', true); 
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page9 video completion (goes to page 10)
  const handlePage9Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(10, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page3 completion (goes to page 4)
  const handlePage3Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(3, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handler for Page4 completion (goes to page 5)
  const handlePage4Complete = useCallback(() => {
    if (!isPaused) {
      navigateToPage(4, 'down', true);
    }
  }, [navigateToPage, isPaused]);

  // Handle start experience from landing screen
  const handleStartExperience = useCallback(() => {
    setShowLanding(false);
    setHasInteracted(true);
    if (manganiyarsVideoRef.current) {
      manganiyarsVideoRef.current.currentTime = 195;
      manganiyarsVideoRef.current.play().catch(console.error);
    }
  }, []);

  // Start audio on first user interaction (browser autoplay policy)
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (manganiyarsVideoRef.current && currentPage === 0) {
        manganiyarsVideoRef.current.currentTime = 195;
        manganiyarsVideoRef.current.play().catch(console.error);
      }
    }
  }, [hasInteracted, currentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < TOTAL_PAGES - 1) {
      navigateToPage(currentPage + 1, 'down');
    }
  }, [currentPage, navigateToPage]);

  const handlePrev = useCallback(() => {
    if (currentPage > 0) {
      navigateToPage(currentPage - 1, 'up');
    }
  }, [currentPage, navigateToPage]);

  // Toggle pause/play
  const handleTogglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Handle video pause/play
  useEffect(() => {
    if (manganiyarsVideoRef.current) {
      if (isPaused) {
        manganiyarsVideoRef.current.pause();
      } else {
        // Only play if we are on a page that uses it?
        // Actually it's autoplay looped, so resuming is fine.
        // It's visible only on Page1 and Page2.
        // Page1 uses it for audio only? PageWrapper hides it?
        // Index.tsx line 343: opacity 1 on currentPage 1.
        // But it plays audio on Page1 too (via Page1 comp)? No, Page1 takes audioRef.
        manganiyarsVideoRef.current.play().catch(console.error);
      }
    }
  }, [isPaused]);

  // Wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (Math.abs(e.deltaY) > WHEEL_THRESHOLD) {
        if (e.deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleNext, handlePrev]);

  // Touch navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
        if (deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleNext, handlePrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleSandTransitionComplete = () => {
    setShowSandTransition(false);
  };

  // Handle video ended to loop the clipped video
  const handleVideoEnded = useCallback(() => {
    if (manganiyarsVideoRef.current) {
      manganiyarsVideoRef.current.currentTime = 0;
      manganiyarsVideoRef.current.play().catch(console.error);
    }
  }, []);

  // Don't auto-play on mount - wait for landing screen interaction
  useEffect(() => {
    // Video will be started by handleStartExperience
  }, []);

  // Determine if video should be visible (on Page 1 for audio or Page 2 for video)
  const showVideo = currentPage === 0 || currentPage === 1;


  // ... (existing imports)

  // ...

  return (
    <AudioProvider>
      <BackgroundAudio />
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-hidden bg-background cursor-default select-none"
        onClick={handleFirstInteraction}
      >
        {/* Shared Manganiyars Video Element - plays audio on Page1, video+audio on Page2 */}
        <video
          ref={manganiyarsVideoRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{
            opacity: currentPage === 1 ? 1 : 0,
            zIndex: currentPage === 1 ? 5 : -1,
            pointerEvents: currentPage === 1 ? 'auto' : 'none'
          }}
          playsInline
          preload="auto"
          autoPlay
          onEnded={handleVideoEnded}
          loop
        >
          <source src={PAGE2_CLIP_PATH} type="video/mp4" />
        </video>

        {/* Sand Transition Effect */}
        <SandTransition
          isActive={showSandTransition}
          direction={transitionDirection}
          onComplete={handleSandTransitionComplete}
        />

        {/* Pages */}
        <Page1
          isActive={currentPage === 0}
          audioRef={manganiyarsVideoRef}
          isPaused={isPaused}
        />
        <Page2 isActive={currentPage === 1} videoRef={manganiyarsVideoRef} />
        {/* <PageCollaborations isActive={currentPage === 2} /> */}
        <Page3 isActive={currentPage === 2} onSlideshowComplete={handlePage3Complete} isPaused={isPaused} />
        <Page4 isActive={currentPage === 3} onSlideshowComplete={handlePage4Complete} isPaused={isPaused} />
        <Page5 isActive={currentPage === 4} onSlideshowComplete={handleSlideshowComplete} audioRef={manganiyarsVideoRef} isPaused={isPaused} />
        <Page5Video isActive={currentPage === 5} onSlideshowComplete={handlePage5VideoComplete} isPaused={isPaused} />
        <Page6 isActive={currentPage === 6} isPaused={isPaused} />
        <Page7 isActive={currentPage === 7} isPaused={isPaused} />
        <Page8 isActive={currentPage === 8} audioRef={manganiyarsVideoRef} onSlideshowComplete={handlePage8SlideshowComplete} isPaused={isPaused} />
        <Page9 isActive={currentPage === 9} onSlideshowComplete={handlePage9Complete} isPaused={isPaused} />
        <Page10 isActive={currentPage === 10} onSlideshowComplete={handlePage10Complete} isPaused={isPaused} />
        <Page11 isActive={currentPage === 11} onSlideshowComplete={handlePage11Complete} isPaused={isPaused} />
        <Page12 isActive={currentPage === 12} onSlideshowComplete={handlePage12Complete} isPaused={isPaused} />
        <Page13 isActive={currentPage === 13} onSlideshowComplete={handlePage13Complete} isPaused={isPaused} />
        <Page14 isActive={currentPage === 14} onSlideshowComplete={handlePage14Complete} isPaused={isPaused} />
        <Page15 isActive={currentPage === 15} onSlideshowComplete={handlePage15Complete} isPaused={isPaused} />
        <Page16 isActive={currentPage === 16} onSlideshowComplete={handlePage16Complete} isPaused={isPaused} />
        <Page16B isActive={currentPage === 17} onSlideshowComplete={handlePage16BComplete} isPaused={isPaused} />
        <Page17 isActive={currentPage === 18} onSlideshowComplete={handlePage17Complete} isPaused={isPaused} />
        <Page18 isActive={currentPage === 19} onSlideshowComplete={handlePage18Complete} isPaused={isPaused} />
        <PageFounder isActive={currentPage === 20} onSlideshowComplete={handlePageFounderComplete} isPaused={isPaused} />
        <Page19 isActive={currentPage === 21} isPaused={isPaused} />

        {/* Harmonium-style Pagination */}
        <HarmoniumPagination
          totalPages={TOTAL_PAGES}
          currentPage={currentPage}
          onPageChange={(page) => navigateToPage(page)}
        />



        {/* Play/Pause Toggle Button - Bottom Right */}
        <PlayPauseToggle isPaused={isPaused} onToggle={handleTogglePause} />

        {/* Landing Screen - shown on initial load */}
        {showLanding && <LandingScreen onStart={handleStartExperience} />}
      </div>
    </AudioProvider>
  );
};

export default Index;
