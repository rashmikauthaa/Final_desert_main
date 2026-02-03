import React, { useEffect, useRef, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page19Props {
    isActive: boolean;
    isPaused?: boolean;
}

const VIDEO_SRC = '/assets/videos/FINAL PAGE VIDEO OF WEBSITE.mov';
const VIDEO_START_TIME = 5;  // Start at 5 seconds
const VIDEO_END_TIME = 18;   // End at 18 seconds

export const Page19: React.FC<Page19Props> = ({ isActive, isPaused }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showCredits, setShowCredits] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isActive) return;

        // Reset and start video at the specified time
        video.currentTime = VIDEO_START_TIME;
        if (!isPaused) {
            video.play().catch(() => {});
        }

        // Show credits after a delay
        const creditsTimer = setTimeout(() => {
            setShowCredits(true);
        }, 2000);

        // Handle time update to stop at end time
        const handleTimeUpdate = () => {
            if (video.currentTime >= VIDEO_END_TIME) {
                video.currentTime = VIDEO_START_TIME;
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.pause();
            video.removeEventListener('timeupdate', handleTimeUpdate);
            clearTimeout(creditsTimer);
        };
    }, [isActive, isPaused]);

    // Handle pause state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPaused) {
            video.pause();
        } else if (isActive) {
            video.play().catch(() => {});
        }
    }, [isPaused, isActive]);

    return (
        <PageWrapper isActive={isActive} overlayOpacity={0}>
            <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
                {/* Video Background */}
                <video
                    ref={videoRef}
                    src={VIDEO_SRC}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                    preload="auto"
                />

                {/* Dark overlay for credits visibility */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Credits - Bottom Left Corner */}
                <div
                    className={`absolute bottom-8 left-8 md:bottom-12 md:left-12 transition-all duration-[3000ms] ease-in ${
                        showCredits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                    <a
                        href="https://www.linkedin.com/in/unsparsh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2"
                    >
                        <span className="font-display text-[10px] md:text-xs text-white/50 tracking-[0.2em] uppercase group-hover:text-white/70 transition-colors">
                            Made by
                        </span>
                        <span className="font-display text-xs md:text-sm text-white/70 tracking-[0.15em] uppercase group-hover:text-primary transition-colors">
                            unsparsh
                        </span>
                    </a>
                </div>
            </div>
        </PageWrapper>
    );
};
