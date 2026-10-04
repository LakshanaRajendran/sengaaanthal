import { apiRequest } from './api';

const ADMIN_TOKEN_KEY = 'sengaanthal_admin_token';
const ADMIN_USER_KEY = 'sengaanthal_admin_user';
const READER_TOKEN_KEY = 'sengaanthal_reader_token';
const READER_SESSION_ID_KEY = 'sengaanthal_reader_session_id';

export const authService = {
  // Admin Login
  async login(email, password) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    if (res.success && res.token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, res.token);
      if (res.user) {
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(res.user));
      }
    }
    return res;
  },

  // Check Current Authenticated Admin
  async getMe() {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return null;

    try {
      const res = await apiRequest('/auth/me', { token });
      if (res.success && res.user) {
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(res.user));
        return res.user;
      }
      return null;
    } catch {
      this.logout();
      return null;
    }
  },

  // Admin Logout
  logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },

  getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  getStoredAdminUser() {
    try {
      const user = localStorage.getItem(ADMIN_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAdminAuthenticated() {
    return Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));
  },

  // Reader Session Initialization for Bookmarks
  async initReaderSession() {
    let token = localStorage.getItem(READER_TOKEN_KEY);
    if (token) return token;

    let sessionId = localStorage.getItem(READER_SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = 'reader_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem(READER_SESSION_ID_KEY, sessionId);
    }

    try {
      const res = await apiRequest('/auth/reader-session', {
        method: 'POST',
        body: { sessionId }
      });

      if (res.success && res.token) {
        localStorage.setItem(READER_TOKEN_KEY, res.token);
        return res.token;
      }
    } catch (err) {
      console.warn('[Reader Session]: Could not initialize reader session', err.message);
    }
    return null;
  },

  getReaderToken() {
    return localStorage.getItem(READER_TOKEN_KEY);
  }
};

export default authService;
