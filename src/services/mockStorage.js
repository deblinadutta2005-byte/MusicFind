import { DEFAULT_MUSICIANS, DEFAULT_CONNECTIONS, DEMO_PRESET_USERS } from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'musicfind_users_v1',
  AUTH: 'musicfind_auth_session_v1',
  PROFILES: 'musicfind_profiles_v1',
  MUSICIANS: 'musicfind_musicians_v1',
  CONNECTIONS: 'musicfind_connections_v1'
};

const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));

function initializeStorage() {
  // Clear all mock data and start fresh - only user-created data should persist
  localStorage.setItem(STORAGE_KEYS.MUSICIANS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify({}));
  localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify([]));
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

initializeStorage();

export const mockDb = {
  async signup({ name, email, password }) {
    await delay(500);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      password,
      hasProfile: false
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const session = {
      user: { id: newUser.id, name: newUser.name, email: newUser.email, hasProfile: false },
      token: 'jwt_mock_' + Math.random().toString(36).substring(2)
    };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
    return session;
  },

  async login({ email, password }) {
    await delay(450);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}');
    const userProfile = profiles[user.id] || null;
    const hasProfile = Boolean(userProfile);

    const session = {
      user: { id: user.id, name: user.name, email: user.email, hasProfile },
      token: 'jwt_mock_' + Math.random().toString(36).substring(2),
      profile: userProfile
    };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
    return session;
  },

  getCurrentSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async logout() {
    await delay(150);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    return { success: true };
  },

  async createProfile(profileData, userId) {
    await delay(600);
    try {
      const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}');
      const musicians = JSON.parse(localStorage.getItem(STORAGE_KEYS.MUSICIANS) || '[]');
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

      const profileId = 'prof_' + Date.now();
      const newProfile = {
        id: profileId,
        userId,
        ...profileData
      };

      profiles[userId] = newProfile;
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));

      // Also add to public musicians directory if not already there
      const existingMusicianIndex = musicians.findIndex(m => m.userId === userId);
      if (existingMusicianIndex >= 0) {
        musicians[existingMusicianIndex] = newProfile;
      } else {
        musicians.unshift(newProfile);
      }
      localStorage.setItem(STORAGE_KEYS.MUSICIANS, JSON.stringify(musicians));

      // Update user hasProfile flag
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex >= 0) {
        users[userIndex].hasProfile = true;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }

      // Update session
      const session = this.getCurrentSession();
      if (session && session.user) {
        session.user.hasProfile = true;
        session.profile = newProfile;
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
      }

      return newProfile;
    } catch {
      throw new Error('Unable to save your profile. Please try again.');
    }
  },

  async getMyProfile(userId) {
    await delay(300);
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}');
    const profile = profiles[userId] || null;
    return profile;
  },

  async updateProfile(profileData, userId) {
    await delay(500);
    try {
      const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}');
      const musicians = JSON.parse(localStorage.getItem(STORAGE_KEYS.MUSICIANS) || '[]');

      const existingProfile = profiles[userId] || {};
      const updated = {
        ...existingProfile,
        ...profileData,
        userId
      };

      profiles[userId] = updated;
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));

      const idx = musicians.findIndex(m => m.userId === userId || m.id === updated.id);
      if (idx >= 0) {
        musicians[idx] = updated;
      } else {
        musicians.unshift(updated);
      }
      localStorage.setItem(STORAGE_KEYS.MUSICIANS, JSON.stringify(musicians));

      const session = this.getCurrentSession();
      if (session) {
        session.profile = updated;
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
      }

      return updated;
    } catch {
      throw new Error('Unable to save your profile. Please try again.');
    }
  },

  async getMusicians({ location = '', role = '', genre = '', search = '' } = {}) {
    await delay(400);
    try {
      const musicians = JSON.parse(localStorage.getItem(STORAGE_KEYS.MUSICIANS) || '[]');
      const session = this.getCurrentSession();
      const currentUserId = session?.user?.id;
      
      let filtered = [...musicians];

      // Exclude current user's own profile from discover page
      if (currentUserId) {
        filtered = filtered.filter(m => m.userId !== currentUserId && m.id !== currentUserId);
      }

      if (location && location.trim() !== '') {
        const locLower = location.toLowerCase().trim();
        filtered = filtered.filter(m => m.location && m.location.toLowerCase().includes(locLower));
      }

      if (role && role.trim() !== '') {
        const roleLower = role.toLowerCase().trim();
        const matchesTerm = (value) =>
          typeof value === 'string' &&
          value.toLowerCase().split(',').map(v => v.trim()).includes(roleLower);
        filtered = filtered.filter(m => {
          if (!m.role && !m.instrument) return false;
          const matchRole = m.role && (m.role.toLowerCase() === roleLower || m.role.toLowerCase() === 'both');
          const matchInstrument = matchesTerm(m.instrument);
          return matchRole || matchInstrument;
        });
      }

      if (genre && genre.trim() !== '') {
        const genreLower = genre.toLowerCase().trim();
        filtered = filtered.filter(
          m => typeof m.genre === 'string' &&
            m.genre.toLowerCase().split(',').map(v => v.trim()).includes(genreLower)
        );
      }

      if (search && search.trim() !== '') {
        const sLower = search.toLowerCase().trim();
        filtered = filtered.filter(m => 
          (m.name && m.name.toLowerCase().includes(sLower)) ||
          (m.bio && m.bio.toLowerCase().includes(sLower)) ||
          (m.instrument && m.instrument.toLowerCase().includes(sLower)) ||
          (m.genre && m.genre.toLowerCase().includes(sLower)) ||
          (m.location && m.location.toLowerCase().includes(sLower))
        );
      }

      return filtered;
    } catch {
      throw new Error('Unable to load musicians. Please try again.');
    }
  },

  async getMusicianById(id) {
    await delay(300);
    const musicians = JSON.parse(localStorage.getItem(STORAGE_KEYS.MUSICIANS) || '[]');
    const musician = musicians.find(m => m.id === id || m.userId === id);
    if (!musician) {
      throw new Error('Musician not found.');
    }
    return musician;
  },

  async getConnections(currentUserId) {
    await delay(350);
    const connections = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONNECTIONS) || '[]');
    const musicians = JSON.parse(localStorage.getItem(STORAGE_KEYS.MUSICIANS) || '[]');

    const enriched = connections.map(conn => {
      const otherUserId = conn.requesterId === currentUserId ? conn.receiverId : conn.requesterId;
      const musician = musicians.find(m => m.userId === otherUserId || m.id === otherUserId) || conn.musician || {
        name: 'Musician Partner',
        role: 'Musician',
        instrument: 'Guitar',
        genre: 'Rock',
        location: 'Kolkata',
        profileImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600'
      };
      return {
        ...conn,
        musician
      };
    });

    // Incoming requests for current user (pending)
    const requestsReceived = enriched.filter(
      c => c.receiverId === currentUserId && c.status === 'pending'
    );

    // Requests sent by current user (pending)
    const requestsSent = enriched.filter(
      c => c.requesterId === currentUserId && c.status === 'pending'
    );

    // Accepted connections
    const acceptedConnections = enriched.filter(
      c => (c.requesterId === currentUserId || c.receiverId === currentUserId) && c.status === 'accepted'
    );

    return {
      requests: requestsReceived,
      sentRequests: requestsSent,
      connections: acceptedConnections
    };
  },

  async sendConnection(targetUserId, currentUserId) {
    await delay(600);
    try {
      if (targetUserId === currentUserId) {
        throw new Error('You cannot send a connection request to yourself.');
      }

      const connections = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONNECTIONS) || '[]');
      const musicians = JSON.parse(localStorage.getItem(STORAGE_KEYS.MUSICIANS) || '[]');

      // Check if connection already exists
      const existing = connections.find(
        c => (c.requesterId === currentUserId && c.receiverId === targetUserId) ||
             (c.requesterId === targetUserId && c.receiverId === currentUserId)
      );

      if (existing) {
        if (existing.status === 'accepted') {
          throw new Error('You are already connected.');
        }
        if (existing.status === 'pending') {
          throw new Error('Connection request is already pending.');
        }
      }

      const targetMusician = musicians.find(m => m.userId === targetUserId || m.id === targetUserId);

      const newConnection = {
        id: 'conn_' + Date.now(),
        requesterId: currentUserId,
        receiverId: targetUserId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        musician: targetMusician
      };

      connections.unshift(newConnection);
      localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
      return newConnection;
    } catch (err) {
      throw new Error(err.message || 'Unable to send connection request.');
    }
  },

  async updateConnection(connectionId, action) {
    await delay(450);
    try {
      const connections = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONNECTIONS) || '[]');
      const index = connections.findIndex(c => c.id === connectionId);

      if (index === -1) {
        throw new Error('Connection request not found.');
      }

      if (action === 'accept') {
        connections[index].status = 'accepted';
        connections[index].acceptedAt = new Date().toISOString();
      } else if (action === 'reject') {
        connections.splice(index, 1);
      } else {
        throw new Error('Invalid connection action.');
      }

      localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
      return { success: true, connection: connections[index] || null };
    } catch (err) {
      throw new Error(err.message || 'Failed to update connection.');
    }
  }
};
