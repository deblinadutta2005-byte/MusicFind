import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Music, 
  Users, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Headphones, 
  Mic2, 
  Drum, 
  Radio, 
  CheckCircle,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

export function LandingPage() {
  const { isAuthenticated, hasProfile } = useAuth();

  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-blob hero-blob-1" />
        <div className="hero-glow-blob hero-blob-2" />
        
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} className="text-amber" />
            <span>The #1 Musician Directory & Network</span>
          </div>

          <h1 className="hero-title">
            Find Your Sound. <br />
            <span className="hero-title-gradient">Find Your People.</span>
          </h1>

          <p className="hero-subtitle">
            Discover musicians and vocalists near you for jamming, concerts, band formation, and creative collaborations.
          </p>

          <div className="hero-cta-group">
            {isAuthenticated && hasProfile ? (
              <Link to="/discover">
                <Button size="lg" variant="primary" icon={Compass}>
                  Go to Discover
                </Button>
              </Link>
            ) : isAuthenticated && !hasProfile ? (
              <Link to="/create-profile">
                <Button size="lg" variant="primary" icon={Sparkles}>
                  Complete Your Profile
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup" id="hero-signup-btn">
                  <Button size="lg" variant="primary" icon={ArrowRight}>
                    Let's Start
                  </Button>
                </Link>
                <Link to="/login" id="hero-login-btn">
                  <Button size="lg" variant="outline">
                    Existing User Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics / Social Proof */}
          <div className="hero-stats-row">
            <div className="stat-card">
              <span className="stat-number">1,200+</span>
              <span className="stat-label">Verified Musicians</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">30+</span>
              <span className="stat-label">Cities Covered</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">450+</span>
              <span className="stat-label">Bands Formed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase Categories (PRD Section 4: Visual sections for guitarists, vocalists, drummers, etc.) */}
      <section className="showcase-section">
        <div className="section-header text-center">
          <h2 className="section-title">Built for Every Kind of Sound Maker</h2>
          <p className="section-subtitle-text">
            Whatever instrument you play or style you love, your next bandmate is already here.
          </p>
        </div>

        <div className="instrument-showcase-grid">
          {/* Guitarists */}
          <div className="showcase-card">
            <div className="showcase-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80"
                alt="Guitarists"
                className="showcase-img"
              />
              <div className="showcase-overlay" />
            </div>
            <div className="showcase-content">
              <div className="showcase-icon-badge">
                <Music size={20} />
              </div>
              <h3 className="showcase-card-title">Guitarists & Bassists</h3>
              <p className="showcase-card-desc">
                Rhythm riffers, progressive soloists, fingerstyle storytellers, and thunderous bass groovers.
              </p>
            </div>
          </div>

          {/* Vocalists */}
          <div className="showcase-card">
            <div className="showcase-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                alt="Vocalists"
                className="showcase-img"
              />
              <div className="showcase-overlay" />
            </div>
            <div className="showcase-content">
              <div className="showcase-icon-badge">
                <Mic2 size={20} />
              </div>
              <h3 className="showcase-card-title">Vocalists & Songwriters</h3>
              <p className="showcase-card-desc">
                Soulful lead singers, acoustic songwriters, opera/classical powerhouses, and harmonizers.
              </p>
            </div>
          </div>

          {/* Drummers */}
          <div className="showcase-card">
            <div className="showcase-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                alt="Drummers"
                className="showcase-img"
              />
              <div className="showcase-overlay" />
            </div>
            <div className="showcase-content">
              <div className="showcase-icon-badge">
                <Drum size={20} />
              </div>
              <h3 className="showcase-card-title">Drummers & Percussionists</h3>
              <p className="showcase-card-desc">
                Pocket masters, heavy rock hitters, jazz syncopators, and live electronic trigger producers.
              </p>
            </div>
          </div>

          {/* Keys & Strings */}
          <div className="showcase-card">
            <div className="showcase-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80"
                alt="Keyboards & Strings"
                className="showcase-img"
              />
              <div className="showcase-overlay" />
            </div>
            <div className="showcase-content">
              <div className="showcase-icon-badge">
                <Radio size={20} />
              </div>
              <h3 className="showcase-card-title">Keys, Violins & Flutes</h3>
              <p className="showcase-card-desc">
                Classical virtuosos, synth explorers, ambient soundscapers, and traditional acoustic instrumentalists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (PRD Section 22: Complete Frontend User Journey) */}
      <section className="how-it-works-section">
        <div className="section-header text-center">
          <span className="sub-heading-pill">Simple 4-Step Process</span>
          <h2 className="section-title">How MusicFind Works</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3 className="step-title">Create Profile</h3>
            <p className="step-desc">
              List your role, instrument, genre, location, experience, and external social handles.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3 className="step-title">Discover & Filter</h3>
            <p className="step-desc">
              Search by city, instrument, or genre to discover local artists looking for jamming and gigs.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3 className="step-title">Send Request</h3>
            <p className="step-desc">
              Send a connection request with 1-click. Once accepted, your connection status turns active.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <h3 className="step-title">Jam & Collaborate</h3>
            <p className="step-desc">
              Access their Instagram, Facebook, or music channels to coordinate rehearsals and stage concerts.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-content">
            <h2 className="cta-heading">Ready to Make Music?</h2>
            <p className="cta-desc">
              Join thousands of musicians looking for their next gig or jamming session today.
            </p>
          </div>
          <div className="cta-btn-wrap">
            <Link to="/signup">
              <Button size="lg" variant="primary" icon={Sparkles}>
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
