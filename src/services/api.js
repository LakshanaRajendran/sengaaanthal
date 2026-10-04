const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Reusable HTTP client for all API calls
 */
export async function apiRequest(endpoint, { method = 'GET', body = null, token = null, headers = {} } = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  // If token is explicitly passed or available in localStorage
  const authToken = token || localStorage.getItem('sengaanthal_admin_token') || localStorage.getItem('sengaanthal_reader_token');
  if (authToken) {
    requestHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const config = {
    method,
    headers: requestHeaders
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `HTTP error! Status: ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Return friendly error messages, avoid leaking sensitive info
    console.error(`[API Error] ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

export default apiRequest;
