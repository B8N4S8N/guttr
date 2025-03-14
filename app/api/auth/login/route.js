import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate the user
    const result = await loginUser({ email, password });

    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Login successful',
      userId: result.user.id,
      name: result.user.name,
      role: result.user.role
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 