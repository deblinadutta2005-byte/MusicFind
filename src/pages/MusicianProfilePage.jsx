import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Music, 
  Disc3, 
  User, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  ArrowLeft, 
  UserCheck, 
  CheckCircle, 
  Send, 
  Check, 
  X,
  Share2
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../components/SocialIcons';
import { musicianService } from '../services/musicianService';
import { useConnections } from '../context/ConnectionContext';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { CONNECTION_STATUS } from '../data/constants';

export function MusicianProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [musician, setMusician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { 
    getConnectionStatus, 
    sendConnectionRequest, 
    acceptConnection, 
    rejectConnection,
    requests,
    isSubmitting 
  } = useConnections();

  const fetchMusician = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await musicianService.getMusicianById(id);
      setMusician(data);
    } catch (err) {
      setError(err.message || 'Unable to load musician profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusician();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Loading musician profile..." />
      </div>
    );
  }

  if (error || !musician) {
    return (
      <div className="page-container">
        <div className="max-w-xl mx-auto my-12">
          <ErrorMessage message={error || 'Musician not found.'} onRetry={fetchMusician} />
          <div className="mt-4 text-center">
            <Link to="/discover" className="btn btn-outline btn-sm">
              <ArrowLeft size={16} />
              <span>Back to Discover</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = getConnectionStatus(musician);
  const targetId = musician.userId || musician.id;
  const isBusy = isSubmitting(targetId);

  // Find incoming connection request id if received
  const incomingReq = requests.find(
    r => r.requesterId === targetId || r.musician?.id === musician.id || r.musician?.userId === targetId
  );

  const handleSendConnect = async () => {
    try {
      await sendConnectionRequest(musician);
    } catch {
      // handled by toast
    }
  };

  const handleAccept = async () => {
    if (incomingReq) {
      await acceptConnection(incomingReq.id);
    }
  };

  const handleReject = async () => {
    if (incomingReq) {
      await rejectConnection(incomingReq.id);
    }
  };

  const renderRelationshipButton = () => {
    switch (status) {
      case CONNECTION_STATUS.SELF:
        return (
          <Link to="/profile/edit" className="btn btn-outline btn-md">
            <User size={16} />
            <span>Edit Your Profile</span>
          </Link>
        );

      case CONNECTION_STATUS.CONNECTED:
        return (
          <div className="connection-pill-connected">
            <UserCheck size={18} />
            <span>Connected</span>
          </div>
        );

      case CONNECTION_STATUS.SENT:
        return (
          <span className="btn btn-success-outline btn-lg">
            <CheckCircle size={18} className="btn-icon" />
            <span>Request Sent</span>
          </span>
        );

      case CONNECTION_STATUS.RECEIVED:
        return (
          <div className="incoming-actions-cluster">
            <span className="incoming-label">Incoming Request:</span>
            <Button
              variant="success"
              size="md"
              icon={Check}
              isLoading={incomingReq && isSubmitting(incomingReq.id)}
              loadingText="Accepting..."
              onClick={handleAccept}
            >
              Accept
            </Button>
            <Button
              variant="danger"
              size="md"
              icon={X}
              isLoading={incomingReq && isSubmitting(incomingReq.id)}
              loadingText="Rejecting..."
              onClick={handleReject}
            >
              Reject
            </Button>
          </div>
        );

      default:
        return (
          <Button
            variant="primary"
            size="lg"
            icon={Send}
            isLoading={isBusy}
            loadingText="Sending..."
            onClick={handleSendConnect}
            id="profile-connect-btn"
          >
            Connect
          </Button>
        );
    }
  };

  return (
    <div className="page-container">
      {/* Back button */}
      <div className="profile-top-navigation">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <div className="musician-profile-layout">
        {/* Left Side: Avatar & Core Identity */}
        <div className="profile-identity-card">
          <div className="profile-hero-image-wrap">
            <img
              src={musician.profileImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600'}
              alt={musician.name}
              className="profile-hero-image"
            />
            <span className="profile-role-badge">{musician.role || 'Musician'}</span>
          </div>

          <div className="profile-identity-info">
            <h1 className="profile-display-name">{musician.name}</h1>
            
            <div className="profile-meta-item">
              <MapPin size={16} className="text-accent" />
              <span>{musician.location || 'Location not specified'}</span>
            </div>

            <div className="profile-meta-item">
              <Music size={16} className="text-purple" />
              <span>{musician.instrument} • {musician.genre}</span>
            </div>

            {musician.lookingFor && (
              <div className="profile-looking-banner">
                <span className="looking-prefix">Looking For:</span>
                <span className="looking-value">{musician.lookingFor}</span>
              </div>
            )}

            {/* Relationship State Action Button (PRD Section 10 & 11) */}
            <div className="profile-primary-action-wrap">
              {renderRelationshipButton()}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Details, Bio, and External Socials */}
        <div className="profile-details-column">
          {/* Sound & Biography */}
          <div className="profile-content-card">
            <h2 className="card-section-heading">
              <Sparkles size={20} className="text-accent" />
              <span>About & Sound</span>
            </h2>
            <p className="profile-full-bio">
              {musician.bio || 'No bio provided.'}
            </p>

            {musician.skills && musician.skills.length > 0 && (
              <div className="skills-tags-cluster mt-4">
                <h4 className="skills-heading">Key Skills & Styles:</h4>
                <div className="skills-list">
                  {musician.skills.map((skill, i) => (
                    <span key={i} className="skill-chip">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience & Background */}
          {musician.experience && (
            <div className="profile-content-card">
              <h2 className="card-section-heading">
                <Music size={20} className="text-purple" />
                <span>Musical Experience</span>
              </h2>
              <p className="profile-experience-text">{musician.experience}</p>
            </div>
          )}

          {/* External Social Profiles (PRD Section 10 & 13) */}
          <div className="profile-content-card">
            <h2 className="card-section-heading">
              <Globe size={20} className="text-cyan" />
              <span>External Social & Music Links</span>
            </h2>
            <p className="social-notice-text">
              Connect to chat, listen to demos, and plan jam sessions:
            </p>

            <div className="social-profile-buttons-grid">
              {musician.instagramUrl ? (
                <a
                  href={musician.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-btn instagram"
                >
                  <InstagramIcon size={20} />
                  <div className="social-btn-text">
                    <span className="social-btn-title">Instagram</span>
                    <span className="social-btn-url">{musician.instagramUrl.replace(/^https?:\/\//, '')}</span>
                  </div>
                  <ExternalLink size={16} className="ml-auto" />
                </a>
              ) : (
                <div className="social-profile-btn disabled">
                  <InstagramIcon size={20} />
                  <span>Instagram not linked</span>
                </div>
              )}

              {musician.facebookUrl ? (
                <a
                  href={musician.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-btn facebook"
                >
                  <FacebookIcon size={20} />
                  <div className="social-btn-text">
                    <span className="social-btn-title">Facebook</span>
                    <span className="social-btn-url">{musician.facebookUrl.replace(/^https?:\/\//, '')}</span>
                  </div>
                  <ExternalLink size={16} className="ml-auto" />
                </a>
              ) : (
                <div className="social-profile-btn disabled">
                  <FacebookIcon size={20} />
                  <span>Facebook not linked</span>
                </div>
              )}

              {musician.otherSocialUrl ? (
                <a
                  href={musician.otherSocialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-btn other"
                >
                  <Globe size={20} />
                  <div className="social-btn-text">
                    <span className="social-btn-title">Audio / Portfolio Link</span>
                    <span className="social-btn-url">{musician.otherSocialUrl.replace(/^https?:\/\//, '')}</span>
                  </div>
                  <ExternalLink size={16} className="ml-auto" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
