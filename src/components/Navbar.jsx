import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Music, 
  Compass, 
  Users, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useConnections } from '../context/ConnectionContext';

export function Navbar() {
  const { user, profile, isAuthenticated, hasProfile, logout } = useAuth();
  const { pendingRequestsCount } = useConnections();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Music className="brand-icon" size={22} />
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-title">Music<span className="brand-gradient">Find</span></span>
            <span className="brand-tagline">Connect & Jam</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {isAuthenticated && hasProfile ? (
            <>
              <NavLink 
                to="/discover" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Compass size={18} />
                <span>Discover</span>
              </NavLink>

              <NavLink 
                to="/connections" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Users size={18} />
                <span>Connections</span>
                {pendingRequestsCount > 0 && (
                  <span className="nav-badge" title={`${pendingRequestsCount} pending requests`}>
                    {pendingRequestsCount}
                  </span>
                )}
              </NavLink>

              <NavLink 
                to="/profile" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <User size={18} />
                <span>My Profile</span>
              </NavLink>

              <div className="nav-user-pill">
                <img 
                  src={profile?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
                  alt={profile?.name || user?.name || "Avatar"} 
                  className="nav-avatar"
                />
                <span className="nav-username">{profile?.name || user?.name}</span>
              </div>

              <button 
                onClick={handleLogout} 
                className="btn-logout"
                title="Log out"
                id="navbar-logout-button"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : isAuthenticated && !hasProfile ? (
            <>
              <NavLink 
                to="/create-profile" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Sparkles size={18} />
                <span>Create Profile</span>
              </NavLink>
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" id="nav-login-link">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm" id="nav-signup-button">
                <UserPlus size={16} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-links">
            {isAuthenticated && hasProfile ? (
              <>
                <div className="mobile-user-card">
                  <img 
                    src={profile?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
                    alt={profile?.name || user?.name || "Avatar"} 
                    className="mobile-avatar"
                  />
                  <div>
                    <p className="mobile-name">{profile?.name || user?.name}</p>
                    <p className="mobile-role-text">{profile?.role || 'Musician'} • {profile?.instrument || 'Artist'}</p>
                  </div>
                </div>

                <NavLink 
                  to="/discover" 
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Compass size={20} />
                  <span>Discover Musicians</span>
                </NavLink>

                <NavLink 
                  to="/connections" 
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users size={20} />
                  <span>Connections</span>
                  {pendingRequestsCount > 0 && (
                    <span className="nav-badge ml-auto">{pendingRequestsCount} new</span>
                  )}
                </NavLink>

                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>My Profile</span>
                </NavLink>

                <button 
                  onClick={handleLogout} 
                  className="mobile-nav-link mobile-logout-btn"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : isAuthenticated && !hasProfile ? (
              <>
                <NavLink 
                  to="/create-profile" 
                  className="mobile-nav-link active"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Sparkles size={20} />
                  <span>Complete Your Profile</span>
                </NavLink>
                <button onClick={handleLogout} className="mobile-nav-link mobile-logout-btn">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-primary btn-block mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
