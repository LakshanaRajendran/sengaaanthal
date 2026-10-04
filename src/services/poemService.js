import { apiRequest } from './api';

export function normalizePoemData(poem) {
  if (!poem) return null;
  const contentArray = Array.isArray(poem.content)
    ? poem.content
    : typeof poem.content === 'string'
      ? poem.content.split('\n')
      : [];

  return {
    ...poem,
    content: contentArray,
    rawContent: typeof poem.content === 'string' ? poem.content : contentArray.join('\n')
  };
}

// In-memory cache preserving last successfully loaded poems per query
const poemCache = new Map();

export const poemService = {
  // Public Reader: Fetch published poems by language & type
  async getPublishedPoems({ language, type } = {}) {
    const cacheKey = `${language || 'all'}_${type || 'all'}`;
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (type) params.append('type', type);

    const query = params.toString() ? `?${params.toString()}` : '';

    try {
      const res = await apiRequest(`/poems${query}`);
      const rawList = res?.poems || res?.data;

      // Only treat as valid if the server actually returned an array of poems with items
      if (Array.isArray(rawList) && rawList.length > 0) {
        const normalized = rawList.map(normalizePoemData);
        poemCache.set(cacheKey, normalized);
        return normalized;
      }

      // If server returned empty or missing structure, preserve last known successful cache
      if (poemCache.has(cacheKey)) {
        console.warn(`[poemService] API returned non-array/empty data for ${cacheKey}; preserving last successful cache.`);
        return poemCache.get(cacheKey);
      }

      return Array.isArray(rawList) ? rawList.map(normalizePoemData) : [];
    } catch (err) {
      console.warn(`[poemService] Failed to load poems for ${cacheKey}:`, err.message);

      // Requirements: Never treat an API failure as an empty array; preserve last successful data
      if (poemCache.has(cacheKey)) {
        console.info(`[poemService] Returning preserved cached poems for ${cacheKey}`);
        return poemCache.get(cacheKey);
      }

      throw err;
    }
  },

  // Public Reader: Fetch single published poem
  async getPoemById(id) {
    const res = await apiRequest(`/poems/${id}`);
    return normalizePoemData(res.poem || res.data);
  },

  // Admin: Fetch all poems with search and filters
  async getAllPoemsAdmin({ search, language, type, status } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (language) params.append('language', language);
    if (type) params.append('type', type);
    if (status) params.append('status', status);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/poems/all${query}`);
    const list = res.poems || res.data || [];
    return list.map(normalizePoemData);
  },

  // Admin: Get statistics (total, published, draft, bookmarks)
  async getAdminStats() {
    const res = await apiRequest('/poems/stats');
    return res.data;
  },

  // Admin: Create poem
  async createPoem(poemData) {
    const res = await apiRequest('/poems', {
      method: 'POST',
      body: poemData
    });
    return normalizePoemData(res.poem || res.data);
  },

  // Admin: Update poem
  async updatePoem(id, poemData) {
    const res = await apiRequest(`/poems/${id}`, {
      method: 'PUT',
      body: poemData
    });
    return normalizePoemData(res.poem || res.data);
  },

  // Admin: Delete poem
  async deletePoem(id) {
    return await apiRequest(`/poems/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin: Publish
  async publishPoem(id) {
    return await apiRequest(`/poems/${id}/publish`, {
      method: 'PATCH'
    });
  },

  // Admin: Unpublish
  async unpublishPoem(id) {
    return await apiRequest(`/poems/${id}/unpublish`, {
      method: 'PATCH'
    });
  }
};

export default poemService;
