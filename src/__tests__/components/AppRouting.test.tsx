import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedLayout from '../../components/layout/ProtectedLayout';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: jest.fn(),
    signup: jest.fn(),
    loginWithGoogle: jest.fn(),
    loginWithApple: jest.fn(),
    logout: jest.fn(),
    updateUserProfile: jest.fn(),
  }),
}));

const LoginStateProbe: React.FC = () => {
  const location = useLocation() as any;
  return (
    <div>
      <div>LOGIN_PAGE</div>
      <div data-testid="from-path">{location.state?.from?.pathname ?? 'none'}</div>
    </div>
  );
};

describe('Routing auth guard', () => {
  it('redirects unauthenticated users to /login and preserves the attempted path', () => {
    render(
      <MemoryRouter initialEntries={['/today']}>
        <Routes>
          <Route path="/login" element={<LoginStateProbe />} />
          <Route path="/today" element={<ProtectedLayout />}>
            <Route index element={<div>TODAY_PAGE</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('LOGIN_PAGE')).toBeInTheDocument();
    expect(screen.getByTestId('from-path')).toHaveTextContent('/today');
    expect(screen.queryByText('TODAY_PAGE')).not.toBeInTheDocument();
  });
});

