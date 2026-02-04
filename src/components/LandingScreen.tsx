import React from 'react';

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Subtle decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-3xl">
        {/* Title */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-thin text-foreground tracking-[0.2em] mb-4">
  CARAVANA
</h1>
        
        {/* Subtitle */}
        <p className="font-display text-base md:text-lg lg:text-xl font-light text-muted-foreground tracking-[0.15em] mb-16 max-w-xl uppercase">
          A musical caravan journeying through the sands of Rajasthan
        </p>
        
        {/* Animated Play Button */}
        <button
          onClick={onStart}
          className="group relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full 
                     border-2 border-primary/50 
                     bg-gradient-to-b from-primary/10 to-transparent backdrop-blur-sm
                     hover:border-primary hover:bg-primary/20 
                     transition-all duration-500 ease-out
                     hover:scale-110 active:scale-100
                     flex items-center justify-center"
        >
          {/* Button glow effect */}
          <span className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
          
          {/* Play Icon */}
          <svg 
            className="relative w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary ml-1 group-hover:scale-110 transition-transform duration-300" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
      
      {/* Decorative bottom line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
};
