import { NextResponse } from 'next/server';

// Mock user data for demo purposes
const MOCK_USER = {
  id: 'user-1',
  name: 'Demo Artist',
  email: 'artist@example.com',
  role: 'ARTIST',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  artistProfile: {
    id: 'profile-1',
    bio: 'This is a demo artist profile for the GUTTR platform.',
    genre: 'Electronic',
    followers: 1250,
    userId: 'user-1'
  }
};

export async function GET() {
  try {
    // Always return the mock user for demo purposes
    return NextResponse.json(MOCK_USER);
  } catch (error) {
    console.error('Get current user API error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching user data' },
      { status: 500 }
    );
  }
} 