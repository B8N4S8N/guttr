'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import TrackPlayer from '@/components/TrackPlayer';

export default function TrackDetailPage() {
  const params = useParams();
  const [track, setTrack] = useState(null);
  const [relatedTracks, setRelatedTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, fetch data from your API
        // For now, we'll simulate a delay and use dummy data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample track data
        const trackData = {
          id: params.id,
          title: 'Midnight Dreams',
          artist: 'Electronic Vibes',
          artistId: 'ev-123',
          releaseDate: '2023-12-10',
          description: 'An AI-generated electronic track with deep bass and atmospheric elements, perfect for late night drives or focus sessions.',
          bpm: 128,
          key: 'Am',
          genre: 'Electronic',
          tags: ['ambient', 'electronic', 'chill', 'ai-generated'],
          price: 2.99,
          plays: 4820,
          likes: 342,
          duration: 217, // seconds
          audioUrl: 'https://example.com/audio/track.mp3', // This would be a real URL in production
          coverImage: null, // This would be a real URL in production
          isAIGenerated: true,
          license: 'Standard License',
        };
        
        setTrack(trackData);
        
        // Sample related tracks
        setRelatedTracks([
          {
            id: 'track-1',
            title: 'Summer Vibes',
            artist: 'Electronic Vibes',
            plays: 3245,
            coverImage: null,
          },
          {
            id: 'track-2',
            title: 'Urban Nightlife',
            artist: 'Electronic Vibes',
            plays: 2871,
            coverImage: null,
          },
          {
            id: 'track-3',
            title: 'Dawn Chorus',
            artist: 'Ambient Dreams',
            plays: 4128,
            coverImage: null,
          },
          {
            id: 'track-4',
            title: 'City Lights',
            artist: 'Future Beats',
            plays: 5762,
            coverImage: null,
          },
        ]);
      } catch (error) {
        console.error('Error fetching track data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrackData();
  }, [params.id]);
  
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading track...</p>
        </div>
      </div>
    );
  }
  
  if (!track) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Track Not Found</h1>
        <p className="mb-8 text-muted-foreground">The track you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link 
          href="/"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatPlays = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Track Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-20 w-20 overflow-hidden rounded-md bg-gradient-to-br from-primary/10 to-secondary/10 sm:h-24 sm:w-24">
              {track.coverImage ? (
                <img 
                  src={track.coverImage} 
                  alt={track.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold">{track.title}</h1>
                {track.isAIGenerated && (
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    AI-Generated
                  </span>
                )}
              </div>
              <Link 
                href={`/artists/${track.artistId}`}
                className="text-lg text-primary hover:underline"
              >
                {track.artist}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>Released {formatDate(track.releaseDate)}</span>
                <span>{formatPlays(track.plays)} plays</span>
                <span>{track.genre}</span>
              </div>
            </div>
          </div>
          
          {/* Player */}
          <div className="mb-8">
            <TrackPlayer track={track} />
          </div>
          
          {/* Description */}
          <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">About This Track</h2>
            <p className="text-muted-foreground">{track.description}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">BPM</h3>
                <p>{track.bpm}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Key</h3>
                <p>{track.key}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">License</h3>
                <p>{track.license}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                <p>${track.price.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {track.tags.map((tag) => (
                  <Link 
                    key={tag}
                    href={`/tags/${tag}`}
                    className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-muted/80"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Comments Section (placeholder) */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Comments</h2>
            <div className="mb-4">
              <textarea
                placeholder="Add a comment..."
                className="w-full rounded-md border border-border bg-background px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                rows="3"
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Post Comment
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-md border border-border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                    <span className="font-medium">MusicLover42</span>
                  </div>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
                <p className="text-sm">This track is amazing! The bass hits just right and the melody is unforgettable. Definitely adding this to my playlist.</p>
              </div>
              
              <div className="rounded-md border border-border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                    <span className="font-medium">ElectronicFan</span>
                  </div>
                  <span className="text-xs text-muted-foreground">5 days ago</span>
                </div>
                <p className="text-sm">The production quality is top-notch. Hard to believe this was AI-generated. Looking forward to more from this artist!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Purchase Card */}
          <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Purchase</h2>
            <div className="mb-6">
              <span className="text-3xl font-bold">${track.price.toFixed(2)}</span>
              <p className="mt-1 text-sm text-muted-foreground">Standard License Included</p>
            </div>
            
            <div className="space-y-3">
              <button className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
                Buy Now
              </button>
              <button className="w-full rounded-md border border-primary bg-transparent px-4 py-2 font-medium text-primary hover:bg-primary/10">
                Add to Cart
              </button>
            </div>
            
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium">License Includes:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  MP3 and WAV Downloads
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Use in digital content
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Worldwide usage rights
                </li>
              </ul>
              
              <Link href="/licenses" className="mt-2 block text-sm text-primary hover:underline">
                View full license details
              </Link>
            </div>
          </div>
          
          {/* Artist Card */}
          <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"></div>
              <div>
                <Link 
                  href={`/artists/${track.artistId}`}
                  className="font-medium hover:underline"
                >
                  {track.artist}
                </Link>
                <p className="text-xs text-muted-foreground">124 Tracks • 8.5K Followers</p>
              </div>
            </div>
            
            <button className="w-full rounded-md border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
              Follow Artist
            </button>
            
            <Link 
              href={`/artists/${track.artistId}`}
              className="mt-2 block w-full text-center text-sm text-primary hover:underline"
            >
              View Profile
            </Link>
          </div>
          
          {/* Related Tracks */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Related Tracks</h2>
            <div className="space-y-4">
              {relatedTracks.map((relatedTrack) => (
                <Link 
                  key={relatedTrack.id}
                  href={`/tracks/${relatedTrack.id}`}
                  className="flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-muted/50"
                >
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-muted">
                    {relatedTrack.coverImage ? (
                      <img 
                        src={relatedTrack.coverImage} 
                        alt={relatedTrack.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                          <path d="M9 18V5l12-2v13"></path>
                          <circle cx="6" cy="18" r="3"></circle>
                          <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{relatedTrack.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {relatedTrack.artist} • {formatPlays(relatedTrack.plays)} plays
                    </p>
                  </div>
                  
                  <button className="rounded-full p-2 text-muted-foreground hover:bg-background hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                </Link>
              ))}
            </div>
            
            <Link
              href={`/artists/${track.artistId}/tracks`}
              className="mt-4 block text-center text-sm text-primary hover:underline"
            >
              View All Tracks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 