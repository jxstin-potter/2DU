import React from 'react';
import '@testing-library/jest-dom';
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
  }),
}));

describe('AuthForm', () => {
  it('renders login fields', () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('switches to signup mode when sign up link is clicked', () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/sign up/i));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });
});

