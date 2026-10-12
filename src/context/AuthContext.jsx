import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const session = await authService.getCurrentSession();
        if (session && session.user) {
          setUser(session.user);
          if (session.profile) {
            setProfile(session.profile);
          } else {
            // Fetch profile if exists
            const fetchedProfile = await profileService.getMyProfile(session.user.id);
            if (fetchedProfile) {
              setProfile(fetchedProfile);
              setUser(prev => ({ ...prev, hasProfile: true }));
            }
          }
        }
      } catch (err) {
        console.error('Failed to restore session', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const signup = async ({ name, email, password }) => {
    const session = await authService.signup({ name, email, password });
    setUser(session.user);
    setProfile(null);
    return session;
  };

  const login = async ({ email, password }) => {
    const session = await authService.login({ email, password });
    setUser(session.user);

    // Fetch the existing profile so My Profile and route guards work immediately after login.
    let userProfile = session.profile || null;
    if (!userProfile && session.user) {
      userProfile = await profileService.getMyProfile(session.user.id);
    }

    if (userProfile) {
      setProfile(userProfile);
      setUser(prev => ({ ...prev, hasProfile: true }));
    } else {
      setProfile(null);
    }

    return { ...session, profile: userProfile };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
  };

  const createProfile = async (profileData) => {
    if (!user) throw new Error('You must be logged in to create a profile.');
    const newProfile = await profileService.createProfile(profileData, user.id);
    setProfile(newProfile);
    setUser(prev => ({ ...prev, hasProfile: true }));
    return newProfile;
  };

  const updateProfile = async (profileData) => {
    if (!user) throw new Error('You must be logged in to update your profile.');
    const updated = await profileService.updateProfile(profileData, user.id);
    setProfile(updated);
    return updated;
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await profileService.getMyProfile(user.id);
      setProfile(p);
      if (p) setUser(prev => ({ ...prev, hasProfile: true }));
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated: Boolean(user),
    hasProfile: Boolean(user?.hasProfile || profile),
    loading,
    signup,
    login,
    logout,
    createProfile,
    updateProfile,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
