import React, { useEffect, useState, useRef } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

// Images
const sunriseConcert = '/assets/images/Jaisalmer/1-CROP +IF POSS. TEXT \'SUNRISE CONCERT STAGE\' .png';
const jaisalmerBhrama = '/assets/images/Jaisalmer/Bhrama_3187.webp';
const jaisalmerShutterstock1 = '/assets/images/Jaisalmer/shutterstock_1832570845.jpg';
const jaisalmerBeige08 = '/assets/images/Jaisalmer/Beige08.webp';
const jaisalmeriStock = '/assets/images/Jaisalmer/iStock-1201530843 (1).jpg';
const jaisalmerShutterstock2 = '/assets/images/Jaisalmer/shutterstock_645264559.jpg';

interface Page3Props {
  isActive: boolean;
  onSlideshowComplete?: () => void;
  isPaused?: boolean;
}

const gridImages = [
  jaisalmerBhrama,
  jaisalmeriStock,
  jaisalmerBeige08,
  jaisalmerShutterstock1,
];

const textBlocks = [
  `A UNESCO World Heritage site, the mystical desert town of Jaisalmer & its Fort lies in the heart of the Thar Desert in Rajasthan, India.`,
  `The city’s honey-colored sandstone architecture reflects sunlight beautifully, earning it the name “The Golden City”.`,
  `Jaisalmer Fort is one of the world’s few living forts, with bustling bazaars, homes, folk music, and tribal culture thriving within its walls.`,
  `Jaisalmer offers a timeless journey—where golden landscapes, intricate artistry, and enduring traditions transport visitors to another era.`,
];

const TEXT_DURATION = 4500;
const GRID_BOX_DELAY = 600;
const GRID_DURATION = 4000;
const ZOOM_DURATION = 4000;

export const Page3: React.FC<Page3Props> = ({ isActive, onSlideshowComplete, isPaused }) => {
  const [phase, setPhase] = useState<'sunrise' | 'grid' | 'zoom'>('sunrise');
  const [activeText, setActiveText] = useState(0);
  const [gridVisible, setGridVisible] = useState([false, false, false, false]);
  const [zoom, setZoom] = useState(false);

  // We use detailed state to track progress within phases
  const [gridStep, setGridStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase('sunrise');
      setActiveText(0);
      setGridVisible([false, false, false, false]);
      setGridStep(0);
      setZoom(false);
      return;
    }
  }, [isActive]);

  // Main Timer Logic
  useEffect(() => {
    if (!isActive || isPaused) return;

    let timer: NodeJS.Timeout;

    if (phase === 'sunrise') {
      // Advance text
      timer = setTimeout(() => {
        if (activeText < textBlocks.length - 1) {
          setActiveText(prev => prev + 1);
        } else {
          // Move to Grid phase
          setPhase('grid');
          setGridStep(0);
          setGridVisible([true, false, false, false]); // Show first immediately? Original code showed first immediatelyish?
          // Original code: setPhase('grid'); setGridVisible..[0] = true immediately.
        }
      }, TEXT_DURATION);
    }
    else if (phase === 'grid') {
      // Grid has step delays: 0 (immediate), then 600ms delays for 1, 2, 3.
      // Current step 0 is already handled by transition TO grid?
      // Let's refine.
      // If we just entered grid (gridStep 0), we set 0 visible. 
      // Then we wait 600ms for step 1.

      if (gridStep === 0) {
        // Ensure first is visible (should be set immediately, but redundant safety)
        setGridVisible(prev => { const n = [...prev]; n[0] = true; return n; });

        timer = setTimeout(() => {
          setGridStep(1);
        }, GRID_BOX_DELAY);
      } else if (gridStep === 1) { // 3rd item
        setGridVisible(prev => { const n = [...prev]; n[3] = true; return n; });
        timer = setTimeout(() => {
          setGridStep(2);
        }, GRID_BOX_DELAY);
      } else if (gridStep === 2) { // 2nd item (index 2)
        setGridVisible(prev => { const n = [...prev]; n[2] = true; return n; });
        timer = setTimeout(() => {
          setGridStep(3);
        }, GRID_BOX_DELAY);
      } else if (gridStep === 3) { // 1st item (index 1) - Wait, indices were 0, 3, 2, 1 in original?
        // Original:
        // immediate: 0
        // delay: 3
        // delay*2: 2
        // delay*3: 1
        setGridVisible(prev => { const n = [...prev]; n[1] = true; return n; });
        // Wait remaining GRID_DURATION? 
        // Original: setTimeout(zoom, GRID_DURATION) from START of grid.
        // GRID_DURATION = 4000.
        // Delays used so far: 0, 600, 1200, 1800.
        // So we need to wait 4000 - 1800 = 2200ms.
        timer = setTimeout(() => {
          setPhase('zoom');
        }, GRID_DURATION - (GRID_BOX_DELAY * 3));
      }
    }
    else if (phase === 'zoom') {
      // Zoom phase
      // Zoom starts after small delay 800ms? 
      // Original: setTimeout(() => setZoom(true), 800)
      if (!zoom) {
        timer = setTimeout(() => {
          setZoom(true);
        }, 800);
      } else {
        // Zoom done, complete
        timer = setTimeout(() => {
          if (onSlideshowComplete) onSlideshowComplete();
        }, ZOOM_DURATION);
      }
    }

    return () => clearTimeout(timer);
  }, [isActive, isPaused, phase, activeText, gridStep, zoom, onSlideshowComplete]);


  return (
    <PageWrapper isActive={isActive} overlayOpacity={0}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden">

        {/* SUNRISE WITH TEXT */}
        {phase === 'sunrise' && (
          <>
            <img
              src={sunriseConcert}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

            <div className="relative z-10 h-full flex items-start justify-center px-8 pt-32">
              <div
                key={activeText}
                className="max-w-4xl text-center text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-white transition-all duration-1000 opacity-100 animate-fade-up"
              >
                {textBlocks[activeText]}
              </div>
            </div>
          </>
        )}

        {/* GRID */}
        {phase === 'grid' && (
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {gridImages.map((img, i) => (
              <div
                key={i}
                className="transition-all duration-700"
                style={{
                  opacity: gridVisible[i] ? 1 : 0,
                  transform: gridVisible[i] ? 'scale(1)' : 'scale(0.95)',
                }}
              >
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* ZOOM */}
        {phase === 'zoom' && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={jaisalmerShutterstock2}
              className="w-full h-full object-cover transition-transform ease-in-out"
              style={{
                transform: zoom ? 'scale(1.5)' : 'scale(1)',
                transitionDuration: `${ZOOM_DURATION}ms`,
              }}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
