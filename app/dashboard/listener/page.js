'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ListenerDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    playlists: 0,
    followedArtists: 0,
    likedTracks: 0,
    earnings: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated, redirect to login
            router.push('/auth/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        
        // Check if user is a listener
        if (userData.role !== 'LISTENER') {
          router.push('/dashboard/artist');
          return;
        }

        setUser(userData);
        
        // In a real app, fetch listener stats here
        // For now, we'll use dummy data
        setStats({
          playlists: 5,
          followedArtists: 12,
          likedTracks: 47,
          earnings: 23.45,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This will not be rendered as we redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Listener Dashboard</h1>
          <p className="text-muted-foreground">Discover music, create playlists, and track your earnings</p>
        </div>
        <Link
          href="/radio"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Listen to Radio
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-muted-foreground">Your Playlists</h3>
          <p className="mt-2 text-3xl font-bold">{stats.playlists}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-muted-foreground">Followed Artists</h3>
          <p className="mt-2 text-3xl font-bold">{stats.followedArtists}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-muted-foreground">Liked Tracks</h3>
          <p className="mt-2 text-3xl font-bold">{stats.likedTracks}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-muted-foreground">Total Earnings</h3>
          <p className="mt-2 text-3xl font-bold">${stats.earnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Playlists */}
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Playlists</h2>
          <Link href="/dashboard/listener/playlists" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Playlist 1 */}
          <div className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow">
            <div className="aspect-square overflow-hidden bg-muted">
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <button className="rounded-full bg-primary p-3 text-primary-foreground shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium">Chill Vibes</h3>
              <p className="text-sm text-muted-foreground">15 tracks • 52 min</p>
            </div>
          </div>
          
          {/* Playlist 2 */}
          <div className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow">
            <div className="aspect-square overflow-hidden bg-muted">
              <div className="h-full w-full bg-gradient-to-br from-secondary/20 to-accent/20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <button className="rounded-full bg-primary p-3 text-primary-foreground shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium">Workout Mix</h3>
              <p className="text-sm text-muted-foreground">23 tracks • 78 min</p>
            </div>
          </div>
          
          {/* Create Playlist Card */}
          <div className="group flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:bg-muted/50">
            <div className="mb-3 rounded-full bg-muted p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <h3 className="text-sm font-medium">Create New Playlist</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-10">
        <h2 className="mb-4 text-xl font-bold">Recent Activity</h2>
        <div className="rounded-lg border border-border">
          <div className="grid grid-cols-1 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">You liked &quot;Moonlight Sonata (AI Remix)&quot;</p>
                  <p className="text-sm text-muted-foreground">By AI Maestro</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">You followed Future Beats</p>
                  <p className="text-sm text-muted-foreground">Artist with 5.2K followers</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Yesterday</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">You earned $1.25</p>
                  <p className="text-sm text-muted-foreground">From streaming ad revenue</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Recommended for You</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Artist 1 */}
          <div className="group rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow">
            <div className="mb-3 flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
              <div>
                <h3 className="font-medium">Electronic Dreams</h3>
                <p className="text-xs text-muted-foreground">Artist</p>
              </div>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              AI-powered electronic music producer creating chill beats and ambient soundscapes.
            </p>
            <button className="w-full rounded-md border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
              Follow
            </button>
          </div>
          
          {/* Track 1 */}
          <div className="group rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium">Night Drive</h3>
              <p className="text-sm text-muted-foreground">By Synthwave Dreams</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">3:45</span>
                <div className="flex items-center space-x-2">
                  <button className="rounded-full p-1 text-muted-foreground hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                  <button className="rounded-full p-1 text-muted-foreground hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                  <button className="rounded-full p-1 text-muted-foreground hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Radio Station */}
          <div className="group rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <div className="h-full w-full bg-gradient-to-br from-accent to-secondary/40 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-secondary/70">
                  <path d="M12 11c.33-4.25 2.28-8 6-8 0 9.94-6.06 12-6 12M12 11c-.33-4.25-2.28-8-6-8 0 9.94 6.06 12 6 12"></path>
                  <circle cx="12" cy="11" r="1"></circle>
                  <path d="M12 11v10"></path>
                </svg>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium">AI Ambient Radio</h3>
              <p className="text-sm text-muted-foreground">AI-generated ambient music for focus and relaxation</p>
              <button className="mt-3 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Listen Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 