'use client';

import { useEffect, useRef, useState } from 'react';

export default function CloudVisualizer({ 
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
  // For smoothing beat responses
  const beatStrengthRef = useRef(0);
  const colorCycleRef = useRef(0);
  // For more controlled cloud pulsing
  const globalPulseRef = useRef(0);
  const baseHueRef = useRef(220); // Starting hue in the blue range
  
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
          opacity: isPlaying ? (Math.random() * 0.5 + 0.1) : 0.05, // Very faint when not playing
          speed: Math.random() * 0.5 + 0.1,
          hue: Math.random() * 60 + 220, // Initial blue to purple range
          saturation: Math.random() * 20 + 60,
          lightness: Math.random() * 20 + 10,
          // Remove continuous pulsing, only react to beats
          pulseAmount: 0,
          // Audio reactivity properties
          reactivity: Math.random() * 0.5 + 0.5, // How responsive to audio
          frequencyBand: Math.floor(Math.random() * 3), // 0=low, 1=mid, 2=high
          // For gradient revolution
          hueOffset: Math.random() * 90, // Spread out initial hues
          hueDirection: Math.random() > 0.5 ? 1 : -1, // Some rotate clockwise, others counterclockwise
          hueRevolutionSpeed: Math.random() * 0.1 + 0.05 // Base revolution speed
        });
      }
      
      particlesRef.current = particles;
      beatHistoryRef.current = [];
      highHatHistoryRef.current = [];
      baseHueRef.current = 220; // Reset base hue
      colorCycleRef.current = 0; // Reset color cycle
      beatStrengthRef.current = 0;
      globalPulseRef.current = 0;
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
  }, [isPlaying]);

  // Handle visualization drawing
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Beat detection variables - adjusted for better responsiveness
    const beatDetectionThreshold = 0.35; // More sensitive to detect beats
    const highHatDetectionThreshold = 0.30; // More sensitive to detect high hats
    const beatHistoryMax = 30;
    const minTimeBetweenBeats = 160; // ms - slightly faster to catch more beats
    const minTimeBetweenHighHats = 60; // ms - more responsive to high hats
    
    // High-hat flash variables
    let flashOpacity = 0;
    let hiHatFlashOpacity = 0;
    
    const animateParticles = (timestamp) => {
      // Clear canvas completely when not playing, or with trail effect when playing
      if (!isPlaying) {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Complete black when not playing
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Trail effect when playing
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get audio data if playing and set up
      let lowFreqAvg = 0;
      let midFreqAvg = 0;
      let highFreqAvg = 0;
      let beatDetected = false;
      let highHatDetected = false;
      let beatStrength = 0;
      let midFreqNormalized = 0;
      
      // Update time for animations
      const deltaTime = (timestamp - timeRef.current) / 1000; // Convert to seconds for smoother animation
      timeRef.current = timestamp;
      
      // Decay global pulse and beat strength more quickly to make pulses more distinct
      globalPulseRef.current *= 0.85; // Faster decay
      beatStrengthRef.current *= 0.85; // Faster decay
      
      if (isPlaying && isAudioSetup && audioAnalyzer && frequencyData) {
        try {
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
          
          // Normalize mid frequencies for gradient revolution
          midFreqNormalized = Math.min(1, midFreqAvg * 2.5);
          
          // Use specialized data for high hats if available
          if (highFreqData) {
            let highHatSum = 0;
            const highHatFreqData = new Uint8Array(highFreqData.length);
            for (let i = 0; i < highFreqData.length; i++) {
              highHatFreqData[i] = highFreqData[i];
            }
            
            // Focus more on upper frequencies (cymbal/high-hat range)
            const highHatRange = Math.floor(highHatFreqData.length * 0.7);
            for (let i = highHatRange; i < highHatFreqData.length; i++) {
              highHatSum += highHatFreqData[i];
            }
            const highHatEnergy = highHatSum / (highHatFreqData.length - highHatRange) / 255;
            
            // Track high hat history
            if (!highHatHistoryRef.current) {
              highHatHistoryRef.current = [];
            }
            highHatHistoryRef.current.push(highHatEnergy);
            if (highHatHistoryRef.current.length > beatHistoryMax) {
              highHatHistoryRef.current.shift();
            }
            
            // Calculate average high hat energy
            const avgHighHatEnergy = highHatHistoryRef.current.reduce((sum, val) => sum + val, 0) / 
                                   highHatHistoryRef.current.length;
            
            // Detect high hat: sharp increase in high frequencies
            if (highHatEnergy > avgHighHatEnergy * (1 + highHatDetectionThreshold) && 
                highHatEnergy > 0.20 && // Lower threshold to catch more high-hats
                timestamp - lastHighHatTimeRef.current > minTimeBetweenHighHats) {
              highHatDetected = true;
              lastHighHatTimeRef.current = timestamp;
              hiHatFlashOpacity = Math.min(0.8, highHatEnergy * 2.5); // Stronger flash based on energy
            }
          }
          
          // Beat detection based on bass frequencies - improved
          if (!beatHistoryRef.current) {
            beatHistoryRef.current = [];
          }
          beatHistoryRef.current.push(lowFreqAvg);
          if (beatHistoryRef.current.length > beatHistoryMax) {
            beatHistoryRef.current.shift();
          }
          
          // Calculate average energy level
          const avgEnergy = beatHistoryRef.current.reduce((sum, value) => sum + value, 0) / 
                          beatHistoryRef.current.length;
          
          // Detect beat with improved algorithm
          if (lowFreqAvg > avgEnergy * (1 + beatDetectionThreshold) && 
              lowFreqAvg > 0.30 && // Lower threshold to catch more beats
              timestamp - lastBeatTimeRef.current > minTimeBetweenBeats) {
            beatDetected = true;
            lastBeatTimeRef.current = timestamp;
            
            // Calculate beat strength for smoother transitions
            beatStrength = Math.min(1.0, (lowFreqAvg - avgEnergy) / avgEnergy * 2.0); // Increased multiplier for stronger response
            
            // Set global pulse and beat strength for beat-synchronized animations
            globalPulseRef.current = Math.min(1.0, beatStrength * 2.0); // Increased multiplier for stronger visual impact
            beatStrengthRef.current = beatStrength;
            
            // Flash opacity based on beat strength
            flashOpacity = Math.min(0.7, beatStrength * 1.0); // Stronger flash on beat
          }
        } catch (error) {
          console.error("Error processing audio data:", error);
        }
      }
      
      // Update base hue for revolving gradient - affected by mid frequencies
      if (isPlaying && isAudioSetup) {
        // Mid frequencies control the speed of hue revolution
        const revolutionSpeed = 6 * (midFreqNormalized * 0.9 + 0.1) * deltaTime;
        colorCycleRef.current = (colorCycleRef.current + revolutionSpeed) % 360;
        baseHueRef.current = (baseHueRef.current + revolutionSpeed) % 360;
      }
      
      // Only draw effects when music is playing
      if (isPlaying) {
        // Draw high hat flash (from bottom, like an under-lighting effect)
        if (highHatDetected || hiHatFlashOpacity > 0) {
          // Create a gradient from bottom to center for the high hat flash
          const hiHatGradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height * 0.6);
          hiHatGradient.addColorStop(0, `rgba(180, 240, 255, ${hiHatFlashOpacity})`);
          hiHatGradient.addColorStop(1, 'rgba(180, 240, 255, 0)');
          
          ctx.fillStyle = hiHatGradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Smoother decay for high-hat flashes
          hiHatFlashOpacity *= 0.85;
        }
        
        // Draw bass beat flash (from center, like a pulse)
        if (beatDetected || flashOpacity > 0) {
          // Create a radial gradient from center for the bass beat flash
          const beatGradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0, 
            canvas.width / 2, canvas.height / 2, canvas.width * 0.7
          );
          
          // Beat color based on current base hue
          const beatHue = (baseHueRef.current + 40) % 360;
          beatGradient.addColorStop(0, `hsla(${beatHue}, 80%, 50%, ${flashOpacity * 0.8})`);
          beatGradient.addColorStop(0.6, `hsla(${beatHue}, 80%, 40%, ${flashOpacity * 0.3})`);
          beatGradient.addColorStop(1, `hsla(${beatHue}, 80%, 30%, 0)`);
          
          ctx.fillStyle = beatGradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Smoother decay
          flashOpacity *= 0.88;
        }
        
        // Draw clouds with glow effect
        ctx.globalCompositeOperation = 'screen';
        
        if (particlesRef.current && particlesRef.current.length > 0) {
          particlesRef.current.forEach((particle, i) => {
            if (!particle) return;
            
            // Determine which frequency band affects this particle
            let frequencyInfluence = 0;
            
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
            
            // Update position with slight drift and audio reactivity
            const verticalMovement = particle.speed * 0.3; // Reduce general movement
            
            // Beat-reactive movement - stronger and more pronounced
            let beatEffect = 0;
            if (particle.frequencyBand === 0) { // Bass particles react to beats
              // Use the smooth beat strength for movement
              beatEffect = beatStrengthRef.current * 8 * particle.reactivity;
            }
            
            // High-hat reactive behavior for high frequency particles
            let highHatEffect = 0;
            if (highHatDetected && particle.frequencyBand === 2) {
              highHatEffect = hiHatFlashOpacity * 5 * particle.reactivity;
            }
            
            // Minimal movement when not on a beat
            const baseMovement = isPlaying ? 0.1 : 0.02;
            particle.x += Math.sin(timestamp * 0.0002 + i * 0.1) * (baseMovement + frequencyInfluence * 0.4);
            particle.y += (verticalMovement + beatEffect) * Math.sin(timestamp * 0.00015 + i * 0.1);
            
            // Additional horizontal movement on high-hat for some particles
            if (highHatDetected && i % 3 === 0) {
              particle.x += (Math.random() - 0.5) * highHatEffect * 6;
            }
            
            // Keep particles within bounds
            if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
            if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
            if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius;
            if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius;
            
            // Calculate pulsing size - ONLY on beat
            let pulseScale = 1.0; // Base size with no pulsing
            
            // For bass particles, add strong pulse on beat
            if (particle.frequencyBand === 0) {
              pulseScale += globalPulseRef.current * particle.reactivity * 1.5;
            } else if (particle.frequencyBand === 2 && highHatDetected) {
              // High frequency particles pulse on high-hats
              pulseScale += hiHatFlashOpacity * particle.reactivity * 0.8;
            }
            
            // Calculate particle hue with revolving gradient
            // Base particle hue follows the global color cycle
            let particleHue = (baseHueRef.current + particle.hueOffset) % 360;
            
            // Adjust revolution speed with mid frequencies - only for mid-responsive particles
            if (particle.frequencyBand === 1) {
              // Mid frequency particles adjust their revolution speed with audio
              const midAdjustment = midFreqNormalized * particle.hueRevolutionSpeed * 40 * deltaTime;
              particleHue = (particleHue + midAdjustment * particle.hueDirection) % 360;
            }
            
            // Adjust opacity based on playing state and beat
            let particleOpacity = 0.05; // Very faint when not on beat
            
            if (particle.frequencyBand === 0) {
              // Bass particles get much brighter on beat
              particleOpacity = 0.1 + (globalPulseRef.current * 0.6 * particle.reactivity);
            } else if (particle.frequencyBand === 1) {
              // Mid particles affected by mid frequencies
              particleOpacity = 0.1 + (midFreqAvg * 0.3 * particle.reactivity);
            } else if (particle.frequencyBand === 2) {
              // High particles brighter on high-hats
              particleOpacity = 0.1 + (hiHatFlashOpacity * 0.5 * particle.reactivity);
            }
            
            // Adjust lightness with audio - brighter during beats
            const baseLightness = 10;
            let beatBrightness = 0;
            let highHatBrightness = 0;
            
            if (particle.frequencyBand === 0) {
              beatBrightness = beatStrengthRef.current * 35 * particle.reactivity;
            } else if (particle.frequencyBand === 2 && highHatDetected) {
              highHatBrightness = hiHatFlashOpacity * 30 * particle.reactivity;
            }
            
            const particleLightness = baseLightness + (frequencyInfluence * 25) + beatBrightness + highHatBrightness;
            
            const radius = particle.radius * pulseScale;
            
            // Create gradient for cloud
            const gradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, radius
            );
            
            // Dynamic color with revolving gradient
            gradient.addColorStop(0, `hsla(${particleHue}, ${particle.saturation}%, ${particleLightness + 20}%, ${particleOpacity})`);
            gradient.addColorStop(0.4, `hsla(${particleHue}, ${particle.saturation}%, ${particleLightness + 10}%, ${particleOpacity * 0.8})`);
            gradient.addColorStop(1, `hsla(${particleHue}, ${particle.saturation}%, ${particleLightness}%, 0)`);
            
            // Draw cloud particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          });
        }
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
        
        // Create overlays for depth - color based on the current base hue
        const overlayHue = (baseHueRef.current + 180) % 360; // Complementary color
        const overlay = ctx.createLinearGradient(0, 0, 0, canvas.height);
        overlay.addColorStop(0, `rgba(0, 0, 30, 0.4)`);
        overlay.addColorStop(0.5, `hsla(${overlayHue}, 70%, 5%, 0.2)`);
        overlay.addColorStop(1, `rgba(0, 0, 10, 0.5)`);
        
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
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
      className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
    />
  );
} 