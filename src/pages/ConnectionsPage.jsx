import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Inbox, 
  Send, 
  Compass, 
  Music, 
  Sparkles,
  Search
} from 'lucide-react';
import { useConnections } from '../context/ConnectionContext';
import { ConnectionCard } from '../components/ConnectionCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/Button';

export function ConnectionsPage() {
  const { 
    connections, 
    requests, 
    sentRequests, 
    loading, 
    acceptConnection, 
    rejectConnection 
  } = useConnections();

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'connections' | 'sent'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConnections = connections.filter(c => {
    if (!searchTerm.trim()) return true;
    const name = c.musician?.name || '';
    const inst = c.musician?.instrument || '';
    const genre = c.musician?.genre || '';
    const loc = c.musician?.location || '';
    const query = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(query) ||
      inst.toLowerCase().includes(query) ||
      genre.toLowerCase().includes(query) ||
      loc.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="connections-header">
        <div>
          <div className="page-badge">
            <Users size={16} className="text-accent" />
            <span>Network & Connections</span>
          </div>
          <h1 className="page-title">Manage Your Musical Network</h1>
          <p className="page-subtitle">
            Review incoming connection requests and stay in touch with your accepted fellow artists.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="connections-tabs-bar">
        <button
          className={`conn-tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <Inbox size={18} />
          <span>Connection Requests</span>
          {requests.length > 0 && (
            <span className="tab-pill-badge">{requests.length}</span>
          )}
        </button>

        <button
          className={`conn-tab-btn ${activeTab === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          <UserCheck size={18} />
          <span>Your Connections</span>
          <span className="tab-pill-badge neutral">{connections.length}</span>
        </button>

        <button
          className={`conn-tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          <Send size={16} />
          <span>Sent Requests</span>
          {sentRequests.length > 0 && (
            <span className="tab-pill-badge neutral">{sentRequests.length}</span>
          )}
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="connections-tab-content">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner message="Loading your connections..." />
          </div>
        ) : (
          <>
            {/* TAB 1: Incoming Connection Requests */}
            {activeTab === 'requests' && (
              <div className="tab-pane">
                <div className="pane-header-row">
                  <h2 className="pane-title">Pending Connection Requests</h2>
                  <span className="pane-count-label">
                    {requests.length} pending
                  </span>
                </div>

                {requests.length === 0 ? (
                  <div className="empty-state-box">
                    <div className="empty-icon-circle">
                      <Inbox size={36} className="text-muted" />
                    </div>
                    <h3 className="empty-heading">No pending requests</h3>
                    <p className="empty-subtext">
                      When other musicians want to connect with you, their requests will appear here.
                    </p>
                    <Link to="/discover" className="mt-4">
                      <Button variant="outline" size="sm" icon={Compass}>
                        Explore Discover
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="connection-cards-list">
                    {requests.map((req) => (
                      <ConnectionCard
                        key={req.id}
                        connection={req}
                        type="request"
                        onAccept={acceptConnection}
                        onReject={rejectConnection}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Accepted Connections */}
            {activeTab === 'connections' && (
              <div className="tab-pane">
                <div className="pane-header-row">
                  <div>
                    <h2 className="pane-title">Connected Artists</h2>
                    <p className="pane-desc">
                      Reach out directly using the social media & music links on each card.
                    </p>
                  </div>

                  {connections.length > 3 && (
                    <div className="conn-search-wrap">
                      <Search size={16} className="conn-search-icon" />
                      <input
                        type="text"
                        placeholder="Search your network..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="conn-search-input"
                      />
                    </div>
                  )}
                </div>

                {connections.length === 0 ? (
                  <div className="empty-state-box">
                    <div className="empty-icon-circle">
                      <Users size={36} className="text-muted" />
                    </div>
                    <h3 className="empty-heading">You haven't connected with any musicians yet</h3>
                    <p className="empty-subtext">
                      Search the Discover directory to find guitarists, vocalists, drummers and producers near you.
                    </p>
                    <Link to="/discover" className="mt-4">
                      <Button variant="primary" size="md" icon={Compass}>
                        Find Musicians Now
                      </Button>
                    </Link>
                  </div>
                ) : filteredConnections.length === 0 ? (
                  <div className="empty-state-box py-8">
                    <p className="empty-subtext">No connections matched "{searchTerm}".</p>
                    <Button variant="outline" size="sm" onClick={() => setSearchTerm('')} className="mt-2">
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  <div className="connection-cards-list">
                    {filteredConnections.map((conn) => (
                      <ConnectionCard
                        key={conn.id}
                        connection={conn}
                        type="accepted"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Outgoing Sent Requests */}
            {activeTab === 'sent' && (
              <div className="tab-pane">
                <div className="pane-header-row">
                  <h2 className="pane-title">Requests You Sent</h2>
                  <span className="pane-count-label">
                    {sentRequests.length} awaiting response
                  </span>
                </div>

                {sentRequests.length === 0 ? (
                  <div className="empty-state-box">
                    <div className="empty-icon-circle">
                      <Send size={36} className="text-muted" />
                    </div>
                    <h3 className="empty-heading">No active outgoing requests</h3>
                    <p className="empty-subtext">
                      You haven't sent any pending connection requests. Browse the directory to connect!
                    </p>
                    <Link to="/discover" className="mt-4">
                      <Button variant="primary" size="sm" icon={Compass}>
                        Discover Musicians
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="connection-cards-list">
                    {sentRequests.map((req) => (
                      <ConnectionCard
                        key={req.id}
                        connection={req}
                        type="sent"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
