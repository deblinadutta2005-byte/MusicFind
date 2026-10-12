import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Music, 
  Disc3, 
  Edit3, 
  Sparkles, 
  Globe, 
  ExternalLink,
  Users
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../components/SocialIcons';
import { useAuth } from '../context/AuthContext';
import { useConnections } from '../context/ConnectionContext';
import { Button } from '../components/Button';

const getSocialHandle = (url, platform) => {
  if (!url) return '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const handle = segments[segments.length - 1] || parsed.hostname.replace('www.', '');
    return platform === 'instagram' ? `@${handle}` : handle;
  } catch {
    return url.replace(/^https?:\/\//, '');
  }
};

export function MyProfilePage() {
  const { profile, user } = useAuth();
  const { connections } = useConnections();

  if (!profile) {
    return (
      <div className="page-container text-center my-12">
        <h2>You haven't set up your musician profile yet.</h2>
        <Link to="/create-profile" className="btn btn-primary mt-4">
          Create Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="my-profile-header-banner">
        <div className="profile-banner-content">
          <div className="profile-avatar-box">
            <img
              src={profile.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600'}
              alt={profile.name}
              className="my-profile-avatar"
            />
          </div>

          <div className="my-profile-main-meta">
            <div className="my-profile-title-row">
              <h1 className="my-profile-name">{profile.name}</h1>
              <span className="my-profile-role-tag">{profile.role || 'Musician'}</span>
            </div>

            <div className="my-profile-sub-meta">
              <span className="meta-pill">
                <MapPin size={14} className="text-accent" />
                {profile.location || 'Location not set'}
              </span>
              <span className="meta-pill">
                <Music size={14} className="text-purple" />
                {profile.instrument}
              </span>
              <span className="meta-pill">
                <Disc3 size={14} className="text-cyan" />
                {profile.genre}
              </span>
              <Link to="/connections" className="meta-pill meta-conn-pill">
                <Users size={14} className="text-emerald" />
                <span>{connections.length} Connected</span>
              </Link>
            </div>
          </div>

          <div className="my-profile-actions">
            <Link to="/profile/edit" id="edit-profile-btn">
              <Button variant="outline" size="md" icon={Edit3}>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="my-profile-grid">
        {/* Left Column: Bio & Experience */}
        <div className="my-profile-left-col">
          <div className="profile-content-card">
            <h3 className="card-section-heading">
              <Sparkles size={18} className="text-accent" />
              <span>About You & Musical Style</span>
            </h3>
            <p className="profile-full-bio">{profile.bio || 'No bio provided yet.'}</p>
          </div>

          <div className="profile-content-card">
            <h3 className="card-section-heading">
              <Music size={18} className="text-purple" />
              <span>Experience & Journey</span>
            </h3>
            <p className="profile-experience-text">
              {profile.experience || 'No experience details specified yet.'}
            </p>
          </div>
        </div>

        {/* Right Column: Looking For & Social Links */}
        <div className="my-profile-right-col">
          <div className="profile-content-card">
            <h3 className="card-section-heading">
              <Sparkles size={18} className="text-amber" />
              <span>Looking For</span>
            </h3>
            <div className="looking-for-highlight">
              <span className="highlight-tag">{profile.lookingFor || 'Jamming'}</span>
            </div>
          </div>

          <div className="profile-content-card">
            <h3 className="card-section-heading">
              <Globe size={18} className="text-cyan" />
              <span>Connected Social Media</span>
            </h3>

            <div className="social-links-vertical">
              {profile.instagramUrl ? (
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-btn instagram"
                >
                  <InstagramIcon size={18} />
                  <span>{getSocialHandle(profile.instagramUrl, 'instagram')}</span>
                  <ExternalLink size={14} className="ml-auto" />
                </a>
              ) : (
                <div className="social-profile-btn disabled">
                  <InstagramIcon size={18} />
                  <span>No Instagram link added</span>
                </div>
              )}

              {profile.facebookUrl ? (
                <a
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-btn facebook"
                >
                  <FacebookIcon size={18} />
                  <span>{getSocialHandle(profile.facebookUrl, 'facebook')}</span>
                  <ExternalLink size={14} className="ml-auto" />
                </a>
              ) : (
                <div className="social-profile-btn disabled">
                  <FacebookIcon size={18} />
                  <span>No Facebook link added</span>
                </div>
              )}

              {profile.otherSocialUrl ? (
                <a
                  href={profile.otherSocialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-btn other"
                >
                  <Globe size={18} />
                  <span>{getSocialHandle(profile.otherSocialUrl)}</span>
                  <ExternalLink size={14} className="ml-auto" />
                </a>
              ) : (
                <div className="social-profile-btn disabled">
                  <Globe size={18} />
                  <span>No portfolio / music link added</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
