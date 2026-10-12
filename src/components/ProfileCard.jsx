import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Music, Disc3, ArrowRight, UserCheck, CheckCircle, Send, User } from 'lucide-react';
import { useConnections } from '../context/ConnectionContext';
import { Button } from './Button';
import { CONNECTION_STATUS } from '../data/constants';

export function ProfileCard({ musician }) {
  const { getConnectionStatus, sendConnectionRequest, isSubmitting } = useConnections();
  const status = getConnectionStatus(musician);
  const isSending = isSubmitting(musician.userId || musician.id);

  const handleConnectClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await sendConnectionRequest(musician);
    } catch {
      // handled by toast
    }
  };

  const renderStatusButton = () => {
    switch (status) {
      case CONNECTION_STATUS.SELF:
        return (
          <span className="status-badge status-self">
            <User size={14} />
            <span>You</span>
          </span>
        );
      case CONNECTION_STATUS.CONNECTED:
        return (
          <span className="status-badge status-connected">
            <UserCheck size={14} />
            <span>Connected</span>
          </span>
        );
      case CONNECTION_STATUS.SENT:
        return (
          <span className="btn btn-success-outline btn-sm card-connect-btn">
            <CheckCircle size={14} className="btn-icon" />
            <span>Request Sent</span>
          </span>
        );
      case CONNECTION_STATUS.RECEIVED:
        return (
          <Link to="/connections" className="status-badge status-received">
            <span>Respond in Requests</span>
          </Link>
        );
      default:
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={handleConnectClick}
            isLoading={isSending}
            loadingText="Sending..."
            icon={Send}
            className="card-connect-btn"
          >
            Connect
          </Button>
        );
    }
  };

  return (
    <div className="musician-card">
      <div className="card-image-container">
        <img
          src={musician.profileImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600"}
          alt={musician.name}
          className="card-image"
          loading="lazy"
        />
        <div className="card-role-chip">
          <span>{musician.role || 'Musician'}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-name" title={musician.name}>{musician.name}</h3>
          <div className="card-location">
            <MapPin size={14} className="text-accent" />
            <span>{musician.location || 'Unknown location'}</span>
          </div>
        </div>

        <div className="card-tags-row">
          <span className="tag-pill tag-instrument">
            <Music size={13} />
            {musician.instrument || 'Instrument'}
          </span>
          <span className="tag-pill tag-genre">
            <Disc3 size={13} />
            {musician.genre || 'Genre'}
          </span>
        </div>

        <p className="card-bio">
          {musician.bio ? (musician.bio.length > 115 ? `${musician.bio.slice(0, 115)}...` : musician.bio) : 'Passionate musician looking to collaborate.'}
        </p>

        {musician.lookingFor && (
          <div className="card-looking-for">
            <span className="looking-label">Looking for:</span>
            <span className="looking-val">{musician.lookingFor}</span>
          </div>
        )}

        <div className="card-footer-actions">
          <Link 
            to={`/musician/${musician.id || musician.userId}`} 
            className="btn btn-primary btn-sm flex-1"
          >
            <span>View Profile</span>
            <ArrowRight size={15} />
          </Link>
          {renderStatusButton()}
        </div>
      </div>
    </div>
  );
}
