'use client';

import { useState, useEffect, useRef } from 'react';
import CloudVisualizerV2 from './CloudVisualizerV2';

export default function CombinedVisualizer({ isPlaying, audioRef }) {
  // Audio analysis setup
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyzerRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [isAudioSetup, setIsAudioSetup] = useState(false);
  const lowFreqDataRef = useRef(null);
  const midFreqDataRef = useRef(null);
  const highFreqDataRef = useRef(null);
  
  // Initialize audio context only once
  useEffect(() => {
    if (!audioContextRef.current && typeof window !== 'undefined' && window.AudioContext) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 1024;
        dataArrayRef.current = new Uint8Array(analyzerRef.current.frequencyBinCount);
        
        // Create specialized analyzers for frequency ranges
        const lowPassFilter = audioContextRef.current.createBiquadFilter();
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.value = 200; // Bass frequencies
        
        const bandPassFilter = audioContextRef.current.createBiquadFilter();
        bandPassFilter.type = 'bandpass';
        bandPassFilter.frequency.value = 1000; // Mid frequencies
        bandPassFilter.Q.value = 0.5;
        
        const highPassFilter = audioContextRef.current.createBiquadFilter();
        highPassFilter.type = 'highpass';
        highPassFilter.frequency.value = 5000; // High frequencies
        
        // Create analyzers for each frequency range
        const lowAnalyzer = audioContextRef.current.createAnalyser();
        lowAnalyzer.fftSize = 256;
        lowFreqDataRef.current = new Uint8Array(lowAnalyzer.frequencyBinCount);
        
        const midAnalyzer = audioContextRef.current.createAnalyser();
        midAnalyzer.fftSize = 256;
        midFreqDataRef.current = new Uint8Array(midAnalyzer.frequencyBinCount);
        
        const highAnalyzer = audioContextRef.current.createAnalyser();
        highAnalyzer.fftSize = 256;
        highFreqDataRef.current = new Uint8Array(highAnalyzer.frequencyBinCount);
        
        // Connect the audio if available
        if (audioRef.current && !sourceNodeRef.current) {
          sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          
          // Main analyzer for general frequency data
          sourceNodeRef.current.connect(analyzerRef.current);
          analyzerRef.current.connect(audioContextRef.current.destination);
          
          // Connect to frequency-specific analyzers
          sourceNodeRef.current.connect(lowPassFilter);
          lowPassFilter.connect(lowAnalyzer);
          lowAnalyzer.connect(audioContextRef.current.destination);
          
          sourceNodeRef.current.connect(bandPassFilter);
          bandPassFilter.connect(midAnalyzer);
          midAnalyzer.connect(audioContextRef.current.destination);
          
          sourceNodeRef.current.connect(highPassFilter);
          highPassFilter.connect(highAnalyzer);
          highAnalyzer.connect(audioContextRef.current.destination);
          
          setIsAudioSetup(true);
        }
      } catch (error) {
        console.error("Error setting up audio context:", error);
      }
    }
    
    return () => {
      if (audioContextRef.current) {
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
        audioContextRef.current.close();
        audioContextRef.current = null;
        sourceNodeRef.current = null;
        analyzerRef.current = null;
      }
    };
  }, [audioRef]);
  
  // Resume audio context when play state changes
  useEffect(() => {
    if (isPlaying && audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, [isPlaying]);
  
  return (
    <>
      {/* Fixed background cloud visualizer that stays in place while content scrolls */}
      <div className="fixed inset-0 z-0">
        <CloudVisualizerV2 
          isPlaying={isPlaying} 
          audioAnalyzer={analyzerRef.current}
          audioContext={audioContextRef.current}
          frequencyData={dataArrayRef.current}
          lowFreqData={lowFreqDataRef.current}
          midFreqData={midFreqDataRef.current}
          highFreqData={highFreqDataRef.current}
          isAudioSetup={isAudioSetup}
        />
      </div>
      
      {/* Overlay to enhance content visibility */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-transparent to-background/40" />
    </>
  );
} 