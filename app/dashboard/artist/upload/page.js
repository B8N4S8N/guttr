'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadTrack() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    bpm: '',
    key: '',
    isAIGenerated: false,
    isPublic: true,
    licenseType: 'STANDARD',
    audioFile: null,
    coverImage: null,
    tags: '',
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // In a real app, we would upload the track here
    // This is just a mock implementation
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        price: '',
        bpm: '',
        key: '',
        isAIGenerated: false,
        isPublic: true,
        licenseType: 'STANDARD',
        audioFile: null,
        coverImage: null,
        tags: '',
      });
      
      // In a real app, we would navigate to the track page
      // setTimeout(() => router.push('/dashboard/artist/tracks'), 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link 
          href="/dashboard/artist" 
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Upload New Track</h1>
        <p className="text-muted-foreground">Share your music with the world</p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-md bg-success/10 p-4 text-sm text-success">
          <p>Track uploaded successfully! It will be available on your profile shortly.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Track Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Track Title <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter track title"
              />
            </div>
            
            {/* Audio File */}
            <div className="space-y-2">
              <label htmlFor="audioFile" className="text-sm font-medium">
                Audio File <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="audioFile"
                  name="audioFile"
                  type="file"
                  accept="audio/*"
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted formats: MP3, WAV, FLAC, M4A (max 50MB)
              </p>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label htmlFor="coverImage" className="text-sm font-medium">
                Cover Image
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="coverImage"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended size: 1400×1400 pixels (JPG, PNG, WebP)
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  $
                </span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0.00 (free)"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty for free download
              </p>
            </div>

            {/* Two column layout for BPM and Key */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="bpm" className="text-sm font-medium">
                  BPM
                </label>
                <input
                  id="bpm"
                  name="bpm"
                  type="number"
                  min="1"
                  max="300"
                  value={formData.bpm}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="120"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="key" className="text-sm font-medium">
                  Key
                </label>
                <select
                  id="key"
                  name="key"
                  value={formData.key}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a key</option>
                  <option value="C">C Major</option>
                  <option value="Cm">C Minor</option>
                  <option value="C#">C# Major</option>
                  <option value="C#m">C# Minor</option>
                  <option value="D">D Major</option>
                  <option value="Dm">D Minor</option>
                  <option value="D#">D# Major</option>
                  <option value="D#m">D# Minor</option>
                  <option value="E">E Major</option>
                  <option value="Em">E Minor</option>
                  <option value="F">F Major</option>
                  <option value="Fm">F Minor</option>
                  <option value="F#">F# Major</option>
                  <option value="F#m">F# Minor</option>
                  <option value="G">G Major</option>
                  <option value="Gm">G Minor</option>
                  <option value="G#">G# Major</option>
                  <option value="G#m">G# Minor</option>
                  <option value="A">A Major</option>
                  <option value="Am">A Minor</option>
                  <option value="A#">A# Major</option>
                  <option value="A#m">A# Minor</option>
                  <option value="B">B Major</option>
                  <option value="Bm">B Minor</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="electronic, house, techno (comma separated)"
              />
              <p className="text-xs text-muted-foreground">
                Add up to 5 tags to help people discover your music
              </p>
            </div>

            {/* License Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">License Type</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <label className="flex cursor-pointer items-center space-x-2 rounded-md border border-border p-3 hover:bg-muted/50">
                  <input
                    type="radio"
                    name="licenseType"
                    value="STANDARD"
                    checked={formData.licenseType === 'STANDARD'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary"
                  />
                  <div>
                    <p className="font-medium">Standard</p>
                    <p className="text-xs text-muted-foreground">Personal use</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center space-x-2 rounded-md border border-border p-3 hover:bg-muted/50">
                  <input
                    type="radio"
                    name="licenseType"
                    value="PREMIUM"
                    checked={formData.licenseType === 'PREMIUM'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary"
                  />
                  <div>
                    <p className="font-medium">Premium</p>
                    <p className="text-xs text-muted-foreground">Commercial use</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center space-x-2 rounded-md border border-border p-3 hover:bg-muted/50">
                  <input
                    type="radio"
                    name="licenseType"
                    value="EXCLUSIVE"
                    checked={formData.licenseType === 'EXCLUSIVE'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary"
                  />
                  <div>
                    <p className="font-medium">Exclusive</p>
                    <p className="text-xs text-muted-foreground">Full rights transfer</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  id="isAIGenerated"
                  name="isAIGenerated"
                  type="checkbox"
                  checked={formData.isAIGenerated}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isAIGenerated" className="text-sm">
                  This track was created with AI assistance
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="isPublic"
                  name="isPublic"
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isPublic" className="text-sm">
                  Make this track public (uncheck to save as draft)
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/artist')}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-70"
              >
                {isLoading ? 'Uploading...' : 'Upload Track'}
              </button>
            </div>
          </form>
        </div>

        <div className="order-first md:order-last">
          <div className="sticky top-20 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Upload Guidelines</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium">File Formats</h4>
                <p className="text-muted-foreground">
                  We accept MP3, WAV, FLAC, and M4A files up to 50MB.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Pricing</h4>
                <p className="text-muted-foreground">
                  You can set any price for your track, including free. You&apos;ll earn 90% of all sales after platform fees.
                </p>
              </div>
              <div>
                <h4 className="font-medium">AI-Generated Music</h4>
                <p className="text-muted-foreground">
                  GUTTR welcomes AI-created and AI-assisted music. Please disclose if AI tools were used in the creation process.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Licensing</h4>
                <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Standard: Personal use only</li>
                  <li>Premium: Commercial use allowed</li>
                  <li>Exclusive: One-time sale, rights transfer</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Content Policy</h4>
                <p className="text-muted-foreground">
                  Only upload content you have rights to. Avoid copyright infringement and follow our community guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 