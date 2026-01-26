import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AuthForm from '../../components/forms/AuthForm';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the Firebase auth functions
vi.mock('../../firebase', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

describe('Authentication Component', () => {
  const mockSetUser = vi.fn();
  const mockSetLoading = vi.fn();
  const mockSetError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
  });

  it('switches between login and signup forms', () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    // Initially shows login form
    expect(screen.getByText('Sign In')).toBeInTheDocument();

    // Click create account button
    fireEvent.click(screen.getByText('Create Account'));

    // Now shows signup form
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();

    // Click login button
    fireEvent.click(screen.getByText('Back to Login'));

    // Back to login form
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('handles login with valid credentials', async () => {
    const { signInWithEmailAndPassword } = require('../../firebase');
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: {
        uid: 'test-user-id',
        email: 'test@example.com',
      },
    });

    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockSetUser).toHaveBeenCalledWith({
        uid: 'test-user-id',
        email: 'test@example.com',
      });
    });
  });

  it('handles signup with valid credentials', async () => {
    const { createUserWithEmailAndPassword } = require('../../firebase');
    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: {
        uid: 'test-user-id',
        email: 'test@example.com',
      },
    });

    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    // Switch to signup form
    fireEvent.click(screen.getByText('Create Account'));

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockSetUser).toHaveBeenCalledWith({
        uid: 'test-user-id',
        email: 'test@example.com',
      });
    });
  });

  it('validates password match during signup', async () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    // Switch to signup form
    fireEvent.click(screen.getByText('Create Account'));

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('handles password reset', async () => {
    const { sendPasswordResetEmail } = require('../../firebase');
    sendPasswordResetEmail.mockResolvedValueOnce();

    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText('Forgot Password?'));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText('Password reset email sent')).toBeInTheDocument();
    });
  });

  it('handles login errors', async () => {
    const { signInWithEmailAndPassword } = require('../../firebase');
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('handles signup errors', async () => {
    const { createUserWithEmailAndPassword } = require('../../firebase');
    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Email already in use'));

    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    // Switch to signup form
    fireEvent.click(screen.getByText('Create Account'));

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });
  });

  it('shows loading state during authentication', async () => {
    const { signInWithEmailAndPassword } = require('../../firebase');
    signInWithEmailAndPassword.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign In'));

    expect(screen.getByText('Sign In')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  it('validates password strength', async () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: false, error: null, setUser: mockSetUser, setLoading: mockSetLoading, setError: mockSetError }}>
        <Authentication />
      </AuthContext.Provider>
    );

    // Switch to signup form
    fireEvent.click(screen.getByText('Create Account'));

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'weak' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'weak' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    });
  });
}); 