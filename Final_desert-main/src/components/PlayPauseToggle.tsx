import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

interface PlayPauseToggleProps {
  isPaused: boolean;
  onToggle: () => void;
}

export const PlayPauseToggle: React.FC<PlayPauseToggleProps> = ({ isPaused, onToggle }) => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-4">
      {/* Mute Toggle */}
      <button
        onClick={toggleMute}
        className="p-3 rounded-full bg-background/60 backdrop-blur-md border border-foreground/20 hover:bg-background/80 hover:border-foreground/40 transition-all duration-300 group"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        title={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" />
        ) : (
          <Volume2 className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
        )}
      </button>

      {/* Play/Pause Toggle */}
      <button
        onClick={onToggle}
        className="p-3 rounded-full bg-background/60 backdrop-blur-md border border-foreground/20 hover:bg-background/80 hover:border-foreground/40 transition-all duration-300 group"
        aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
        title={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
      >
        {isPaused ? (
          <Play className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" />
        ) : (
          <Pause className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
        )}
      </button>
    </div>
  );
};
