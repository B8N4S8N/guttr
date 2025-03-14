'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PlaylistsPage() {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, public, private
  const [sortBy, setSortBy] = useState('recent'); // recent, name, tracks
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          if (response.status === 401) {
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
        
        // In a real app, fetch playlists from API here
        // For now, we'll use dummy data
        setPlaylists([
          {
            id: '1',
            title: 'Chill Vibes',
            description: 'Relaxing tunes for unwinding after a long day',
            trackCount: 15,
            totalDuration: '52 min',
            isPublic: true,
            createdAt: new Date('2023-10-15'),
            coverImage: null,
          },
          {
            id: '2',
            title: 'Workout Mix',
            description: 'High energy tracks to keep you motivated',
            trackCount: 23,
            totalDuration: '78 min',
            isPublic: true,
            createdAt: new Date('2023-11-02'),
            coverImage: null,
          },
          {
            id: '3',
            title: 'Focus Session',
            description: 'Ambient and instrumental tracks for deep work',
            trackCount: 18,
            totalDuration: '65 min',
            isPublic: false,
            createdAt: new Date('2023-12-10'),
            coverImage: null,
          },
          {
            id: '4',
            title: 'AI Discoveries',
            description: 'Interesting tracks made by AI musicians',
            trackCount: 12,
            totalDuration: '42 min',
            isPublic: true,
            createdAt: new Date('2024-01-05'),
            coverImage: null,
          },
          {
            id: '5',
            title: 'Late Night Drive',
            description: 'Perfect soundtrack for midnight drives',
            trackCount: 20,
            totalDuration: '68 min',
            isPublic: false,
            createdAt: new Date('2024-02-18'),
            coverImage: null,
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const filteredPlaylists = playlists.filter(playlist => {
    if (filter === 'all') return true;
    if (filter === 'public') return playlist.isPublic;
    if (filter === 'private') return !playlist.isPublic;
    return true;
  });

  const sortedPlaylists = [...filteredPlaylists].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'tracks') {
      return b.trackCount - a.trackCount;
    }
    return 0;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading your playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Playlists</h1>
          <p className="text-muted-foreground">Manage and organize your music collections</p>
        </div>
        <Link
          href="/dashboard/listener/playlists/create"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Playlist
        </Link>
      </div>

      {/* Filters and Sorting */}
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-md px-3 py-1 text-sm ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`rounded-md px-3 py-1 text-sm ${
              filter === 'public'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setFilter('private')}
            className={`rounded-md px-3 py-1 text-sm ${
              filter === 'private'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Private
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="recent">Recently Created</option>
            <option value="name">Name (A-Z)</option>
            <option value="tracks">Track Count</option>
          </select>
        </div>
      </div>

      {/* Playlists Grid */}
      {sortedPlaylists.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-10">
          <div className="mb-4 rounded-full bg-muted p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium">No playlists found</h3>
          <p className="mb-4 text-center text-muted-foreground">
            {filter !== 'all' 
              ? `You don${String.fromCharCode(39)}t have any ${filter} playlists yet.` 
              : "You haven't created any playlists yet."}
          </p>
          <Link
            href="/dashboard/listener/playlists/create"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create your first playlist
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedPlaylists.map((playlist) => (
            <div key={playlist.id} className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow">
              <div className="aspect-square overflow-hidden bg-muted">
                {playlist.coverImage ? (
                  <img 
                    src={playlist.coverImage} 
                    alt={playlist.title}
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button className="rounded-full bg-primary p-3 text-primary-foreground shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                  <Link href={`/dashboard/listener/playlists/${playlist.id}/edit`} className="rounded-full bg-secondary p-3 text-secondary-foreground shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">{playlist.title}</h3>
                  {!playlist.isPublic && (
                    <span className="flex items-center rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Private
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{playlist.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{playlist.trackCount} tracks • {playlist.totalDuration}</span>
                  <span>Created {formatDate(playlist.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Create New Playlist Card */}
          <Link 
            href="/dashboard/listener/playlists/create"
            className="group flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:bg-muted/50"
          >
            <div className="mb-3 rounded-full bg-muted p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <h3 className="text-sm font-medium">Create New Playlist</h3>
          </Link>
        </div>
      )}
    </div>
  );
} 