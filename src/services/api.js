const rawApiUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

const DEFAULT_TIMEOUT_MS = 60000; // 60s timeout to allow Render free tier instances to spin up
const MAX_GET_RETRIES = 3;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientError(error, status) {
  if (status && [502, 503, 504, 520, 521, 522, 524].includes(status)) {
    return true;
  }
  if (!status && error && (error.name === 'TypeError' || error.name === 'AbortError')) {
    return true;
  }
  return false;
}

/**
 * Reusable HTTP client with Render cold-start tolerance and retry capability
 */
export async function apiRequest(
  endpoint,
  {
    method = 'GET',
    body = null,
    token = null,
    headers = {},
    timeout = DEFAULT_TIMEOUT_MS,
    retries = method === 'GET' ? MAX_GET_RETRIES : 0
  } = {}
) {
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

  let attempt = 0;
  while (true) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { ...config, signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Retry transient errors during Render cold start
        if (attempt <= retries && isTransientError(null, response.status)) {
          const delay = attempt * 1500;
          console.warn(`[API Retry] ${method} ${endpoint} (Status ${response.status}) — Retrying in ${delay}ms (Attempt ${attempt}/${retries})...`);
          await wait(delay);
          continue;
        }

        const errorMessage = data?.message || `HTTP error! Status: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry on network errors or timeouts during Render wake-up
      if (attempt <= retries && isTransientError(error, error.status)) {
        const delay = attempt * 1500;
        console.warn(`[API Retry] ${method} ${endpoint} (${error.message}) — Retrying in ${delay}ms (Attempt ${attempt}/${retries})...`);
        await wait(delay);
        continue;
      }

      console.error(`[API Error] ${method} ${endpoint}:`, error.message);
      throw error;
    }
  }
}

export default apiRequest;
