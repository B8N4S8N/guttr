import { supabaseAdmin, supabaseClient } from './supabase';
import prisma from './prisma';

// Register a new user
export async function registerUser({ name, email, password, role }) {
  try {
    // 1. Create the user in Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // 2. Store the user in our database
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        name,
        email,
        role: role,
      },
    });

    // 3. If the user is an artist, create an artist profile
    if (role === 'ARTIST') {
      await prisma.artist.create({
        data: {
          userId: user.id,
        },
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
}

// Log in a user
export async function loginUser({ email, password }) {
  try {
    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // 2. Get the user from our database
    const user = await prisma.user.findUnique({
      where: {
        id: authData.user.id,
      },
    });

    if (!user) {
      throw new Error('User not found in database');
    }

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

// Log out a user
export async function logoutUser() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
}

// Get the current authenticated user
export async function getCurrentUserWithProfile() {
  try {
    // 1. Get the authenticated user from Supabase
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    if (!sessionData?.session?.user) {
      return { user: null };
    }

    // 2. Get the user from our database with additional profile data
    const user = await prisma.user.findUnique({
      where: {
        id: sessionData.session.user.id,
      },
      include: {
        artistProfile: true,
      },
    });

    if (!user) {
      throw new Error('User not found in database');
    }

    return { user };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error: error.message };
  }
}

// Check if a user is logged in on the client side
export async function isUserLoggedIn() {
  const { data } = await supabaseClient.auth.getSession();
  return !!data.session;
}

// Get the user role (ARTIST or LISTENER)
export async function getUserRole() {
  try {
    const { user } = await getCurrentUserWithProfile();
    return user?.role || null;
  } catch (error) {
    console.error('Get user role error:', error);
    return null;
  }
} 