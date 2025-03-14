'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-3 bg-background/80 backdrop-blur-md border-b border-border/50' : 'py-5'
    }`}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-black text-primary mr-10">
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary">GUTTR</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/artists" className="text-foreground/80 hover:text-primary transition-colors">
                Artists
              </Link>
              <Link href="/tracks" className="text-foreground/80 hover:text-primary transition-colors">
                Tracks
              </Link>
              <Link href="/albums" className="text-foreground/80 hover:text-primary transition-colors">
                Albums
              </Link>
              <Link href="/marketplace" className="text-foreground/80 hover:text-primary transition-colors">
                Marketplace
              </Link>
              <Link href="/radio" className="text-foreground/80 hover:text-primary transition-colors">
                Radio
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-105"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 