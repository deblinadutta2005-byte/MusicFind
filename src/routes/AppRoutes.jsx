import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { CreateProfilePage } from '../pages/CreateProfilePage';
import { DiscoverPage } from '../pages/DiscoverPage';
import { MusicianProfilePage } from '../pages/MusicianProfilePage';
import { MyProfilePage } from '../pages/MyProfilePage';
import { EditProfilePage } from '../pages/EditProfilePage';
import { ConnectionsPage } from '../pages/ConnectionsPage';

// Route Guards
function ProtectedMusicianRoute({ children }) {
  const { isAuthenticated, hasProfile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // PRD Section 19: Authenticated users without a profile should be redirected to Create Profile
  if (!hasProfile) {
    return <Navigate to="/create-profile" replace />;
  }

  return children;
}

function CreateProfileRoute({ children }) {
  const { isAuthenticated, hasProfile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If already completed profile, redirect to discover
  if (hasProfile) {
    return <Navigate to="/discover" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, hasProfile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage message="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={hasProfile ? "/discover" : "/create-profile"} replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Public Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />

      {/* Create Profile Route (Protected: requires auth, no profile yet) */}
      <Route
        path="/create-profile"
        element={
          <CreateProfileRoute>
            <CreateProfilePage />
          </CreateProfileRoute>
        }
      />

      {/* Full Musician Platform Routes (Protected: requires auth & profile) */}
      <Route
        path="/discover"
        element={
          <ProtectedMusicianRoute>
            <DiscoverPage />
          </ProtectedMusicianRoute>
        }
      />
      <Route
        path="/musician/:id"
        element={
          <ProtectedMusicianRoute>
            <MusicianProfilePage />
          </ProtectedMusicianRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedMusicianRoute>
            <MyProfilePage />
          </ProtectedMusicianRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedMusicianRoute>
            <EditProfilePage />
          </ProtectedMusicianRoute>
        }
      />
      <Route
        path="/connections"
        element={
          <ProtectedMusicianRoute>
            <ConnectionsPage />
          </ProtectedMusicianRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
