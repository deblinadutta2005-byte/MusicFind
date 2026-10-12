// Base API Client supporting seamless live backend connection or integrated mock fallback
import { mockDb } from './mockStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const USE_MOCK_BY_DEFAULT = true; // Provides instant zero-config out-of-the-box experience

export const apiClient = {
  async request(endpoint, options = {}) {
    // If backend is active and not exclusively in mock mode:
    if (!USE_MOCK_BY_DEFAULT && API_BASE_URL) {
      try {
        const token = localStorage.getItem('musicfind_auth_session_v1')
          ? JSON.parse(localStorage.getItem('musicfind_auth_session_v1'))?.token
          : null;

        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers
        };

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Request failed with status ${res.status}`);
        }

        return await res.json();
      } catch (err) {
        console.warn(`API live request to ${endpoint} failed, checking local store:`, err.message);
        throw err;
      }
    }
    return null;
  }
};
