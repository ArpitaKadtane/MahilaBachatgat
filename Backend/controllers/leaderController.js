// leaderController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const groupModel = require('../models/groupModel');
const { getAllLoanApplications } = require('../models/loanApplicationModel');
const leaderController = require('../controllers/leaderController');
const { authMiddleware } = require('../middleware/authMiddleware');
const getLeaderProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user request' });
    }

    const user = await pool.query('SELECT id, full_name, user_type, email, contact, bank_name FROM users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ leader: user.rows[0] });
  } catch (error) {
    console.error('❌ Error fetching leader profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user request' });
    }

    // For now, returning sample data - you would need to implement your database schema and queries
    const members = [
      { id: 1, name: 'सुनीता पाटील', contact: '9876543210', joinedDate: '01-01-2025' },
      { id: 2, name: 'अश्विनी जाधव', contact: '9876543211', joinedDate: '05-01-2025' },
      { id: 3, name: 'वैशाली शिंदे', contact: '9876543212', joinedDate: '10-01-2025' }
    ];

    res.json({ members });
  } catch (error) {
    console.error('❌ Error fetching group members:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGroupSavings = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user request' });
    }

    // Sample data - implement actual queries
    const savingsData = {
      totalSavings: 45000,
      monthlySavings: 3000,
      memberContributions: [
        { memberId: 1, name: 'सुनीता पाटील', totalSaved: 15000 },
        { memberId: 2, name: 'अश्विनी जाधव', totalSaved: 12000 },
        { memberId: 3, name: 'वैशाली शिंदे', totalSaved: 18000 }
      ]
    };

    res.json(savingsData);
  } catch (error) {
    console.error('❌ Error fetching group savings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGroupLoans = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user request' });
    }

    // Sample data - implement actual queries
    const loansData = {
      totalLoans: 30000,
      activeLoans: 3,
      pendingRequests: 2,
      loanDetails: [
        { id: 1, memberId: 2, name: 'अश्विनी जाधव', amount: 10000, purpose: 'शिक्षण', status: 'active', issueDate: '15-02-2025' },
        { id: 2, memberId: 3, name: 'वैशाली शिंदे', amount: 8000, purpose: 'व्यवसाय', status: 'active', issueDate: '20-02-2025' }
      ]
    };

    res.json(loansData);
  } catch (error) {
    console.error('❌ Error fetching group loans:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user request' });
    }

    // Sample data - implement actual queries
    const transactions = [
      { id: 1, type: 'बचत', amount: 500, memberId: 1, member: 'सुनीता पाटील', date: '01-04-2025' },
      { id: 2, type: 'कर्ज', amount: 5000, memberId: 2, member: 'अश्विनी जाधव', date: '30-03-2025' },
      { id: 3, type: 'परतफेड', amount: 1000, memberId: 3, member: 'वैशाली शिंदे', date: '28-03-2025' }
    ];

    res.json({ transactions });
  } catch (error) {
    console.error('❌ Error fetching recent transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUpcomingMeetings = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user request' });
    }

    // Sample data - implement actual queries
    const meetings = [
      { 
        id: 1, 
        date: '15-04-2025', 
        title: 'मासिक बचत गट बैठक', 
        time: 'सकाळी 10:00 - 11:30', 
        location: 'गावातील सामुदायिक हॉल'
      }
    ];

    res.json({ meetings });
  } catch (error) {
    console.error('❌ Error fetching upcoming meetings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const changeLeaderPassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1 AND user_type = $2',
      [userId, 'leader']
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const storedHashedPassword = userResult.rows[0].password;

    const isMatch = await bcrypt.compare(currentPassword, storedHashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2 AND user_type = $3',
      [hashedNewPassword, userId, 'leader']
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('❌ Error changing leader password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateLeaderProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user request' });
    }

    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT full_name, email, contact, age, address, aadhaar_number, bank_account, ifsc_code, bank_name FROM users WHERE id = $1 AND user_type = $2',
        [userId, 'leader']
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Leader not found' });
      }

      return res.status(200).json({ success: true, leader: result.rows[0] });
    }

    // If it's a PUT request
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
      'leader'
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Update failed: leader not found' });
    }

    res.status(200).json({ success: true, message: 'Leader profile updated successfully', leader: result.rows[0] });

  } catch (error) {
    console.error('❌ Error updating leader profile:', error.message);
    res.status(500).json({ success: false, message: 'Error updating leader profile' });
  }
};


const createGroup = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      group_name,
      purpose,
      rules,
      leader_name,
      city,
      district,
      member_limit,
      membership_criteria,
      savings_contribution,
      contact_number,
      bank_name,
      bank_account,
      ifsc_code,
    } = req.body;

    if (!userId || !group_name || !leader_name || !city) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO groups (
        group_name, purpose, rules, leader_name, city, district,
        member_count, eligibility_criteria, saving_contribution,
        contact_number, bank_name, bank_account, ifsc_code, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9,
        $10, $11, $12, $13, $14
      ) RETURNING *`,
      [
        group_name,
        purpose,
        rules,
        leader_name,
        city,
        district,
        member_limit,
        membership_criteria,
        savings_contribution,
        contact_number,
        bank_name,
        bank_account,
        ifsc_code,
        userId
      ]
    );
    

    res.status(201).json({ message: 'Group created successfully', group: result.rows[0] });
  } catch (error) {
    console.error('❌ Error creating group:', error.message);
    res.status(500).json({ message: 'Error creating group' });
  }
};

const getMemberJoinRequests = async (req, res) => {
  const leaderId = req.user.id; // from token

  try {
    const requests = await groupModel.getMemberRequestsForLeader(leaderId);
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching member requests:', error.message);
    res.status(500).json({ message: 'Failed to fetch member requests' });
  }
};
const approveRequest = async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters
  const leaderId = req.user.id; // Leader ID from token

  console.log('Approving request with ID:', id); // Debugging line

  try {
    const result = await groupModel.approveMemberRequest(id, leaderId); // Handle approval logic
    if (result) {
      res.status(200).json({ message: 'Request approved successfully' });
    } else {
      res.status(400).json({ message: 'Failed to approve request' });
    }
  } catch (error) {
    console.error('Error approving request:', error.message);
    res.status(500).json({ message: 'Failed to approve request' });
  }
};
const rejectRequest = async (req, res) => {
  const { id } = req.params;
  const leaderId = req.user.id;

  console.log('Rejecting and deleting request with ID:', id);

  try {
    const deleted = await groupModel.rejectMemberRequest(id, leaderId);
    if (deleted) {
      res.status(200).json({ message: 'Request rejected and removed successfully' });
    } else {
      res.status(400).json({ message: 'Request not found or unauthorized' });
    }
  } catch (error) {
    console.error('Error rejecting/deleting request:', error.message);
    res.status(500).json({ message: 'Server error during rejection' });
  }
};

const getApprovedMembers = async (req, res) => {
  const leaderId = req.user.id; // Extract leader ID from the token

  try {
    // Fetch approved members from the model based on leader ID
    const approvedMembers = await groupModel.getApprovedMembersForLeader(leaderId);
    res.status(200).json(approvedMembers); // Send approved members as response
  } catch (error) {
    console.error('Error fetching approved members:', error.message);
    res.status(500).json({ message: 'Failed to fetch approved members' });
  }
};

const removeMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    // Step 1: Update the join request status to 'rejected' instead of deleting
    const result = await pool.query(
      `UPDATE group_join_requests 
       SET status = 'rejected' 
       WHERE member_id = $1 AND status = 'accepted' 
       RETURNING *`,
      [memberId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Member not found or already rejected' });
    }

    // Optionally: remove from group_members if you want to unlink them
    await pool.query('DELETE FROM group_members WHERE member_id = $1', [memberId]);

    res.status(200).json({ message: 'Member status set to rejected successfully' });
  } catch (error) {
    console.error('Error in removeMember:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fetchLoanApplications = async (req, res) => {
  try {
    const result = await getAllLoanApplications();
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching loan applications:', err.message);
    res.status(500).json({ message: 'Error fetching loan applications' });
  }
};

// Accept Loan Application
const acceptLoanApplication = async (req, res) => {
  const loanId = req.params.id;
  const { actualAmountReceived } = req.body;

  try {
    const result = await pool.query(
      `UPDATE loan_applications
       SET confirmation_status = 'Accepted',
           actual_amount_received = $1,
           confirmation_date = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [actualAmountReceived, loanId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Loan application not found.' });
    }

    res.status(200).json({ message: 'Loan application accepted successfully.' });
  } catch (err) {
    console.error('Error accepting loan:', err);
    res.status(500).json({ message: 'Server error while accepting loan.' });
  }
};

// Reject Loan Application
const rejectLoanApplication = async (req, res) => {
  const loanId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE loan_applications
       SET confirmation_status = 'Rejected',
           confirmation_date = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [loanId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Loan application not found.' });
    }

    res.status(200).json({ message: 'Loan application rejected successfully.' });
  } catch (err) {
    console.error('Error rejecting loan:', err);
    res.status(500).json({ message: 'Server error while rejecting loan.' });
  }
};

module.exports = { 
  getLeaderProfile,
  getGroupMembers,
  getGroupSavings,
  getGroupLoans,
  getRecentTransactions,
  getUpcomingMeetings,
  changeLeaderPassword,
  updateLeaderProfile,
  createGroup,
  getMemberJoinRequests,
  approveRequest,
  rejectRequest,
  getApprovedMembers,
  removeMember,
  fetchLoanApplications,
  acceptLoanApplication,
  rejectLoanApplication
};