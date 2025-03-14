import { NextResponse } from 'next/server';
import { getCurrentUserWithProfile } from '@/lib/auth';

export async function GET() {
  try {
    // Get the current user
    const { user, error } = await getCurrentUserWithProfile();

    if (error || !user) {
      return NextResponse.json(
        { message: error || 'Not authenticated' },
        { status: 401 }
      );
    }

    // Don't send the password or sensitive info to the client
    const { password, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Get current user API error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching user data' },
      { status: 500 }
    );
  }
} 