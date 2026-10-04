import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required'
      });
    }

    const secret = process.env.JWT_SECRET || 'sengaanthal_secret_key';
    const decoded = jwt.verify(token, secret);

    // Verify user still exists in database
    const [rows] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please log in again'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }
}

export default authenticateToken;
