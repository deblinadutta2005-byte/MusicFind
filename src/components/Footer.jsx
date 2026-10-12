import React from 'react';
import { Music, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="platform-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-info">
            <div className="footer-logo">
              <div className="brand-icon-wrapper sm">
                <Music size={18} className="brand-icon" />
              </div>
              <span className="brand-title">Music<span className="brand-gradient">Find</span></span>
            </div>
            <p className="footer-motto">
              Connecting passionate musicians, vocalists, and sound makers. Find your sound, build your band, and take the stage together.
            </p>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-nav">
              <li><Link to="/discover">Discover Musicians</Link></li>
              <li><Link to="/connections">Your Connections</Link></li>
              <li><Link to="/profile">Artist Profile</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Instruments</h4>
            <div className="footer-tags">
              <span>Guitar</span>
              <span>Drums</span>
              <span>Bass</span>
              <span>Keyboard</span>
              <span>Vocals</span>
              <span>Violin</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} MusicFind Platform. Built for artists worldwide.
          </p>
          <p className="footer-crafted">
            Made with <Heart size={14} className="inline-heart text-accent" /> for music lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
