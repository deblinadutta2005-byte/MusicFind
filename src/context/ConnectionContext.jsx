import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { connectionService } from '../services/connectionService';
import { useAuth } from './AuthContext';
import { CONNECTION_STATUS } from '../data/constants';

const ConnectionContext = createContext(null);

export function ConnectionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittingIds, setSubmittingIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id === Date.now() ? null : prev));
    }, 4000);
  };

  const clearToast = () => setToastMessage(null);

  const fetchConnections = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    try {
      const data = await connectionService.getConnections(user.id);
      setRequests(data.requests || []);
      setSentRequests(data.sentRequests || []);
      setConnections(data.connections || []);
    } catch (err) {
      console.error('Failed to load connections:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConnections();
    } else {
      setConnections([]);
      setRequests([]);
      setSentRequests([]);
    }
  }, [isAuthenticated, user, fetchConnections]);

  const getConnectionStatus = useCallback((musician) => {
    if (!user || !musician) return CONNECTION_STATUS.NONE;
    
    const targetUserId = musician.userId || musician.id;
    if (targetUserId === user.id) {
      return CONNECTION_STATUS.SELF;
    }

    // Check accepted connections
    const isConnected = connections.some(
      c => c.requesterId === targetUserId || c.receiverId === targetUserId ||
           c.musician?.id === musician.id || c.musician?.userId === targetUserId
    );
    if (isConnected) return CONNECTION_STATUS.CONNECTED;

    // Check sent requests (pending)
    const isSent = sentRequests.some(
      c => c.receiverId === targetUserId || c.musician?.id === musician.id || c.musician?.userId === targetUserId
    );
    if (isSent) return CONNECTION_STATUS.SENT;

    // Check incoming requests (pending)
    const isReceived = requests.some(
      c => c.requesterId === targetUserId || c.musician?.id === musician.id || c.musician?.userId === targetUserId
    );
    if (isReceived) return CONNECTION_STATUS.RECEIVED;

    return CONNECTION_STATUS.NONE;
  }, [user, connections, sentRequests, requests]);

  const sendConnectionRequest = async (targetMusician) => {
    if (!user) throw new Error('Please log in to send connection requests.');
    const targetUserId = targetMusician.userId || targetMusician.id;
    
    if (targetUserId === user.id) {
      throw new Error('You cannot connect with yourself.');
    }

    if (submittingIds.has(targetUserId)) return;

    setSubmittingIds(prev => new Set(prev).add(targetUserId));
    try {
      const newConn = await connectionService.sendConnection(targetUserId, user.id);
      // Optimistic update (normalized to match getConnections shape)
      const normalized = {
        id: newConn.id,
        requesterId: newConn.requesterId || newConn.sender_id || user.id,
        receiverId: newConn.receiverId || newConn.receiver_id || targetUserId,
        status: newConn.status || 'pending',
        createdAt: newConn.createdAt || newConn.created_at || new Date().toISOString(),
        musician: newConn.musician || targetMusician
      };
      setSentRequests(prev => [normalized, ...prev]);
      showToast(`Connection request sent to ${targetMusician.name}!`, 'success');
      return newConn;
    } catch (err) {
      showToast(err.message || 'Unable to send connection request.', 'error');
      throw err;
    } finally {
      setSubmittingIds(prev => {
        const next = new Set(prev);
        next.delete(targetUserId);
        return next;
      });
    }
  };

  const acceptConnection = async (connectionId) => {
    if (submittingIds.has(connectionId)) return;
    setSubmittingIds(prev => new Set(prev).add(connectionId));
    try {
      await connectionService.updateConnection(connectionId, 'accept');
      const targetReq = requests.find(r => r.id === connectionId);
      if (targetReq) {
        setRequests(prev => prev.filter(r => r.id !== connectionId));
        setConnections(prev => [{ ...targetReq, status: 'accepted' }, ...prev]);
        showToast(`Connected with ${targetReq.musician?.name || 'musician'}!`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to accept connection.', 'error');
      throw err;
    } finally {
      setSubmittingIds(prev => {
        const next = new Set(prev);
        next.delete(connectionId);
        return next;
      });
    }
  };

  const rejectConnection = async (connectionId) => {
    if (submittingIds.has(connectionId)) return;
    setSubmittingIds(prev => new Set(prev).add(connectionId));
    try {
      await connectionService.updateConnection(connectionId, 'reject');
      setRequests(prev => prev.filter(r => r.id !== connectionId));
      showToast('Connection request declined.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to decline request.', 'error');
      throw err;
    } finally {
      setSubmittingIds(prev => {
        const next = new Set(prev);
        next.delete(connectionId);
        return next;
      });
    }
  };

  const isSubmitting = (id) => submittingIds.has(id);

  const value = {
    connections,
    requests,
    sentRequests,
    loading,
    toastMessage,
    clearToast,
    showToast,
    fetchConnections,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    getConnectionStatus,
    isSubmitting,
    pendingRequestsCount: requests.length
  };

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

export function useConnections() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
}
