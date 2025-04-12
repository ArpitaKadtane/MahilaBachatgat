const pool = require('../config/db');

const User = {
  findById: async (id, userType) => {
    const query = 'SELECT id, full_name, email, contact, bank_name FROM users WHERE id = $1 AND user_type = $2';
    const result = await pool.query(query, [id, userType]);
    return result.rows[0];
  }
};

module.exports = User;
