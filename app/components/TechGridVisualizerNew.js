'use client';

import { useEffect, useRef, useState } from 'react';

export default function TechGridVisualizerNew({ 
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
  const gridNodesRef = useRef([]);
  const gridLinesRef = useRef([]);
  const requestRef = useRef(null);
  const timeRef = useRef(0);
  const beatHistoryRef = useRef([]);
  const lastBeatTimeRef = useRef(0);
  
  // Generate tech grid
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Define initializeGrid function first before it's used
    const initializeGrid = () => {
      const nodes = [];
      const lines = [];
      
      // Create a grid of nodes
      const nodeSpacingX = 100;
      const nodeSpacingY = 100;
      const noiseOffset = 30; // Random offset for organic feel
      
      const cols = Math.ceil(canvas.width / nodeSpacingX) + 2;
      const rows = Math.ceil(canvas.height / nodeSpacingY) + 2;
      
      // Generate nodes
      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const x = col * nodeSpacingX + (Math.random() * noiseOffset - noiseOffset/2);
          const y = row * nodeSpacingY + (Math.random() * noiseOffset - noiseOffset/2);
          
          nodes.push({
            x,
            y,
            size: Math.random() * 3 + 1,
            pulseSpeed: Math.random() * 0.005 + 0.001,
            pulseAmount: Math.random() * 0.5 + 0.5,
            pulseOffset: Math.random() * Math.PI * 2,
            active: Math.random() > 0.7, // Some nodes start active
            activationThreshold: Math.random() * 0.3 + 0.1, // Lower threshold = more reactive
            activeDuration: 0,
            color: `hsl(${Math.random() * 60 + 180}, 70%, 50%)`, // Cyan to blue
            opacity: Math.random() * 0.5 + 0.1,
            row,
            col,
            // Audio reactivity properties
            frequencyBand: Math.floor(Math.random() * 3), // 0=low, 1=mid, 2=high
            reactivity: Math.random() * 0.5 + 0.3, // How responsive to audio
          });
        }
      }
      
      // Generate connections between nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Connect to right neighbor
        const rightNeighbor = nodes.find(n => n.row === node.row && n.col === node.col + 1);
        if (rightNeighbor) {
          lines.push({
            from: i,
            to: nodes.indexOf(rightNeighbor),
            width: Math.random() * 0.7 + 0.3,
            active: false,
            activeProgress: 0,
            speed: Math.random() * 0.02 + 0.005,
            activationThreshold: Math.random() * 0.2 + 0.1,
            vertical: false,
            // Audio reactivity properties
            frequencyBand: Math.floor(Math.random() * 3),
            reactivity: Math.random() * 0.5 + 0.3,
          });
        }
        
        // Connect to bottom neighbor
        const bottomNeighbor = nodes.find(n => n.row === node.row + 1 && n.col === node.col);
        if (bottomNeighbor) {
          lines.push({
            from: i,
            to: nodes.indexOf(bottomNeighbor),
            width: Math.random() * 0.7 + 0.3,
            active: false,
            activeProgress: 0,
            speed: Math.random() * 0.02 + 0.005,
            activationThreshold: Math.random() * 0.2 + 0.1,
            vertical: true,
            // Audio reactivity properties
            frequencyBand: Math.floor(Math.random() * 3),
            reactivity: Math.random() * 0.5 + 0.3,
          });
        }
      }
      
      gridNodesRef.current = nodes;
      gridLinesRef.current = lines;
      beatHistoryRef.current = [];
    };
    
    // Set canvas to full screen - using initializeGrid after it's defined
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reset grid on resize
      initializeGrid();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Beat detection variables
    const beatDetectionThreshold = 0.45;
    const beatHistoryMax = 30;
    const minTimeBetweenBeats = 200; // ms
    
    const animateGrid = (timestamp) => {
      if (!gridNodesRef.current.length || !gridLinesRef.current.length) {
        requestRef.current = requestAnimationFrame(animateGrid);
        return;
      }
      
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get audio data if playing
      let lowFreqAvg = 0;
      let midFreqAvg = 0;
      let highFreqAvg = 0;
      let beatDetected = false;
      
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
        
        // Use specialized data if available
        if (lowFreqData && midFreqData && highFreqData) {
          // We could use these for more detailed analysis
          // But for now we'll stick with the main frequency data
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
        }
      }
      
      // Update time for ambient animation when not playing
      const deltaTime = timestamp - timeRef.current;
      timeRef.current = timestamp;
      
      // Ambient activation when not playing or playing at low levels
      let ambientActivationChance = 0.001;
      if (!isPlaying) {
        ambientActivationChance = 0.0005;
      }
      
      // Global beat effect that affects multiple nodes/lines
      if (beatDetected) {
        // On beat detection, activate a group of nodes in a wave pattern from center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        const activateRadius = Math.random() * 300 + 200;
        
        // Activate nodes in the radius
        gridNodesRef.current.forEach((node) => {
          const dx = node.x - centerX;
          const dy = node.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < activateRadius && Math.random() > 0.3) {
            node.active = true;
            node.activeDuration = 0;
            // Add a beat-specific property for extra visual effect
            node.beatActivated = true;
          }
        });
        
        // Activate a bunch of random lines too
        const lineActivationCount = Math.floor(Math.random() * 20) + 10;
        for (let i = 0; i < lineActivationCount; i++) {
          const randomLineIndex = Math.floor(Math.random() * gridLinesRef.current.length);
          const line = gridLinesRef.current[randomLineIndex];
          if (!line.active) {
            line.active = true;
            line.activeProgress = 0;
            line.beatActivated = true;
          }
        }
      }
      
      // Update grid nodes
      gridNodesRef.current.forEach((node, i) => {
        // Update pulse
        const pulseTime = timestamp * node.pulseSpeed + node.pulseOffset;
        let pulseFactor = 1 + Math.sin(pulseTime) * node.pulseAmount * 0.3;
        
        // If playing, add audio reactivity
        if (isPlaying && isAudioSetup) {
          // Different frequencies affect different nodes
          let freqValue = 0;
          switch(node.frequencyBand) {
            case 0: // Low frequencies
              freqValue = lowFreqAvg;
              break;
            case 1: // Mid frequencies
              freqValue = midFreqAvg;
              break;
            case 2: // High frequencies
              freqValue = highFreqAvg;
              break;
          }
          
          // Apply frequency influence based on node's reactivity
          pulseFactor += freqValue * node.reactivity * (beatDetected ? 1.5 : 0.8);
          
          // Randomly activate nodes based on audio levels with higher chance during beats
          if (!node.active) {
            const activationChance = node.activationThreshold * freqValue * (beatDetected ? 0.5 : 0.15);
            if (Math.random() < activationChance) {
              node.active = true;
              node.activeDuration = 0;
            }
          }
        } else {
          // Ambient mode - occasionally activate nodes
          if (!node.active && Math.random() < ambientActivationChance) {
            node.active = true;
            node.activeDuration = 0;
          }
        }
        
        // Update active nodes
        if (node.active) {
          node.activeDuration += deltaTime / 1000;
          
          // After a random duration, deactivate
          const maxDuration = beatDetected ? 1.5 : (Math.random() * 1 + 0.5);
          if (node.activeDuration > maxDuration) {
            node.active = false;
            node.beatActivated = false;
          }
        }
        
        // Draw node
        const baseOpacity = node.active ? 0.8 : node.opacity;
        // Larger size during beat for beat-activated nodes
        const beatSizeBoost = (node.beatActivated && beatDetected) ? 2 : 1;
        const baseSize = node.size * pulseFactor * beatSizeBoost;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, baseSize, 0, Math.PI * 2);
        
        // Node color influenced by frequency if playing
        let nodeColor = node.color;
        if (isPlaying && isAudioSetup) {
          const hue = parseInt(nodeColor.match(/hsl\((\d+)/)[1]);
          
          // More dramatic hue shift during beats or for active nodes
          let hueShift = 0;
          if (node.active) {
            hueShift = Math.floor(highFreqAvg * 30);
            if (beatDetected && node.beatActivated) {
              hueShift = Math.floor(highFreqAvg * 60);
            }
          }
          
          const newHue = ((hue + hueShift) % 60) + 180;
          
          // Brighter during beats
          let brightness = 50;
          if (node.active) {
            brightness += 20 * lowFreqAvg + (beatDetected && node.beatActivated ? 20 : 0);
          }
          
          nodeColor = `hsl(${newHue}, 70%, ${brightness}%)`;
        }
        
        ctx.fillStyle = node.active 
          ? nodeColor.replace(')', `, ${baseOpacity})`) 
          : nodeColor.replace(')', `, ${baseOpacity * 0.4})`);
        
        ctx.fill();
        
        // Add glow to active nodes, stronger for beat-activated
        if (node.active) {
          const glowIntensity = node.beatActivated ? 20 : 10;
          ctx.shadowBlur = glowIntensity;
          ctx.shadowColor = nodeColor;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      
      // Update and draw lines
      gridLinesRef.current.forEach(line => {
        const fromNode = gridNodesRef.current[line.from];
        const toNode = gridNodesRef.current[line.to];
        
        // Check if either end nodes are active
        const nodeActivation = fromNode.active || toNode.active;
        
        // Audio reactivity for lines
        if (isPlaying && isAudioSetup) {
          // Lines get activated by nodes or directly by music
          let freqValue = 0;
          switch(line.frequencyBand) {
            case 0: // Low frequencies
              freqValue = lowFreqAvg;
              break;
            case 1: // Mid frequencies
              freqValue = midFreqAvg;
              break;
            case 2: // High frequencies
              freqValue = highFreqAvg;
              break;
          }
          
          const activationChance = line.activationThreshold * freqValue * line.reactivity * (beatDetected ? 0.8 : 0.3);
          if (!line.active && (nodeActivation || Math.random() < activationChance)) {
            line.active = true;
            line.activeProgress = 0;
          }
        } else {
          // Ambient mode - lines get activated by nodes
          if (!line.active && nodeActivation && Math.random() < 0.1) {
            line.active = true;
            line.activeProgress = 0;
          }
        }
        
        // Update line progress
        if (line.active) {
          let speedMultiplier = 1;
          
          // Music affects speed - faster during beats
          if (isPlaying && isAudioSetup) {
            let freqInfluence = 0;
            switch(line.frequencyBand) {
              case 0:
                freqInfluence = lowFreqAvg;
                break;
              case 1:
                freqInfluence = midFreqAvg;
                break;
              case 2:
                freqInfluence = highFreqAvg;
                break;
            }
            
            speedMultiplier = 1 + (freqInfluence * line.reactivity) + (beatDetected && line.beatActivated ? 1 : 0);
          }
          
          line.activeProgress += line.speed * speedMultiplier;
          
          if (line.activeProgress >= 1) {
            line.activeProgress = 0;
            line.active = false;
            line.beatActivated = false;
          }
        }
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Set line style based on active state
        const baseWidth = line.width * (line.vertical ? 0.8 : 1);
        const beatWidthMultiplier = (beatDetected && line.beatActivated) ? 3 : 2;
        ctx.lineWidth = line.active ? baseWidth * beatWidthMultiplier : baseWidth;
        
        if (line.active) {
          // Create pulsing light effect for active lines
          const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
          
          // The gradient represents the pulse moving along the line
          gradient.addColorStop(Math.max(0, line.activeProgress - 0.1), 'rgba(0, 0, 0, 0)');
          
          // Brighter color during beats
          const pulseOpacity = (beatDetected && line.beatActivated) ? 1.0 : 0.8;
          const pulseColor = (beatDetected && line.beatActivated) ? 
            `rgba(80, 210, 255, ${pulseOpacity})` : 
            `rgba(40, 200, 255, ${pulseOpacity})`;
            
          gradient.addColorStop(line.activeProgress, pulseColor);
          gradient.addColorStop(Math.min(1, line.activeProgress + 0.1), 'rgba(0, 0, 0, 0)');
          
          ctx.strokeStyle = gradient;
          ctx.lineCap = 'round';
          
          // Add glow effect - stronger during beats
          const glowIntensity = (beatDetected && line.beatActivated) ? 10 : 5;
          ctx.shadowBlur = glowIntensity;
          ctx.shadowColor = 'rgba(40, 200, 255, 0.8)';
        } else {
          // Inactive lines are darker
          ctx.strokeStyle = `rgba(30, 40, 50, ${isPlaying && isAudioSetup ? 0.4 : 0.2})`;
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
      
      // Add overlay vignette for depth
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      requestRef.current = requestAnimationFrame(animateGrid);
    };
    
    requestRef.current = requestAnimationFrame(animateGrid);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isPlaying, isAudioSetup, audioAnalyzer, frequencyData, lowFreqData, midFreqData, highFreqData]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 transition-opacity duration-1000"
      style={{ opacity: 0.9 }}
    />
  );
} 