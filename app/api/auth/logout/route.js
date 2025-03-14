import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Mock successful logout
    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
} 