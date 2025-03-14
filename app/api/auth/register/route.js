import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

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

    // Register the user
    const result = await registerUser({ name, email, password, role });

    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: 'User registered successfully',
      userId: result.user.id,
      role: result.user.role
    });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 