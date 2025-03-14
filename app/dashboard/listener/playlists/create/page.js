'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePlaylist() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: true,
    coverImage: null,
    coverImagePreview: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [name]: file,
          coverImagePreview: reader.result,
        });
      };
      
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Basic validation
      if (!formData.title.trim()) {
        throw new Error('Please provide a playlist title');
      }
      
      // Simulate API call to create playlist
      // In a real app, you would upload the data to your API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Playlist created successfully!');
      
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/listener/playlists');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link 
          href="/dashboard/listener/playlists" 
          className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
          Back to playlists
        </Link>
        <h1 className="text-3xl font-bold">Create New Playlist</h1>
        <p className="text-muted-foreground">Organize your favorite tracks into a custom playlist</p>
      </div>
      
      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 rounded-md bg-primary/10 p-4 text-primary">
          <p>{success}</p>
        </div>
      )}
      
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Playlist Title <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-md border border-border bg-background px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="My Awesome Playlist"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="isPublic" className="text-sm font-medium">
                Visibility
              </label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2">
                  <input
                    id="isPublic"
                    name="isPublic"
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    disabled={loading}
                  />
                  <span>Public</span>
                </label>
                <span className="text-xs text-muted-foreground">
                  {formData.isPublic ? "Anyone can see this playlist" : "Only you can see this playlist"}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-md border border-border bg-background px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="What's this playlist about?"
                rows="4"
                disabled={loading}
              ></textarea>
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/500 characters
              </p>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="coverImage" className="text-sm font-medium">
                Playlist Cover
              </label>
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                <div className="relative h-40 w-40 overflow-hidden rounded-md border border-border bg-muted">
                  {formData.coverImagePreview ? (
                    <img 
                      src={formData.coverImagePreview} 
                      alt="Cover preview" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <label 
                      htmlFor="coverImage" 
                      className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Choose Image
                    </label>
                    {formData.coverImage && (
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          coverImage: null,
                          coverImagePreview: null,
                        })}
                        className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    id="coverImage"
                    name="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image, at least 500x500px.
                    <br/>
                    Supports JPG, PNG, or GIF (max 2MB).
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Playlist...
                  </>
                ) : (
                  'Create Playlist'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Adding Tracks</h2>
        <p className="text-muted-foreground">
          After creating your playlist, you'll be able to add tracks to it from:
        </p>
        <ul className="mt-4 ml-6 list-disc space-y-2 text-muted-foreground">
          <li>Your library</li>
          <li>Search results</li>
          <li>Artist pages</li>
          <li>Other playlists</li>
        </ul>
        <div className="mt-6 rounded-md bg-muted p-4">
          <p className="text-sm font-medium">Tip: Use the &quot;Add to Playlist&quot; option when browsing tracks to quickly add them to your playlists.</p>
        </div>
      </div>
    </div>
  );
} 