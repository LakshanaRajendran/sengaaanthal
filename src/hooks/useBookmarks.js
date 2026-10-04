import { useState, useEffect, useCallback, useRef } from 'react';
import { bookmarkService } from '../services/bookmarkService';
import { authService } from '../services/authService';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedObjects, setBookmarkedObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInitializedRef = useRef(false);

  // Fetch bookmarks from MySQL backend
  const fetchBookmarks = useCallback(async () => {
    try {
      await authService.initReaderSession();
      const { bookmarks: fullList, poemIds } = await bookmarkService.getUserBookmarks();
      setBookmarks(poemIds || []);
      setBookmarkedObjects(fullList || []);
    } catch (err) {
      console.warn('[useBookmarks] Could not fetch bookmarks from MySQL:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchBookmarks();
    }
  }, [fetchBookmarks]);

  const addBookmark = useCallback(async (id) => {
    if (!id) return;
    const numId = Number(id);

    // Optimistic UI update
    setBookmarks((prev) => (prev.some((b) => Number(b) === numId) ? prev : [...prev, numId]));

    try {
      await authService.initReaderSession();
      await bookmarkService.addBookmark(numId);
      // Refresh to keep server data consistent
      const { bookmarks: fullList, poemIds } = await bookmarkService.getUserBookmarks();
      setBookmarks(poemIds || []);
      setBookmarkedObjects(fullList || []);
    } catch (err) {
      console.error('[useBookmarks] Error adding bookmark to MySQL:', err.message);
      // Revert on failure
      fetchBookmarks();
    }
  }, [fetchBookmarks]);

  const removeBookmark = useCallback(async (id) => {
    if (!id) return;
    const numId = Number(id);

    // Optimistic UI update
    setBookmarks((prev) => prev.filter((item) => Number(item) !== numId));
    setBookmarkedObjects((prev) => prev.filter((item) => Number(item.poem_id) !== numId));

    try {
      await authService.initReaderSession();
      await bookmarkService.removeBookmark(numId);
    } catch (err) {
      console.error('[useBookmarks] Error removing bookmark from MySQL:', err.message);
      fetchBookmarks();
    }
  }, [fetchBookmarks]);

  const toggleBookmark = useCallback(
    async (id) => {
      if (!id) return;
      const numId = Number(id);
      const isCurrentlyBookmarked = bookmarks.some((b) => Number(b) === numId);

      if (isCurrentlyBookmarked) {
        await removeBookmark(numId);
      } else {
        await addBookmark(numId);
      }
    },
    [bookmarks, addBookmark, removeBookmark]
  );

  const isBookmarked = useCallback(
    (id) => {
      if (!id) return false;
      const numId = Number(id);
      return bookmarks.some((b) => Number(b) === numId);
    },
    [bookmarks]
  );

  const getBookmarks = useCallback(() => {
    return bookmarks;
  }, [bookmarks]);

  return {
    bookmarks,
    bookmarkedObjects,
    loading,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    getBookmarks,
    refreshBookmarks: fetchBookmarks
  };
}

export default useBookmarks;
