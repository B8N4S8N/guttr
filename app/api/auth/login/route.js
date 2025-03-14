import { NextResponse } from 'next/server';

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: 'user-1',
    email: 'artist@example.com',
    password: 'password123',
    name: 'Demo Artist',
    role: 'ARTIST'
  },
  {
    id: 'user-2',
    email: 'listener@example.com',
    password: 'password123',
    name: 'Demo Listener',
    role: 'LISTENER'
  }
];

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

    // Find user in mock data
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Mock successful login
    return NextResponse.json({
      message: 'Login successful',
      userId: user.id,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 