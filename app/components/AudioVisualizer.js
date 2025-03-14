'use client';

import { useEffect, useRef } from 'react';

export default function AudioVisualizer({ isPlaying, audioRef }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !audioRef.current) return;
    
    let animationFrameId;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const audio = audioRef.current;
    
    const setupAudio = () => {
      // Clean up existing audio context if it exists
      if (audioContextRef.current) {
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
        audioContextRef.current.close();
      }

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContextRef.current.createAnalyser();
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audio);
      
      sourceNodeRef.current.connect(analyser);
      analyser.connect(audioContextRef.current.destination);
      
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      return { analyser, dataArray };
    };
    
    let analyserData;
    
    const draw = () => {
      if (!analyserData?.analyser) return;
      
      animationFrameId = requestAnimationFrame(draw);
      analyserData.analyser.getByteFrequencyData(analyserData.dataArray);
      
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / analyserData.dataArray.length) * 2.5;
      let x = 0;
      
      for (let i = 0; i < analyserData.dataArray.length; i++) {
        const barHeight = (analyserData.dataArray[i] / 255) * canvas.height * 0.8;
        
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, `hsla(${263 + i}, 75%, 67%, 1)`);
        gradient.addColorStop(1, `hsla(${326 + i}, 100%, 60%, 0.5)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        
        x += barWidth;
      }
    };
    
    if (isPlaying) {
      analyserData = setupAudio();
      draw();
    }
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, audioRef]);

  // Clean up audio context when component unmounts
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={`mt-12 h-32 w-full max-w-3xl mx-auto transition-all duration-500 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <canvas ref={canvasRef} className="w-full h-full rounded-xl border border-primary/20 backdrop-blur-sm" />
    </div>
  );
} 