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

export const poemService = {
  // Public Reader: Fetch published poems by language & type
  async getPublishedPoems({ language, type } = {}) {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (type) params.append('type', type);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/poems${query}`);
    const list = res.poems || res.data || [];
    return list.map(normalizePoemData);
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
