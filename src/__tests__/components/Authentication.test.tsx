import React from 'react';
import { expect } from '@jest/globals';
import { render, screen, fireEvent } from './test-utils';
import { MemoryRouter } from 'react-router-dom';
import AuthForm from '../../components/forms/AuthForm';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn().mockResolvedValue(undefined),
    signup: jest.fn().mockResolvedValue(undefined),
    loginWithGoogle: jest.fn().mockResolvedValue(undefined),
    loginWithApple: jest.fn().mockResolvedValue(undefined),
    requestPasswordReset: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe('AuthForm', () => {
  it('renders login fields', () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /welcome/i })).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
  });

  it('switches to signup mode when sign up link is clicked', () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/sign up/i));
    expect(screen.getByLabelText(/name/i)).toBeTruthy();
  });

  it('opens password reset dialog from login', () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/forgot password/i));
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeTruthy();
    expect(screen.getAllByLabelText(/email/i)[0]).toBeTruthy();
  });
});

