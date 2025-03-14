'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Navigation from './components/Navigation';
import CombinedVisualizer from './components/CombinedVisualizer';
import AudioPlayer from './components/AudioPlayer';
import CursorEffect from './components/CursorEffect';

export default function HomePage() {
  const [typedText, setTypedText] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  const features = [
    {
      title: "Artist & Listener Ownership",
      description: "Unlike traditional platforms, GUTTR is co-owned by both artists and listeners. Every stream generates ownership tokens that give you a real stake in the platform's success.",
      icon: "🏛️",
    },
    {
      title: "Royalty Revolution",
      description: "We automatically distribute royalties to both creators and active listeners. The more you contribute, the more you earn—whether you're making music or discovering it.",
      icon: "💰",
    },
    {
      title: "Fan-Created Merchandise",
      description: "Talented fans can design merch for their favorite artists. When sold, profits are automatically split between the artist, designer, and platform.",
      icon: "👕",
    },
    {
      title: "Direct Distribution",
      description: "Publish your music once and we'll distribute it across all major platforms while ensuring you retain your rights and maximize your earnings.",
      icon: "🚀",
    },
    {
      title: "Community Curation",
      description: "Our algorithm rewards listeners who discover great music early. Become a tastemaker and earn from your musical instincts.",
      icon: "✨",
    },
    {
      title: "Beat Marketplace",
      description: "Producers can sell beats directly to artists with smart contracts that automatically handle royalty splits when songs are published.",
      icon: "🎹",
    },
  ];

  const stats = [
    { value: "100%", label: "Artist Rights Retained", description: "You maintain complete ownership of your creative work while accessing our global distribution network." },
    { value: "50/50", label: "Platform-Creator Revenue Split", description: "We believe in fair compensation. Half of all platform revenue goes directly to creators and active listeners." },
    { value: "24/7", label: "Global Audience Access", description: "Reach fans worldwide with our seamless distribution to all major streaming platforms and social channels." },
  ];

  // Fetch audio tracks from the API
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/audio');
        if (!response.ok) {
          throw new Error('Failed to fetch tracks');
        }
        const data = await response.json();
        
        if (data.tracks && data.tracks.length > 0) {
          setSongs(data.tracks);
        } else {
          // Fallback in case no tracks are found
          setSongs([
            { title: "Demo Track 1", artist: "GUTTR Artist", file: "/audio/demo-track.mp3" },
            { title: "Demo Track 2", artist: "GUTTR Artist", file: "/audio/demo-track-2.mp3" },
            { title: "Demo Track 3", artist: "GUTTR Artist", file: "/audio/demo-track-3.mp3" },
          ]);
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
        // Fallback to default tracks
        setSongs([
          { title: "Demo Track 1", artist: "GUTTR Artist", file: "/audio/demo-track.mp3" },
          { title: "Demo Track 2", artist: "GUTTR Artist", file: "/audio/demo-track-2.mp3" },
          { title: "Demo Track 3", artist: "GUTTR Artist", file: "/audio/demo-track-3.mp3" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTracks();
  }, []);

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (scrollPosition < windowHeight * 0.5) {
        setActiveSection('hero');
      } else if (scrollPosition < windowHeight * 1.5) {
        setActiveSection('features');
      } else if (scrollPosition < windowHeight * 2.5) {
        setActiveSection('how-it-works');
      } else {
        setActiveSection('join');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter effect for the hero title
  useEffect(() => {
    const phrases = [
      "Music Ownership Reimagined.",
      "Create. Stream. Own.",
      "Your Music. Your Platform.",
      "Listeners Earn Too."
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimer;
    
    const type = () => {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        // Deleting text
        setTypedText(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
      } else {
        // Typing text
        setTypedText(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
      }
      
      // Speed adjustments
      let typeSpeed = isDeleting ? 50 : 120;
      
      // If we've typed the full phrase, start deleting after a pause
      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at the end of typing
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Move to next phrase after deleting
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        // Pause before starting new phrase
        typeSpeed = 500;
      }
      
      typeTimer = setTimeout(type, typeSpeed);
    };
    
    // Start the effect
    typeTimer = setTimeout(type, 1000);
    
    // Clean up
    return () => clearTimeout(typeTimer);
  }, []);

  // Toggle play function
  const togglePlay = useCallback(() => {
    if (!audioRef.current || songs.length === 0) return;
    
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioPlaying(true);
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            setAudioPlaying(false);
          });
      }
    }
  }, [audioPlaying, songs.length]);

  const skipForward = useCallback(() => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  }, [songs.length]);

  const skipBackward = useCallback(() => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  }, [songs.length]);

  // Handle audio events
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleError = (e) => {
      console.error("Audio error:", e);
      setAudioPlaying(false);
    };
    
    const handleEnded = () => {
      // When a song ends, automatically play the next one
      skipForward();
    };
    
    // Store reference to avoid the cleanup function using a stale ref
    const audioElement = audioRef.current;
    
    audioElement.addEventListener('error', handleError);
    audioElement.addEventListener('ended', handleEnded);
    
    return () => {
      // Use the stored reference in cleanup
      audioElement.removeEventListener('error', handleError);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [skipForward]);

  // Update audio src when song changes
  useEffect(() => {
    if (!audioRef.current || songs.length === 0) return;
    
    // Load new track without attempting to play immediately
    const loadNewTrack = () => {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.pause(); // Always pause first
      
      // Wait a moment before changing src to avoid race conditions
      setTimeout(() => {
        audioRef.current.src = songs[currentSongIndex].file;
        audioRef.current.load(); // Explicitly load the new audio
        
        // Set loop to false to ensure it plays the whole song
        audioRef.current.loop = false;
        
        // Only play after a brief delay if it was playing before
        if (wasPlaying) {
          setTimeout(() => {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setAudioPlaying(true);
                })
                .catch(error => {
                  console.error("Error playing audio after track change:", error);
                  setAudioPlaying(false);
                });
            }
          }, 300);
        }
      }, 100);
    };
    
    loadNewTrack();
  }, [currentSongIndex, songs]);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Visualizer */}
      <CombinedVisualizer isPlaying={audioPlaying} audioRef={audioRef} />
      
      {/* Cursor effect */}
      <CursorEffect />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden content-section">
        <div className="container max-w-6xl mx-auto text-center py-36">
          <div className="animate-reveal opacity-0" style={{ animationDelay: '0.2s' }}>
            <div className="typewriter-container">
              <h1 className="hero-title">
                <span className="text-gradient">
                  {typedText}<span className="animate-pulse">|</span>
                </span>
              </h1>
            </div>
          </div>

          <div className="animate-reveal opacity-0 max-w-3xl mx-auto" style={{ animationDelay: '0.4s' }}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12">
              GUTTR is revolutionizing the music industry by creating the first platform that&apos;s truly owned by both <span className="text-primary font-semibold">artists</span> and <span className="text-secondary font-semibold">listeners</span>. We&apos;re combining the best of streaming, distribution, and social media into one ecosystem where everyone benefits.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-reveal opacity-0" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/auth/register"
              className="suno-button px-8 py-4 text-lg"
            >
              Start Creating
            </Link>
            
            <AudioPlayer 
              isPlaying={audioPlaying}
              currentSong={songs[currentSongIndex]}
              onTogglePlay={togglePlay}
              onSkipForward={skipForward}
              onSkipBackward={skipBackward}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="container max-w-6xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="suno-card animate-reveal opacity-0 transition-all duration-500 hover:transform hover:-translate-y-1"
                style={{ animationDelay: `${0.7 + index * 0.2}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <h3 className="text-xl font-bold mb-2">{stat.label}</h3>
                <p className="text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 glassmorphism content-section">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-6xl font-bold mb-4">
              <span className="text-gradient">Revolutionary Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              GUTTR combines the best parts of Spotify, Bandcamp, and Beatstars while adding groundbreaking ownership mechanics that benefit everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="suno-card transition-all duration-500 hover:transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 content-section">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-6xl font-bold mb-4">
              <span className="text-gradient">How GUTTR Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our ecosystem creates multiple revenue streams for both creators and listeners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -left-4 -top-4 text-5xl text-primary opacity-20 font-bold">01</div>
              <div className="glassmorphism p-8 rounded-xl relative z-10">
                <h3 className="text-xl font-bold mb-4">Create & Upload</h3>
                <p className="text-muted-foreground">
                  Artists create music and upload it once to GUTTR. We handle distribution to all major platforms while maintaining your ownership.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 text-5xl text-secondary opacity-20 font-bold">02</div>
              <div className="glassmorphism p-8 rounded-xl relative z-10">
                <h3 className="text-xl font-bold mb-4">Engage & Discover</h3>
                <p className="text-muted-foreground">
                  Listeners discover new music, create playlists, and support artists. Early supporters of trending tracks earn more rewards.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 text-5xl text-accent opacity-20 font-bold">03</div>
              <div className="glassmorphism p-8 rounded-xl relative z-10">
                <h3 className="text-xl font-bold mb-4">Earn Together</h3>
                <p className="text-muted-foreground">
                  Revenue is automatically distributed to artists, active listeners, and platform contributors through our smart contract system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA Section */}
      <section className="py-32 glassmorphism content-section">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Join the Music Revolution</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Whether you&apos;re a creator or a fan, GUTTR offers unprecedented opportunities to earn from the music you love. Be part of the first platform that truly values both artists and listeners.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/auth/register?type=artist"
                className="suno-button px-8 py-4 text-lg"
              >
                Join as Artist
              </Link>
              <Link
                href="/auth/register?type=listener"
                className="suno-button px-8 py-4 text-lg"
                style={{ 
                  background: 'linear-gradient(to right, hsl(180, 100%, 53%), hsl(263, 75%, 67%))'
                }}
              >
                Join as Listener
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Audio element */}
      <audio ref={audioRef} preload="auto" className="hidden" />
    </div>
  );
}
