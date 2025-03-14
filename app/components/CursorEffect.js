'use client';

import { useEffect, useState } from 'react';

export default function CursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Don't run on server
    if (typeof window === 'undefined') return;

    let cursorX = 0;
    let cursorY = 0;
    let blobX = 0;
    let blobY = 0;

    // For smooth following effect
    const speed = 0.1;

    const handleMouseMove = (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      if (!isActive) setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    const handleMouseEnter = () => {
      setIsActive(true);
    };

    // Add hover detection for interactive elements
    const handleElementHover = () => {
      setIsHovering(true);
    };

    const handleElementLeave = () => {
      setIsHovering(false);
    };

    // Add class to body for global CSS effects
    if (isActive) {
      document.body.classList.add('js-cursor-active');
    } else {
      document.body.classList.remove('js-cursor-active');
    }

    // Add hover detection for buttons and links
    const interactiveElements = document.querySelectorAll('a, button, .suno-card');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleElementHover);
      element.addEventListener('mouseleave', handleElementLeave);
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animation loop for smooth cursor following
    const animateCursor = () => {
      // Calculate distance between cursor and blob
      const distX = cursorX - blobX;
      const distY = cursorY - blobY;
      
      // Move blob position a percentage of the distance (for smooth following)
      blobX = blobX + (distX * speed);
      blobY = blobY + (distY * speed);
      
      // Update position state
      setPosition({ x: blobX, y: blobY });
      
      // Continue animation
      requestAnimationFrame(animateCursor);
    };

    // Start animation
    const animationId = requestAnimationFrame(animateCursor);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('js-cursor-active');
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleElementHover);
        element.removeEventListener('mouseleave', handleElementLeave);
      });

      cancelAnimationFrame(animationId);
    };
  }, [isActive]);

  // Scale the blob when hovering over interactive elements
  const blobSize = isHovering ? 200 : 160;

  return (
    <div 
      className="cursor-blob" 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        opacity: isActive ? 1 : 0,
        width: `${blobSize}px`,
        height: `${blobSize}px`,
        transition: 'width 0.3s ease, height 0.3s ease',
      }} 
    />
  );
} 