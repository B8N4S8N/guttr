'use client';

import { useState, useEffect } from 'react';

export default function AudioPlayer({ isPlaying, currentSong, onTogglePlay, onSkipForward, onSkipBackward, isLoading }) {
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressTime, setProgressTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  
  useEffect(() => {
    const audioElement = document.querySelector('audio');
    if (!audioElement) return;
    
    const updateProgress = () => {
      const percent = (audioElement.currentTime / audioElement.duration) * 100 || 0;
      setProgressPercent(percent);
      
      // Format current time
      const currentMinutes = Math.floor(audioElement.currentTime / 60);
      const currentSeconds = Math.floor(audioElement.currentTime % 60);
      setProgressTime(`${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`);
      
      // Format total time
      const totalMinutes = Math.floor(audioElement.duration / 60) || 0;
      const totalSeconds = Math.floor(audioElement.duration % 60) || 0;
      setTotalTime(`${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`);
    };
    
    const timeUpdateHandler = () => {
      updateProgress();
    };
    
    const loadedHandler = () => {
      updateProgress();
    };
    
    const endedHandler = () => {
      onSkipForward();
    };
    
    audioElement.addEventListener('timeupdate', timeUpdateHandler);
    audioElement.addEventListener('loadeddata', loadedHandler);
    audioElement.addEventListener('ended', endedHandler);
    
    return () => {
      audioElement.removeEventListener('timeupdate', timeUpdateHandler);
      audioElement.removeEventListener('loadeddata', loadedHandler);
      audioElement.removeEventListener('ended', endedHandler);
    };
  }, [onSkipForward]);

  // If loading or no currentSong, show loading state
  if (isLoading || !currentSong) {
    return (
      <div className="px-6 py-3 rounded-lg backdrop-blur-sm bg-background/50 border border-border/50 flex flex-col gap-2 min-w-[250px]">
        <div className="flex items-center justify-center h-16">
          <div className="text-sm font-medium">Loading tracks...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-6 py-3 rounded-lg backdrop-blur-sm bg-background/50 border border-border/50 flex flex-col gap-2 min-w-[250px]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-medium truncate max-w-[120px]">{currentSong.title}</div>
        <div className="text-xs text-muted-foreground truncate">{currentSong.artist}</div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{progressTime}</span>
        <span>{totalTime}</span>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between mt-1">
        <button 
          onClick={onSkipBackward} 
          className="p-1.5 rounded-full hover:bg-background/50 transition-colors text-muted-foreground hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>
        
        <button 
          onClick={onTogglePlay} 
          className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 flex items-center justify-center"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <button 
          onClick={onSkipForward} 
          className="p-1.5 rounded-full hover:bg-background/50 transition-colors text-muted-foreground hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
          </svg>
        </button>
      </div>
    </div>
  );
} 