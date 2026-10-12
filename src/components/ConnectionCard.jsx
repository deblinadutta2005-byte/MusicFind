import React from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  X,
  MapPin,
  Music,
  Disc3,
  ArrowRight,
  Globe,
  ExternalLink
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';
import { Button } from './Button';
import { useConnections } from '../context/ConnectionContext';

export function ConnectionCard({
  connection,
  type = 'accepted', // 'request' | 'sent' | 'accepted'
  onAccept,
  onReject
}) {
  const { isSubmitting } = useConnections();
  const musician = connection.musician || {};
  const isBusy = isSubmitting(connection.id);

  const formattedDate = connection.createdAt
    ? new Date(connection.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    })
    : null;

  return (
    <div className={`connection-card-item connection-card-${type}`}>
      <div className="conn-avatar-wrapper">
        <img
          src={musician.profileImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'}
          alt={musician.name || 'Musician'}
          className="conn-avatar"
        />
        <span className="conn-role-pill">{musician.role || 'Musician'}</span>
      </div>

      <div className="conn-info-col">
        <div className="conn-header-line">
          <h3 className="conn-name">{musician.name || 'Musician Artist'}</h3>
          {formattedDate && (
            <span className="conn-date">
              {type === 'request' ? `Requested ${formattedDate}` : `Connected ${formattedDate}`}
            </span>
          )}
        </div>

        <div className="conn-meta-tags">
          <span className="meta-tag">
            <MapPin size={13} className="text-accent" />
            {musician.location || 'Location'}
          </span>
          <span className="meta-tag">
            <Music size={13} className="text-purple" />
            {musician.instrument || 'Instrument'}
          </span>
          <span className="meta-tag">
            <Disc3 size={13} className="text-cyan" />
            {musician.genre || 'Genre'}
          </span>
        </div>

        {musician.bio && (
          <p className="conn-bio-snippet">
            {musician.bio.length > 90 ? `${musician.bio.slice(0, 90)}...` : musician.bio}
          </p>
        )}

        {/* Social Links for Connected Members (PRD Section 13: External Communication) */}
        {type === 'accepted' && (
          <div className="conn-social-tray">
            <span className="social-label">Reach out via:</span>
            <div className="social-links-list">
              {musician.instagramUrl ? (
                <a
                  href={
                    musician.instagramUrl.startsWith('http')
                      ? musician.instagramUrl
                      : `https://www.instagram.com/${musician.instagramUrl.replace(/^@/, '')}/`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-badge social-instagram"
                  title="Instagram"
                >
                  <InstagramIcon size={14} />
                  <span>Instagram</span>
                  <ExternalLink size={11} className="ml-1" />
                </a>
              ) : null}

              {musician.facebookUrl ? (
                <a
                  href={musician.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-badge social-facebook"
                  title="Facebook"
                >
                  <FacebookIcon size={14} />
                  <span>Facebook</span>
                  <ExternalLink size={11} className="ml-1" />
                </a>
              ) : null}

              {musician.otherSocialUrl ? (
                <a
                  href={musician.otherSocialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-badge social-other"
                  title="Music Link"
                >
                  <Globe size={14} />
                  <span>Music Link</span>
                  <ExternalLink size={11} className="ml-1" />
                </a>
              ) : null}

              {!musician.instagramUrl && !musician.facebookUrl && !musician.otherSocialUrl && (
                <span className="text-muted text-xs">No direct social links provided</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Right Action Controls */}
      <div className="conn-action-col">
        {type === 'request' && (
          <div className="request-buttons-group">
            <Button
              variant="success"
              size="sm"
              icon={Check}
              isLoading={isBusy}
              loadingText="Accepting..."
              onClick={() => onAccept(connection.id)}
              className="btn-accept"
            >
              Accept
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={X}
              isLoading={isBusy}
              loadingText="Rejecting..."
              onClick={() => onReject(connection.id)}
              className="btn-reject"
            >
              Reject
            </Button>
          </div>
        )}

        {type === 'sent' && (
          <div className="sent-status-box">
            <span className="status-badge status-sent">Pending Acceptance</span>
          </div>
        )}

        {type === 'accepted' && (
          <Link
            to={`/musician/${musician.id || musician.userId}`}
            className="btn btn-outline btn-sm"
          >
            <span>View Profile</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
