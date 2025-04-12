const pool = require('../config/db');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const groupModel = require('../models/groupModel');

// // GET member profile for dashboard (limited fields)
// exports.getMemberProfile = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(400).json({ message: 'Invalid user request' });
//     }
//     // Only returns basic info for dashboard
//     const query = 'SELECT id, full_name, email, contact FROM users WHERE id = $1 AND user_type = $2';
//     const result = await pool.query(query, [userId, 'member']);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Member not found' });
//     }
//     res.status(200).json({ success: true, member: result.rows[0] });
//   } catch (error) {
//     console.error('❌ Error fetching member profile:', error.message);
//     res.status(500).json({ success: false, message: 'Error fetching member details' });
//   }
// };

// // GET/PUT for update-profile page (full details)
// exports.updateMemberProfile = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(400).json({ message: 'Invalid user request' });
//     }

//     // If GET, fetch full profile details for the update page
//     if (req.method === 'GET') {
//       const query = `
//         SELECT full_name, email, contact, age, address, aadhaar_number, bank_account, ifsc_code, bank_name 
//         FROM users 
//         WHERE id = $1
//       `;
//       const result = await pool.query(query, [userId]);

//       if (result.rows.length === 0) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }
//       return res.status(200).json({ success: true, user: result.rows[0] });
//     }

//     // If PUT, update the profile
//     const { full_name, email, contact, age, address, aadhaar_number, bank_account, ifsc_code, bank_name, password } = req.body;

//     // If a new password is provided, hash it; otherwise, leave unchanged.
//     let hashedPassword = null;
//     if (password) {
//       hashedPassword = await bcrypt.hash(password, 10);
//     }

//     const query = `
//       UPDATE users 
//       SET full_name = COALESCE($1, full_name),
//           email = COALESCE($2, email),
//           contact = COALESCE($3, contact),
//           age = COALESCE($4, age),
//           address = COALESCE($5, address),
//           aadhaar_number = COALESCE($6, aadhaar_number),
//           bank_account = COALESCE($7, bank_account),
//           ifsc_code = COALESCE($8, ifsc_code),
//           bank_name = COALESCE($9, bank_name),
//           password = COALESCE($10, password)
//       WHERE id = $11 AND user_type = $12
//       RETURNING id, full_name, email, contact, age, address, aadhaar_number, bank_account, ifsc_code, bank_name;
//     `;
//     const values = [
//       full_name,
//       email,
//       contact,
//       age,
//       address,
//       aadhaar_number,
//       bank_account,
//       ifsc_code,
//       bank_name,
//       hashedPassword,
//       userId,
//       'member'
//     ];

//     const result = await pool.query(query, values);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Update failed: member not found' });
//     }

//     res.status(200).json({ success: true, message: 'Profile updated successfully', user: result.rows[0] });
//   } catch (error) {
//     console.error('❌ Error updating member profile:', error.message);
//     res.status(500).json({ success: false, message: 'Error updating member details' });
//   }
// };

// // Change Password
// exports.changePassword = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     const { currentPassword, newPassword } = req.body;

//     if (!userId || !currentPassword || !newPassword) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Fetch existing hashed password from DB
//     const userResult = await pool.query('SELECT password FROM users WHERE id = $1 AND user_type = $2', [userId, 'member']);

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const storedHashedPassword = userResult.rows[0].password;

//     // Compare current password
//     const isMatch = await bcrypt.compare(currentPassword, storedHashedPassword);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Incorrect current password' });
//     }

//     // Hash new password and update
//     const newHashedPassword = await bcrypt.hash(newPassword, 10);
//     await pool.query('UPDATE users SET password = $1 WHERE id = $2 AND user_type = $3', [newHashedPassword, userId, 'member']);

//     return res.status(200).json({ success: true, message: 'Password changed successfully' });
//   } catch (error) {
//     console.error('❌ Error changing password:', error.message);
//     return res.status(500).json({ success: false, message: 'Error changing password' });
//   }
// };
// // Fetch all groups from database
// const db = require('../config/db');

// const getAllGroups = async (req, res) => {
//   try {
//     const result = await db.query('SELECT * FROM groups');
//     res.status(200).json({ success: true, groups: result.rows });
//   } catch (error) {
//     console.error('Error fetching groups:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch groups' });
//   }
// };

// module.exports = {
//   getAllGroups,
// };



// GET member profile for dashboard (limited fields)
const getMemberProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user request' });
    }

    const query = 'SELECT id, full_name, email, contact FROM users WHERE id = $1 AND user_type = $2';
    const result = await pool.query(query, [userId, 'member']);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({ success: true, member: result.rows[0] });
  } catch (error) {
    console.error('❌ Error fetching member profile:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching member details' });
  }
};
const updateMemberProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user request' });
    }

    // Handle GET request (fetch profile)
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT full_name, email, contact, age, address, aadhaar_number, bank_account, ifsc_code, bank_name FROM users WHERE id = $1 AND user_type = $2',
        [userId, 'member']
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }

      return res.status(200).json({ success: true, member: result.rows[0] });
    }

    // Handle PUT request (update profile)
    const {
      full_name,
      email,
      contact,
      age,
      address,
      aadhaar_number,
      bank_account,
      ifsc_code,
      bank_name
    } = req.body;

    const updateQuery = `
      UPDATE users 
      SET full_name = $1, email = $2, contact = $3, age = $4, address = $5, 
          aadhaar_number = $6, bank_account = $7, ifsc_code = $8, bank_name = $9
      WHERE id = $10 AND user_type = $11 RETURNING *;
    `;

    const values = [
      full_name,
      email,
      contact,
      age,
      address,
      aadhaar_number,
      bank_account,
      ifsc_code,
      bank_name,
      userId,
      'member'
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Update failed: member not found' });
    }

    res.status(200).json({ success: true, message: 'Member profile updated successfully', member: result.rows[0] });

  } catch (error) {
    console.error('❌ Error updating member profile:', error.message);
    res.status(500).json({ success: false, message: 'Error updating member profile' });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userResult = await pool.query('SELECT password FROM users WHERE id = $1 AND user_type = $2', [userId, 'member']);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const storedHashedPassword = userResult.rows[0].password;

    const isMatch = await bcrypt.compare(currentPassword, storedHashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2 AND user_type = $3', [newHashedPassword, userId, 'member']);

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('❌ Error changing password:', error.message);
    return res.status(500).json({ success: false, message: 'Error changing password' });
  }
};

// Fetch all groups
const getAllGroups = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups');
    res.status(200).json({ success: true, groups: result.rows });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch groups' });
  }
};

// Member sends join request
const joinGroup = async (req, res) => {
  try {
    const memberId = req.user?.id;
    const { groupId } = req.body;

    console.log('🔹 Member ID:', memberId);
    console.log('🔹 Group ID:', groupId);

    if (!memberId || !groupId) {
      return res.status(400).json({ message: 'Missing member or group ID' });
    }

    const request = await groupModel.sendJoinRequest(memberId, groupId);
    res.status(200).json({ message: 'Join request sent successfully.', request });

  } catch (error) {
    console.error('❌ Join group error:', error); // Full error
    res.status(500).json({ message: 'Error sending join request' });
  }
};
const { submitLoanApplication } = require('../models/loanApplicationModel');

const handleLoanApplication = async (req, res) => {
  try {
    const result = await submitLoanApplication(req.body);
    res.status(201).json({ message: 'Loan application submitted', data: result });
  } catch (err) {
    console.error('Error submitting loan:', err.message);
    res.status(500).json({ message: 'Error submitting loan', error: err.message });
  }
};


// Get expected loan amount for the logged-in member
const getExpectedLoanAmount = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from authMiddleware

    const result = await pool.query(
      'SELECT expected_amount FROM loan_applications WHERE member_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'कोणताही कर्ज अर्ज सापडला नाही.' });
    }

    res.json({ expectedAmount: result.rows[0].expected_amount });
  } catch (error) {
    console.error('Error fetching expected loan amount:', error);
    res.status(500).json({ message: 'कर्जाची अपेक्षित रक्कम आणताना त्रुटी आली.' });
  }
};
// Add this function 👇
const getLoanStatus = async (req, res) => {
  try {
    const mobile = req.user.mobile; // assuming `authMiddleware` sets req.user

    const result = await pool.query(
      'SELECT confirmation_status FROM loan_applications WHERE mobile = $1 ORDER BY submitted_at DESC LIMIT 1',
      [mobile]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    res.json(result.rows[0]); // { confirmation_status: "Approved"/"Pending"/etc. }
  } catch (error) {
    console.error('Error fetching loan status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Export all functions together
module.exports = {
  getMemberProfile,
  changePassword,
  getAllGroups,
  updateMemberProfile,
  joinGroup,
  handleLoanApplication,
  getExpectedLoanAmount,
  getLoanStatus
};
