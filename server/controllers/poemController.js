import pool from '../config/db.js';

// Helper to normalize content: if passed as array, join with \n; if string, trim
function normalizeContent(content) {
  if (Array.isArray(content)) {
    return content.join('\n');
  }
  return typeof content === 'string' ? content.trim() : '';
}

// Helper to format poem row for client
function formatPoem(row) {
  return {
    id: row.id,
    title: row.title,
    language: row.language,
    type: row.type,
    content: row.content,
    published: Boolean(row.published),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

/**
 * GET /api/poems
 * Public endpoint for Reader.
 * Returns only published poems.
 * Supports filters: ?language=tamil&type=poem
 */
export async function getPublishedPoems(req, res) {
  try {
    const { language, type } = req.query;

    let query = 'SELECT * FROM poems WHERE published = TRUE';
    const params = [];

    if (language && (language === 'tamil' || language === 'english')) {
      query += ' AND language = ?';
      params.push(language);
    }

    if (type && (type === 'poem' || type === 'haiku')) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY id ASC';

    const [rows] = await pool.query(query, params);
    const poems = rows.map(formatPoem);

    return res.json({
      success: true,
      poems,
      data: poems
    });
  } catch (error) {
    console.error('[getPublishedPoems Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch poems'
    });
  }
}

/**
 * GET /api/poems/:id
 * Public endpoint for Reader.
 * Returns single published poem.
 */
export async function getPublishedPoemById(req, res) {
  try {
    const poemId = Number(req.params.id);
    if (!poemId || isNaN(poemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid poem ID'
      });
    }

    const [rows] = await pool.query(
      'SELECT * FROM poems WHERE id = ? AND published = TRUE',
      [poemId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Poem not found'
      });
    }

    const poem = formatPoem(rows[0]);
    return res.json({
      success: true,
      poem,
      data: poem
    });
  } catch (error) {
    console.error('[getPublishedPoemById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch poem'
    });
  }
}

/**
 * GET /api/poems/all
 * ADMIN ONLY.
 * Returns all poems (published & draft) with search and filters.
 */
export async function getAllPoemsAdmin(req, res) {
  try {
    const { search, language, type, status } = req.query;

    let query = 'SELECT * FROM poems WHERE 1=1';
    const params = [];

    if (search && search.trim()) {
      query += ' AND title LIKE ?';
      params.push(`%${search.trim()}%`);
    }

    if (language && language !== 'all' && (language === 'tamil' || language === 'english')) {
      query += ' AND language = ?';
      params.push(language);
    }

    if (type && type !== 'all' && (type === 'poem' || type === 'haiku')) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (status && status !== 'all') {
      if (status === 'published') {
        query += ' AND published = TRUE';
      } else if (status === 'draft') {
        query += ' AND published = FALSE';
      }
    }

    query += ' ORDER BY id DESC';

    const [rows] = await pool.query(query, params);
    const poems = rows.map(formatPoem);

    return res.json({
      success: true,
      poems,
      data: poems
    });
  } catch (error) {
    console.error('[getAllPoemsAdmin Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch poems for administration'
    });
  }
}

/**
 * POST /api/poems
 * ADMIN ONLY.
 * Create a new poem.
 */
export async function createPoem(req, res) {
  try {
    const { title, language, type, content, published } = req.body;

    // Backend validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Poem title is required'
      });
    }

    if (!language || !['tamil', 'english'].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Language must be either 'tamil' or 'english'"
      });
    }

    if (!type || !['poem', 'haiku'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'poem' or 'haiku'"
      });
    }

    const normalizedContent = normalizeContent(content);
    if (!normalizedContent) {
      return res.status(400).json({
        success: false,
        message: 'Poem content cannot be empty'
      });
    }

    const isPublished = published === true || published === 1 || published === 'true';

    // Parameterized SQL query
    const [result] = await pool.query(
      'INSERT INTO poems (title, language, type, content, published) VALUES (?, ?, ?, ?, ?)',
      [title.trim(), language, type, normalizedContent, isPublished]
    );

    const [newPoemRows] = await pool.query('SELECT * FROM poems WHERE id = ?', [result.insertId]);
    const newPoem = formatPoem(newPoemRows[0]);

    return res.status(201).json({
      success: true,
      message: 'Poem created successfully',
      poem: newPoem,
      data: newPoem
    });
  } catch (error) {
    console.error('[createPoem Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create poem. Please try again.'
    });
  }
}

/**
 * PUT /api/poems/:id
 * ADMIN ONLY.
 * Edit an existing poem.
 */
export async function updatePoem(req, res) {
  try {
    const poemId = Number(req.params.id);
    if (!poemId || isNaN(poemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid poem ID'
      });
    }

    const { title, language, type, content, published } = req.body;

    // Check if poem exists
    const [existing] = await pool.query('SELECT * FROM poems WHERE id = ?', [poemId]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Poem not found'
      });
    }

    // Backend validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Poem title is required'
      });
    }

    if (!language || !['tamil', 'english'].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Language must be either 'tamil' or 'english'"
      });
    }

    if (!type || !['poem', 'haiku'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'poem' or 'haiku'"
      });
    }

    const normalizedContent = normalizeContent(content);
    if (!normalizedContent) {
      return res.status(400).json({
        success: false,
        message: 'Poem content cannot be empty'
      });
    }

    const isPublished = published === true || published === 1 || published === 'true';

    // Parameterized SQL query
    await pool.query(
      'UPDATE poems SET title = ?, language = ?, type = ?, content = ?, published = ? WHERE id = ?',
      [title.trim(), language, type, normalizedContent, isPublished, poemId]
    );

    const [updatedRows] = await pool.query('SELECT * FROM poems WHERE id = ?', [poemId]);
    const updatedPoem = formatPoem(updatedRows[0]);

    return res.json({
      success: true,
      message: 'Poem updated successfully',
      poem: updatedPoem,
      data: updatedPoem
    });
  } catch (error) {
    console.error('[updatePoem Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update poem'
    });
  }
}

/**
 * DELETE /api/poems/:id
 * ADMIN ONLY.
 * Associated bookmarks cascade delete in MySQL.
 */
export async function deletePoem(req, res) {
  try {
    const poemId = Number(req.params.id);
    if (!poemId || isNaN(poemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid poem ID'
      });
    }

    const [existing] = await pool.query('SELECT id, title FROM poems WHERE id = ?', [poemId]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Poem not found'
      });
    }

    // Parameterized SQL query
    await pool.query('DELETE FROM poems WHERE id = ?', [poemId]);

    return res.json({
      success: true,
      message: `Poem "${existing[0].title}" deleted successfully`
    });
  } catch (error) {
    console.error('[deletePoem Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete poem'
    });
  }
}

/**
 * PATCH /api/poems/:id/publish
 * ADMIN ONLY.
 */
export async function publishPoem(req, res) {
  try {
    const poemId = Number(req.params.id);
    if (!poemId || isNaN(poemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid poem ID'
      });
    }

    const [result] = await pool.query('UPDATE poems SET published = TRUE WHERE id = ?', [poemId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Poem not found'
      });
    }

    return res.json({
      success: true,
      message: 'Poem published successfully'
    });
  } catch (error) {
    console.error('[publishPoem Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish poem'
    });
  }
}

/**
 * PATCH /api/poems/:id/unpublish
 * ADMIN ONLY.
 */
export async function unpublishPoem(req, res) {
  try {
    const poemId = Number(req.params.id);
    if (!poemId || isNaN(poemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid poem ID'
      });
    }

    const [result] = await pool.query('UPDATE poems SET published = FALSE WHERE id = ?', [poemId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Poem not found'
      });
    }

    return res.json({
      success: true,
      message: 'Poem unpublished successfully'
    });
  } catch (error) {
    console.error('[unpublishPoem Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unpublish poem'
    });
  }
}

/**
 * GET /api/poems/stats
 * ADMIN ONLY.
 * Stats for Dashboard: Total, Published, Draft, Total Bookmarks.
 */
export async function getAdminStats(req, res) {
  try {
    const [[totalPoemsRow]] = await pool.query('SELECT COUNT(*) as count FROM poems');
    const [[publishedRow]] = await pool.query('SELECT COUNT(*) as count FROM poems WHERE published = TRUE');
    const [[draftRow]] = await pool.query('SELECT COUNT(*) as count FROM poems WHERE published = FALSE');
    const [[bookmarksRow]] = await pool.query('SELECT COUNT(*) as count FROM bookmarks');

    return res.json({
      success: true,
      data: {
        totalPoems: Number(totalPoemsRow.count),
        publishedPoems: Number(publishedRow.count),
        draftPoems: Number(draftRow.count),
        totalBookmarks: Number(bookmarksRow.count)
      }
    });
  } catch (error) {
    console.error('[getAdminStats Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin stats'
    });
  }
}
