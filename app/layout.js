'use client';

import { useEffect } from 'react';
import './globals.css';
import './suno-style.css';
import { initInteractivity } from './components/interactive';
import CursorEffect from './components/CursorEffect';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize interactive effects when component mounts
    initInteractivity();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>GUTTR - Stream. Create. Earn.</title>
        <meta name="description" content="GUTTR - The next generation music platform empowering artists and fans." />
      </head>
      <body>
        <CursorEffect />
        {children}
      </body>
    </html>
  );
}
