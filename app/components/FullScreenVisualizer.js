'use client';

import { useEffect, useRef, useState } from 'react';

export default function FullScreenVisualizer({ isPlaying, audioRef }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const [isAudioSetup, setIsAudioSetup] = useState(false);
  const dataArrayRef = useRef(null);
  const hueRotationRef = useRef(0);
  
  // Initialize audio context only once
  useEffect(() => {
    if (!audioContextRef.current && window.AudioContext) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }
    
    return () => {
      if (audioContextRef.current) {
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
        audioContextRef.current.close();
        audioContextRef.current = null;
        sourceNodeRef.current = null;
        analyserRef.current = null;
      }
    };
  }, []);
  
  // Setup audio connection when audio reference changes or on play state change
  useEffect(() => {
    if (!audioRef.current || !audioContextRef.current) return;

    const connectAudio = () => {
      if (!isAudioSetup) {
        try {
          // Only create a source node if we don't have one yet
          if (!sourceNodeRef.current) {
            sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
            sourceNodeRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
            setIsAudioSetup(true);
          }
        } catch (error) {
          console.error("Error connecting audio:", error);
        }
      }
    };

    if (isPlaying) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      connectAudio();
    }
  }, [isPlaying, audioRef, isAudioSetup]);

  // Handle visualization drawing
  useEffect(() => {
    if (!canvasRef.current || !audioRef.current || !audioContextRef.current) return;
    
    let animationFrameId;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const draw = () => {
      if (!analyserRef.current || !isPlaying || !dataArrayRef.current) return;
      
      animationFrameId = requestAnimationFrame(draw);
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      // Calculate average frequency for color shifts
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        sum += dataArrayRef.current[i];
      }
      const average = sum / dataArrayRef.current.length;
      
      // Slowly rotate base hue over time, accelerate rotation on beats
      hueRotationRef.current = (hueRotationRef.current + 0.2 + (average / 255) * 0.8) % 360;
      
      // Create gradient background that shifts with the music
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0, 
        canvas.width / 2, 
        canvas.height / 2, 
        canvas.width * 0.8
      );
      
      gradient.addColorStop(0, `hsla(${hueRotationRef.current}, 80%, 60%, 0.2)`);
      gradient.addColorStop(0.5, `hsla(${(hueRotationRef.current + 40) % 360}, 100%, 50%, 0.1)`);
      gradient.addColorStop(1, `hsla(${(hueRotationRef.current + 80) % 360}, 100%, 40%, 0.05)`);
      
      // Partially clear the canvas with gradient to create a motion trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Lower alpha for longer trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle background gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw flowing particles
      const particleCount = 100;
      const bassLevel = dataArrayRef.current.slice(0, 10).reduce((a, b) => a + b, 0) / 2550; // Bass response 0-1
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const intensity = dataArrayRef.current[Math.floor(i / particleCount * dataArrayRef.current.length)] / 255;
        
        const dist = ((bassLevel * 0.5) + (intensity * 0.5)) * Math.min(canvas.width, canvas.height) * 0.4;
        
        const x = canvas.width / 2 + Math.cos(angle + hueRotationRef.current / 30) * dist;
        const y = canvas.height / 2 + Math.sin(angle + hueRotationRef.current / 30) * dist;
        
        const size = 2 + intensity * 8;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(hueRotationRef.current + i * 3) % 360}, 100%, 70%, ${0.1 + intensity * 0.6})`;
        ctx.fill();
      }
      
      // Draw flowing gaussian blur-like patterns
      ctx.globalCompositeOperation = 'screen';
      
      for (let i = 0; i < 5; i++) {
        const freqIndex = Math.floor(dataArrayRef.current.length / 5 * i);
        const intensity = dataArrayRef.current[freqIndex] / 255;
        
        const centerX = canvas.width / 2 + Math.cos(hueRotationRef.current / 20 + i) * canvas.width * 0.3 * intensity;
        const centerY = canvas.height / 2 + Math.sin(hueRotationRef.current / 20 + i) * canvas.height * 0.3 * intensity;
        
        const radius = 50 + intensity * 100;
        
        const glow = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        
        glow.addColorStop(0, `hsla(${(hueRotationRef.current + i * 60) % 360}, 100%, 70%, ${0.1 + intensity * 0.3})`);
        glow.addColorStop(1, `hsla(${(hueRotationRef.current + i * 60) % 360}, 100%, 60%, 0)`);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }
      
      ctx.globalCompositeOperation = 'source-over';
      
      // Optional: Add subtle wave at the bottom that reacts to lower frequencies
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      const waveSegments = 40;
      const waveWidth = canvas.width / waveSegments;
      
      for (let i = 0; i <= waveSegments; i++) {
        const x = i * waveWidth;
        const waveIndex = Math.floor(i / waveSegments * 30); // Use just bass/mid frequencies
        const amplitude = dataArrayRef.current[waveIndex] / 255 * 50;
        const y = canvas.height - amplitude - 5;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Use quadratic curves for smoother waves
          const prevX = (i - 1) * waveWidth;
          const cpX = (prevX + x) / 2;
          ctx.quadraticCurveTo(cpX, canvas.height - dataArrayRef.current[Math.floor((i - 0.5) / waveSegments * 30)] / 255 * 50 - 5, x, y);
        }
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      
      const waveGradient = ctx.createLinearGradient(0, canvas.height - 60, 0, canvas.height);
      waveGradient.addColorStop(0, `hsla(${hueRotationRef.current}, 80%, 60%, 0.1)`);
      waveGradient.addColorStop(1, `hsla(${hueRotationRef.current}, 80%, 60%, 0.02)`);
      
      ctx.fillStyle = waveGradient;
      ctx.fill();
    };
    
    if (isPlaying) {
      draw();
    }
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, audioRef, isAudioSetup]);

  return (
    <>
      {/* Fixed position canvas for the visualization */}
      <canvas 
        ref={canvasRef} 
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Dark overlay for better contrast */}
      <div className={`fixed inset-0 z-0 bg-black opacity-15 transition-opacity duration-700 ${isPlaying ? 'opacity-15' : 'opacity-0'}`}></div>
      
      {/* Glassmorphism overlay */}
      <div className={`fixed inset-0 z-0 backdrop-blur-[60px] backdrop-saturate-[1.8] bg-black/15 transition-opacity duration-700 ${isPlaying ? 'opacity-80' : 'opacity-0'}`}></div>
    </>
  );
} 