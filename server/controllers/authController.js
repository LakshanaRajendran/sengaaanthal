import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_EXPIRES_IN = '7d';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Parameterized SQL query
    const [rows] = await pool.query(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const secret = process.env.JWT_SECRET || 'sengaanthal_secret_key';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again.'
    });
  }
}

export async function getMe(req, res) {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('[Auth getMe Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user information'
    });
  }
}

/**
 * Reader session helper:
 * Allows anonymous reader clients to have an authenticated user record in MySQL
 * for persisting bookmarks across visits without forcing a registration gate.
 */
export async function getOrCreateReaderSession(req, res) {
  try {
    const { sessionId } = req.body;
    const cleanSessionId = (sessionId && typeof sessionId === 'string' && sessionId.trim().length > 4)
      ? sessionId.trim().slice(0, 50)
      : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

    const email = `reader_${cleanSessionId}@sengaanthal.local`;

    // Check if reader user already exists
    const [existing] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE email = ?',
      [email]
    );

    let user;
    if (existing && existing.length > 0) {
      user = existing[0];
    } else {
      const dummyHash = await bcrypt.hash(`reader_secret_${cleanSessionId}`, 8);
      const [insertResult] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Reader', email, dummyHash, 'reader']
      );
      user = {
        id: insertResult.insertId,
        name: 'Reader',
        email,
        role: 'reader'
      };
    }

    const secret = process.env.JWT_SECRET || 'sengaanthal_secret_key';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      sessionId: cleanSessionId,
      token,
      user
    });
  } catch (error) {
    console.error('[Reader Session Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize reader session'
    });
  }
}
