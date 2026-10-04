import pool from '../config/db.js';

/**
 * GET /api/bookmarks
 * Returns all bookmarks for the authenticated user.
 */
export async function getUserBookmarks(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT b.id as bookmark_id, b.user_id, b.poem_id, b.created_at,
              p.title, p.language, p.type, p.content, p.published
       FROM bookmarks b
       JOIN poems p ON b.poem_id = p.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );

    const poemIds = rows.map((r) => r.poem_id);

    return res.json({
      success: true,
      bookmarks: rows,
      poemIds,
      data: rows
    });
  } catch (error) {
    console.error('[getUserBookmarks Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookmarks'
    });
  }
}

/**
 * POST /api/bookmarks
 * Adds a poem bookmark for the authenticated user.
 * Prevents duplicates via UNIQUE(user_id, poem_id).
 */
export async function addBookmark(req, res) {
  try {
    const userId = req.user.id;
    const rawPoemId = req.body.poemId || req.body.poem_id;
    const poemId = Number(rawPoemId);

    if (!poemId || isNaN(poemId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid poem ID is required'
      });
    }

    // Verify poem exists in database
    const [poemRows] = await pool.query('SELECT id, title FROM poems WHERE id = ?', [poemId]);
    if (!poemRows || poemRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Poem does not exist'
      });
    }

    try {
      await pool.query(
        'INSERT INTO bookmarks (user_id, poem_id) VALUES (?, ?)',
        [userId, poemId]
      );
    } catch (insertError) {
      // Handle MySQL UNIQUE constraint violation gracefully
      if (insertError.code === 'ER_DUP_ENTRY') {
        return res.json({
          success: true,
          message: 'Poem is already bookmarked',
          poemId
        });
      }
      throw insertError;
    }

    return res.status(201).json({
      success: true,
      message: 'Poem bookmarked successfully',
      poemId
    });
  } catch (error) {
    console.error('[addBookmark Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add bookmark'
    });
  }
}

/**
 * DELETE /api/bookmarks/:poemId
 * Removes a poem bookmark for the authenticated user.
 */
export async function removeBookmark(req, res) {
  try {
    const userId = req.user.id;
    const poemId = Number(req.params.poemId);

    if (!poemId || isNaN(poemId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid poem ID is required'
      });
    }

    const [result] = await pool.query(
      'DELETE FROM bookmarks WHERE user_id = ? AND poem_id = ?',
      [userId, poemId]
    );

    return res.json({
      success: true,
      message: 'Bookmark removed successfully',
      poemId,
      removed: result.affectedRows > 0
    });
  } catch (error) {
    console.error('[removeBookmark Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove bookmark'
    });
  }
}
