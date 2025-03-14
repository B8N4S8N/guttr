'use client';

import { useState, useEffect, useRef } from 'react';

export default function TrackPlayer({ track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  
  useEffect(() => {
    // Reset states when track changes
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLoading(true);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [track?.id]);
  
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    
    const onEnded = () => setIsPlaying(false);
    
    // Events
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', onEnded);
    
    // Set volume
    audio.volume = volume;
    
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [volume]);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleProgressChange = (e) => {
    if (!audioRef.current) return;
    
    const newTime = (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const formatTime = (time) => {
    if (!time) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
  if (!track) {
    return (
      <div className="flex h-20 w-full items-center justify-center rounded-md border border-border bg-card">
        <p className="text-sm text-muted-foreground">No track selected</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-sm">
      <audio ref={audioRef} preload="metadata">
        {track.audioUrl && <source src={track.audioUrl} type="audio/mpeg" />}
        Your browser does not support the audio element.
      </audio>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-secondary/20"
            style={{ backgroundImage: track.coverImage ? `url(${track.coverImage})` : undefined }}
          >
            {!track.coverImage && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            )}
          </div>
          
          <div>
            <p className="font-medium line-clamp-1">{track.title}</p>
            <p className="text-sm text-muted-foreground">{track.artist}</p>
          </div>
        </div>
        
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between space-x-3">
          <span className="w-10 text-center text-xs text-muted-foreground">{formatTime(currentTime)}</span>
          
          <div 
            ref={progressBarRef}
            onClick={handleProgressChange}
            className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-muted"
          >
            <div 
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}  
            />
          </div>
          
          <span className="w-10 text-center text-xs text-muted-foreground">{formatTime(duration)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />
          
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          
          <button className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </button>
          
          <button className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">
            {track.bpm && `${track.bpm} BPM`}
          </span>
          
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {track.key && track.key}
          </span>
        </div>
      </div>
    </div>
  );
} 