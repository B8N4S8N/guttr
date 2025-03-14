import { NextResponse } from 'next/server';
import { logoutUser } from '@/lib/auth';

export async function POST() {
  try {
    // Log out the user
    const result = await logoutUser();

    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
} 