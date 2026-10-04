import { apiRequest } from './api';
import { normalizePoemData } from './poemService';

export const bookmarkService = {
  // Fetch all bookmarks for the authenticated user from MySQL
  async getUserBookmarks() {
    const res = await apiRequest('/bookmarks');
    const bookmarks = (res.bookmarks || res.data || []).map((b) => ({
      ...b,
      poem: normalizePoemData({
        id: b.poem_id,
        title: b.title,
        language: b.language,
        type: b.type,
        content: b.content,
        published: b.published
      })
    }));

    const poemIds = res.poemIds || bookmarks.map((b) => b.poem_id);
    return { bookmarks, poemIds };
  },

  // Save bookmark to MySQL
  async addBookmark(poemId) {
    return await apiRequest('/bookmarks', {
      method: 'POST',
      body: { poemId }
    });
  },

  // Remove bookmark from MySQL
  async removeBookmark(poemId) {
    return await apiRequest(`/bookmarks/${poemId}`, {
      method: 'DELETE'
    });
  }
};

export default bookmarkService;
