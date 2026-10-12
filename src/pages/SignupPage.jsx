import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Music2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    return errs;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setIsLoading(true);
    setServerError('');
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      // PRD Section 5: Success -> /signup -> /create-profile.
      navigate('/create-profile');
    } catch (err) {
      setServerError(err.message || 'An account with this email already exists.');
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
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">Join MusicFind to connect with musicians in your area</p>
        </div>

        {serverError && (
          <ErrorMessage message={serverError} className="mb-4" />
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <Input
            label="Full Name / Artist Name"
            id="signup-name"
            placeholder="e.g. Maya Chen"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            icon={User}
            required
          />

          <Input
            label="Email Address"
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            id="signup-password"
            type="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            icon={Lock}
            required
          />

          <Input
            label="Confirm Password"
            id="signup-confirm-password"
            type="password"
            placeholder="Repeat password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            loadingText="Creating account..."
            icon={ArrowRight}
            id="create-account-button"
            className="mt-2"
          >
            Create Account
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link" id="login-link-for-existing">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
