import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, Heart, Crown } from 'lucide-react';

// Quotes cycled during loading for a premium boutique experience
const LUXURY_QUOTES = [
  "Unwrapping elegance & exquisite craftsmanship...",
  "Curating bespoke gift experiences...",
  "Hand-finishing with signature satin ribbons...",
  "Discovering rare and memorable treasures...",
  "Preparing your personalized presentation..."
];

export function LuxurySplashLoader({ 
  message, 
  onFinished, 
  minDuration = 1200 
}) {
  const [progress, setProgress] = useState(15);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Progress increment simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 98;
        }
        const jump = Math.floor(Math.random() * 20) + 10;
        return Math.min(prev + jump, 96);
      });
    }, 180);

    // Quote rotation
    const quoteInterval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % LUXURY_QUOTES.length);
    }, 2200);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          if (onFinished) onFinished();
        }, 400);
      }, 300);
    }, minDuration);

    return () => {
      clearInterval(interval);
      clearInterval(quoteInterval);
      clearTimeout(timer);
    };
  }, [minDuration, onFinished]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950/95 backdrop-blur-md text-white transition-opacity duration-500 select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-rose-600/15 animate-luxury-glow pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6 animate-float-gentle">
        
        {/* Animated Brand Emblem & Ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer Rotating Halo */}
          <div className="w-28 h-28 rounded-full border border-rose-500/30 border-t-rose-400 border-r-amber-300 animate-luxury-spin" />
          
          {/* Inner Counter-Rotating Ring */}
          <div 
            className="absolute w-20 h-20 rounded-full border border-dashed border-rose-400/40"
            style={{ animation: 'luxurySpin 10s linear infinite reverse' }}
          />

          {/* Central Luxury Icon */}
          <div className="absolute w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-950 via-stone-900 to-rose-900 border border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-950/50">
            <Gift className="w-7 h-7 text-rose-400 animate-pulse" />
          </div>

          {/* Floating Sparkle Accents */}
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-bounce" />
          <Heart className="absolute -bottom-1 -left-1 w-3.5 h-3.5 text-rose-400" />
        </div>

        {/* Brand Typography */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.3em] text-rose-400">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>Haute Gifting Maison</span>
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-wider text-white">
            BLUSH BOX
          </h2>
          <p className="text-xs text-stone-400 font-serif italic transition-all duration-300 h-5">
            {message || LUXURY_QUOTES[quoteIdx]}
          </p>
        </div>

        {/* Luxury Gold/Rose Progress Indicator */}
        <div className="w-48 space-y-2">
          <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700/50">
            <div 
              className="h-full bg-gradient-to-r from-rose-600 via-amber-400 to-rose-400 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[9px] uppercase font-mono tracking-widest text-stone-500">
            <span>Loading</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// In-section or card loader
export function LuxuryInlineLoader({ text = "Loading exquisite gifts...", className = "" }) {
  return (
    <div className={`py-16 flex flex-col items-center justify-center text-center space-y-4 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-rose-500/20 border-t-rose-600 dark:border-t-rose-400 animate-spin" />
        <div className="absolute w-8 h-8 rounded-full bg-rose-50 dark:bg-stone-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-serif italic text-stone-600 dark:text-stone-400">
          {text}
        </p>
      </div>
    </div>
  );
}

// Minimal button spinner
export function LuxuryMiniSpinner({ className = "w-4 h-4 text-white" }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
      />
    </svg>
  );
}

// Top Bar progress indicator for route switching
export function LuxuryTopBarLoader({ active }) {
  if (!active) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-stone-900/10">
      <div className="h-full bg-gradient-to-r from-rose-600 via-amber-400 to-rose-500 animate-shimmer w-full" />
    </div>
  );
}

export default LuxurySplashLoader;
