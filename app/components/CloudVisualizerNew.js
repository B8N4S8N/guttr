'use client';

import { useEffect, useRef, useState } from 'react';

export default function CloudVisualizerNew({ 
  isPlaying, 
  audioAnalyzer, 
  audioContext, 
  frequencyData, 
  lowFreqData, 
  midFreqData, 
  highFreqData, 
  isAudioSetup 
}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const requestRef = useRef(null);
  const timeRef = useRef(0);
  const beatHistoryRef = useRef([]);
  const highHatHistoryRef = useRef([]);
  const lastBeatTimeRef = useRef(0);
  const lastHighHatTimeRef = useRef(0);
  
  // Initialize cloud particles
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Define the initializeParticles function first
    const initializeParticles = () => {
      const particles = [];
      const particleCount = 100;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 60 + 20,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 0.5 + 0.1,
          hue: Math.random() * 60 + 220, // Blue to purple range
          saturation: Math.random() * 20 + 60,
          lightness: Math.random() * 20 + 10,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseAmount: Math.random() * 0.3 + 0.1,
          pulseOffset: Math.random() * Math.PI * 2,
          // Add audio reactivity properties
          reactivity: Math.random() * 0.5 + 0.5, // How responsive to audio
          frequencyBand: Math.floor(Math.random() * 3), // 0=low, 1=mid, 2=high
        });
      }
      
      particlesRef.current = particles;
      beatHistoryRef.current = [];
      highHatHistoryRef.current = [];
    };
    
    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reset particles on resize
      initializeParticles();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Handle visualization drawing
  useEffect(() => {
    if (!canvasRef.current) return;
    if (!isPlaying && !requestRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Beat detection variables
    const beatDetectionThreshold = 0.45;
    const highHatDetectionThreshold = 0.4;
    const beatHistoryMax = 30;
    const minTimeBetweenBeats = 200; // ms
    const minTimeBetweenHighHats = 80; // ms
    
    // High-hat flash variables
    let flashOpacity = 0;
    let hiHatFlashOpacity = 0;
    
    const animateParticles = (timestamp) => {
      // Clear canvas with slight transparency for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get audio data if playing and set up
      let lowFreqAvg = 0;
      let midFreqAvg = 0;
      let highFreqAvg = 0;
      let beatDetected = false;
      let highHatDetected = false;
      
      if (isPlaying && isAudioSetup && audioAnalyzer && frequencyData) {
        // Update frequency data arrays
        audioAnalyzer.getByteFrequencyData(frequencyData);
        
        // Calculate averages from the main frequency data
        const bassEnd = Math.floor(frequencyData.length * 0.1);
        const midEnd = Math.floor(frequencyData.length * 0.5);
        
        let lowSum = 0, midSum = 0, highSum = 0;
        
        for (let i = 0; i < bassEnd; i++) {
          lowSum += frequencyData[i];
        }
        
        for (let i = bassEnd; i < midEnd; i++) {
          midSum += frequencyData[i];
        }
        
        for (let i = midEnd; i < frequencyData.length; i++) {
          highSum += frequencyData[i];
        }
        
        lowFreqAvg = lowSum / bassEnd / 255;
        midFreqAvg = midSum / (midEnd - bassEnd) / 255;
        highFreqAvg = highSum / (frequencyData.length - midEnd) / 255;
        
        // Use specialized data for high hats if available
        if (highFreqData) {
          let highHatSum = 0;
          for (let i = highFreqData.length - 20; i < highFreqData.length; i++) {
            highHatSum += highFreqData[i];
          }
          const highHatEnergy = highHatSum / 20 / 255;
          
          // Track high hat history
          highHatHistoryRef.current.push(highHatEnergy);
          if (highHatHistoryRef.current.length > beatHistoryMax) {
            highHatHistoryRef.current.shift();
          }
          
          // Calculate average high hat energy
          const avgHighHatEnergy = highHatHistoryRef.current.reduce((sum, val) => sum + val, 0) / 
                                 highHatHistoryRef.current.length;
          
          // Detect high hat: sharp increase in high frequencies
          if (highHatEnergy > avgHighHatEnergy * (1 + highHatDetectionThreshold) && 
              highHatEnergy > 0.3 && 
              timestamp - lastHighHatTimeRef.current > minTimeBetweenHighHats) {
            highHatDetected = true;
            lastHighHatTimeRef.current = timestamp;
            hiHatFlashOpacity = Math.min(0.7, highHatEnergy * 1.5); // Flash intensity based on energy
          }
        }
        
        // Beat detection based on bass frequencies
        beatHistoryRef.current.push(lowFreqAvg);
        if (beatHistoryRef.current.length > beatHistoryMax) {
          beatHistoryRef.current.shift();
        }
        
        // Calculate average energy level
        const avgEnergy = beatHistoryRef.current.reduce((sum, value) => sum + value, 0) / 
                        beatHistoryRef.current.length;
        
        // Detect beat: current energy significantly above average + minimum time passed since last beat
        if (lowFreqAvg > avgEnergy * (1 + beatDetectionThreshold) && 
            lowFreqAvg > 0.4 && 
            timestamp - lastBeatTimeRef.current > minTimeBetweenBeats) {
          beatDetected = true;
          lastBeatTimeRef.current = timestamp;
          flashOpacity = Math.min(0.5, lowFreqAvg); // Flash intensity based on beat strength
        }
      }
      
      // Update time for ambient animation when not playing
      const deltaTime = timestamp - timeRef.current;
      timeRef.current = timestamp;
      
      // Draw high hat flash (from bottom, like an under-lighting effect)
      if (highHatDetected || hiHatFlashOpacity > 0) {
        // Create a gradient from bottom to center for the high hat flash
        const hiHatGradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height * 0.7);
        hiHatGradient.addColorStop(0, `rgba(150, 240, 255, ${hiHatFlashOpacity})`);
        hiHatGradient.addColorStop(1, 'rgba(150, 240, 255, 0)');
        
        ctx.fillStyle = hiHatGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Decay the flash
        hiHatFlashOpacity *= 0.8;
      }
      
      // Draw bass beat flash (from center, like a pulse)
      if (beatDetected || flashOpacity > 0) {
        // Create a radial gradient from center for the bass beat flash
        const beatGradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0, 
          canvas.width / 2, canvas.height / 2, canvas.width * 0.7
        );
        beatGradient.addColorStop(0, `rgba(120, 70, 200, ${flashOpacity * 0.7})`);
        beatGradient.addColorStop(0.6, `rgba(120, 70, 200, ${flashOpacity * 0.2})`);
        beatGradient.addColorStop(1, 'rgba(120, 70, 200, 0)');
        
        ctx.fillStyle = beatGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Decay the flash
        flashOpacity *= 0.85;
      }
      
      // Draw clouds with glow effect
      ctx.globalCompositeOperation = 'screen';
      
      particlesRef.current.forEach((particle, i) => {
        // Determine which frequency band affects this particle
        let frequencyInfluence = 0;
        if (isPlaying && isAudioSetup) {
          switch(particle.frequencyBand) {
            case 0: // Bass responsive
              frequencyInfluence = lowFreqAvg * particle.reactivity;
              break;
            case 1: // Mid responsive
              frequencyInfluence = midFreqAvg * particle.reactivity;
              break;
            case 2: // High responsive
              frequencyInfluence = highFreqAvg * particle.reactivity;
              break;
          }
        }
        
        // Update position with slight drift and audio reactivity
        const verticalMovement = particle.speed;
        
        // Beat-reactive movement
        let beatEffect = 0;
        if (beatDetected && particle.frequencyBand === 0) { // Bass particles react to beats
          beatEffect = lowFreqAvg * 7;
        }
        
        // High-hat reactive behavior for high frequency particles
        let highHatEffect = 0;
        if (highHatDetected && particle.frequencyBand === 2) {
          highHatEffect = highFreqAvg * 4;
        }
        
        particle.x += Math.sin(timestamp * 0.0003 + i) * (0.3 + frequencyInfluence * 0.5);
        particle.y += (verticalMovement + beatEffect) * Math.sin(timestamp * 0.0002 + i * 0.1);
        
        // Additional horizontal movement on high-hat for some particles
        if (highHatDetected && i % 5 === 0) {
          particle.x += (Math.random() - 0.5) * highHatEffect * 8;
        }
        
        // Keep particles within bounds
        if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
        if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
        if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius;
        if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius;
        
        // Calculate pulsing size based on audio or time
        const pulseTime = timestamp * particle.pulseSpeed + particle.pulseOffset;
        let pulseScale = 1 + Math.sin(pulseTime) * particle.pulseAmount;
        
        // Adjust with audio reactivity
        if (isPlaying && isAudioSetup) {
          // Different frequency influence based on particle type
          if (particle.frequencyBand === 0) { // Bass-responsive particles
            pulseScale += lowFreqAvg * (beatDetected ? 1.5 : 0.8);
            // Change hue toward red during beats
            if (beatDetected) {
              particle.hue = Math.max(220, particle.hue - 20);
            } else {
              // Gradually return to blue range
              particle.hue = Math.min(280, particle.hue + 0.5);
            }
          } else if (particle.frequencyBand === 1) { // Mid-frequency responsive
            pulseScale += midFreqAvg * 0.6;
          } else { // High-frequency responsive
            pulseScale += highFreqAvg * 0.5;
            // Briefly brighten on high-hats
            if (highHatDetected) {
              particle.lightness += 15;
            }
          }
          
          // Adjust lightness with audio - brighter during beats
          particle.lightness = 10 + (lowFreqAvg * 30) + (beatDetected ? 15 : 0) + (highHatDetected && particle.frequencyBand === 2 ? 20 : 0);
        } else {
          // In ambient mode, gradually return to default lightness
          particle.lightness = 10 + Math.sin(timestamp * 0.001 + i) * 5;
        }
        
        const radius = particle.radius * pulseScale;
        
        // Create gradient for cloud
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, radius
        );
        
        // Thundercloud effect - more blue/purple when audio is active
        gradient.addColorStop(0, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + 20}%, ${particle.opacity * pulseScale})`);
        gradient.addColorStop(0.4, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + 10}%, ${particle.opacity * 0.8 * pulseScale})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, 0)`);
        
        // Draw cloud particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
      
      // Create overlays for depth
      const overlay = ctx.createLinearGradient(0, 0, 0, canvas.height);
      overlay.addColorStop(0, 'rgba(0, 0, 30, 0.4)');
      overlay.addColorStop(0.5, 'rgba(0, 0, 20, 0.2)');
      overlay.addColorStop(1, 'rgba(0, 0, 10, 0.5)');
      
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      requestRef.current = requestAnimationFrame(animateParticles);
    };
    
    requestRef.current = requestAnimationFrame(animateParticles);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isPlaying, isAudioSetup, audioAnalyzer, frequencyData, highFreqData]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-80'}`}
    />
  );
} 