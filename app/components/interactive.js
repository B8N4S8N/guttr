'use client';

// This file adds interactive client-side JavaScript effects

// Set up cursor blob effect
export function setupCursorEffect() {
  if (typeof window === 'undefined') return;
  
  const cursorBlob = document.querySelector('.cursor-blob');
  if (!cursorBlob) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let blobX = 0;
  let blobY = 0;
  
  // For smooth following effect
  const speed = 0.1;
  
  const animate = () => {
    // Calculate distance between cursor and blob
    const distX = mouseX - blobX;
    const distY = mouseY - blobY;
    
    // Move blob position a percentage of the distance (for smooth following)
    blobX = blobX + (distX * speed);
    blobY = blobY + (distY * speed);
    
    // Apply the position
    cursorBlob.style.left = `${blobX}px`;
    cursorBlob.style.top = `${blobY}px`;
    
    // Continue animation
    requestAnimationFrame(animate);
  };
  
  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Add active class to body when mouse is moving
    document.body.classList.add('js-cursor-active');
  });
  
  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('js-cursor-active');
  });
  
  // Show cursor when mouse enters window
  document.addEventListener('mouseenter', () => {
    document.body.classList.add('js-cursor-active');
  });
  
  // Start the animation
  animate();
}

// Initialize when component mounts
export function initInteractivity() {
  setupCursorEffect();
} 