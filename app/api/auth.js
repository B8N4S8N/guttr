// Mock authentication utilities for demo purposes
// This file provides dummy auth functions to avoid build errors

export const withAuth = (handler) => {
  return handler;
};

export const withRole = (handler, role) => {
  return handler;
};

export const getCurrentUser = async () => {
  return {
    id: 'user-123',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'ARTIST'
  };
};

export const isAuthenticated = async () => {
  return true;
};
