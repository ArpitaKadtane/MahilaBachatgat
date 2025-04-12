// routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // PostgreSQL connection
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/authMiddleware'); // your JWT middleware

router.put('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming your auth middleware attaches `id` to req.user
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new password required' });
    }

    // 1. Get current password from DB
    const userQuery = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentHashedPassword = userQuery.rows[0].password;

    // 2. Compare old password
    const isMatch = await bcrypt.compare(oldPassword, currentHashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // 3. Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Update password
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHashedPassword, userId]);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change Password Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
