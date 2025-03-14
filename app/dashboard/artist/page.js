'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ArtistDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    tracks: 0,
    albums: 0,
    earnings: 0,
    plays: 0,
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
        
        // Check if user is an artist
        if (userData.role !== 'ARTIST') {
          router.push('/dashboard/listener');
          return;
        }

        setUser(userData);
        
        // In a real app, fetch artist stats here
        // For now, we'll use dummy data
        setStats({
          tracks: 12,
          albums: 2,
          earnings: 345.67,
          plays: 1250,
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
          <h1 className="text-3xl font-bold">Artist Dashboard</h1>
          <p className="text-muted-foreground">Manage your music, track performance, and grow your audience</p>
        </div>
        <Link
          href="/dashboard/artist/upload"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Upload New Track
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-muted-foreground">Total Tracks</h3>
          <p className="mt-2 text-3xl font-bold">{stats.tracks}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-muted-foreground">Total Albums</h3>
          <p className="mt-2 text-3xl font-bold">{stats.albums}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-muted-foreground">Total Earnings</h3>
          <p className="mt-2 text-3xl font-bold">${stats.earnings.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-muted-foreground">Total Plays</h3>
          <p className="mt-2 text-3xl font-bold">{stats.plays}</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mb-10">
        <h2 className="mb-4 text-xl font-bold">Recent Activities</h2>
        <div className="rounded-lg border border-border">
          <div className="grid grid-cols-1 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">New play on &quot;Summer Vibes&quot;</p>
                  <p className="text-sm text-muted-foreground">From listener in New York, USA</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">New sale on &quot;Midnight Dreams&quot;</p>
                  <p className="text-sm text-muted-foreground">$9.99 added to your balance</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Yesterday</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">New follower</p>
                  <p className="text-sm text-muted-foreground">JazzLover42 started following you</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Quick Access</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/artist/tracks" className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow">
            <div className="mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <h3 className="font-medium">Manage Tracks</h3>
            <p className="text-sm text-muted-foreground">Edit or delete your tracks</p>
          </Link>
          <Link href="/dashboard/artist/albums" className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow">
            <div className="mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
            </div>
            <h3 className="font-medium">Manage Albums</h3>
            <p className="text-sm text-muted-foreground">Create and organize albums</p>
          </Link>
          <Link href="/dashboard/artist/earnings" className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow">
            <div className="mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h3 className="font-medium">Earnings</h3>
            <p className="text-sm text-muted-foreground">Track your revenue</p>
          </Link>
          <Link href="/dashboard/artist/profile" className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow">
            <div className="mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 className="font-medium">Edit Profile</h3>
            <p className="text-sm text-muted-foreground">Update your artist info</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 