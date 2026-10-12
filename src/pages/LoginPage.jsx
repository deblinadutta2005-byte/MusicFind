import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Music2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await login({ email, password });
      // Existing users go straight to Discover instead of the profile creation page.
      navigate('/discover');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <Music2 size={24} className="text-accent" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to your musician account</p>
        </div>

        {error && (
          <ErrorMessage message={error} className="mb-4" />
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <Input
            label="Email Address"
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            loadingText="Logging in..."
            icon={LogIn}
            id="login-button"
            className="mt-2"
          >
            Log In
          </Button>

        </form>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/signup" className="auth-link" id="signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
