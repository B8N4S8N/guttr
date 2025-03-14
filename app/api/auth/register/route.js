import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    // Validate inputs
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock successful registration
    const userId = `user-${Date.now()}`;

    return NextResponse.json({ 
      message: 'User registered successfully',
      userId: userId,
      role: role
    });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 