import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';

const AUDIO_SRC = '/assets/audio/bg_audio.mp3';

export const BackgroundAudio: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { isMuted } = useAudio();

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Handle autoplay
    useEffect(() => {
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    audioRef.current.volume = 0.5; // Set a reasonable default volume
                    await audioRef.current.play();
                } catch (err) {
                    console.log("Autoplay prevented:", err);
                    // Usually handled by user interaction elsewhere
                }
            }
        };

        playAudio();

        // Add click listener to document to retry play if autoplay failed
        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(console.error);
            }
        };

        document.addEventListener('click', handleInteraction, { once: true });
        return () => document.removeEventListener('click', handleInteraction);
    }, []);

    return (
        <audio
            ref={audioRef}
            src={AUDIO_SRC}
            loop
            playsInline
        />
    );
};
