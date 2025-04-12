const pool = require('../config/db');

const createGroup = async (groupData) => {
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
    ifsc_code
  } = groupData;

  const result = await pool.query(
    `INSERT INTO groups (
      group_name, purpose, rules, leader_name, city, district,
      member_limit, membership_criteria, savings_contribution,
      contact_number, bank_name, bank_account, ifsc_code
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [
      group_name, purpose, rules, leader_name, city, district,
      member_limit, membership_criteria, savings_contribution,
      contact_number, bank_name, bank_account, ifsc_code
    ]
  );

  return result.rows[0];
};
// Member sends a request to join a group
const sendJoinRequest = async (memberId, groupId) => {
  const checkQuery = `
    SELECT * FROM group_join_requests
    WHERE member_id = $1 AND group_id = $2 AND status = 'pending';
  `;
  const checkResult = await pool.query(checkQuery, [memberId, groupId]);

  if (checkResult.rows.length > 0) {
    throw new Error('Request already sent');
  }

  const insertQuery = `
    INSERT INTO group_join_requests (member_id, group_id, status)
    VALUES ($1, $2, 'pending')
    RETURNING *;
  `;
  const result = await pool.query(insertQuery, [memberId, groupId]);
  return result.rows[0];
};

// Fetch all member requests for groups created by this leader
const getMemberRequestsForLeader = async (leaderId) => {
  const query = `
    SELECT 
      gjr.id AS request_id,
      gjr.status,
      gjr.requested_at,
      u.id AS member_id,
      u.full_name,
      u.contact,
      u.age,
      u.address,
      g.group_name
    FROM group_join_requests gjr
    JOIN users u ON gjr.member_id = u.id
    JOIN groups g ON gjr.group_id = g.id
    WHERE g.created_by = $1
    ORDER BY gjr.requested_at DESC;
  `;
  const result = await pool.query(query, [leaderId]);
  return result.rows;
};

// Get approved members for a leader's group
const getApprovedMembersForLeader = async (leaderId) => {
  const query = `
    SELECT 
      u.id AS member_id,
      u.full_name,
      u.contact,
      u.age,
      u.address,
      g.group_name,
      gjr.requested_at
    FROM group_join_requests gjr
    JOIN users u ON gjr.member_id = u.id
    JOIN groups g ON gjr.group_id = g.id
    WHERE gjr.status = 'accepted' AND g.created_by = $1
    ORDER BY gjr.requested_at DESC;
  `;
  const result = await pool.query(query, [leaderId]);
  return result.rows;
};

// Approve member request
const approveMemberRequest = async (requestId) => {
  // Step 1: Update the request status
  await pool.query(
    `UPDATE group_join_requests SET status = 'accepted' WHERE id = $1`,
    [requestId]
  );

  // Step 2: Fetch group_id and member_id
  const result = await pool.query(
    `SELECT group_id, member_id FROM group_join_requests WHERE id = $1`,
    [requestId]
  );

  if (result.rows.length === 0) {
    throw new Error('Request not found');
  }

  const { group_id, member_id } = result.rows[0];

  // Step 3: Insert into group_members table
  await pool.query(
    `INSERT INTO group_members (group_id, member_id) VALUES ($1, $2)`,
    [group_id, member_id]
  );

  return { success: true };
};

// Delete a member's join request (fully remove from DB)
const rejectMemberRequest = async (requestId, leaderId) => {
  const result = await pool.query(
    `DELETE FROM group_join_requests
     WHERE id = $1
     AND group_id IN (
       SELECT id FROM groups WHERE created_by = $2
     )
     RETURNING *;`,
    [requestId, leaderId]
  );

  return result.rows.length > 0; // true if deleted successfully
};

// Remove a member from a group
// models/leaderModel.js or wherever your DB queries are
const removeMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    // Delete from group_join_requests
    await pool.query('DELETE FROM group_join_requests WHERE member_id = $1', [memberId]);

    // Delete from group_members
    await pool.query('DELETE FROM group_members WHERE member_id = $1', [memberId]);

    res.status(200).json({ message: 'Member removed from groups successfully' });
  } catch (error) {
    console.error('Error in removeMember:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Export all functions
module.exports = {
  createGroup,
  sendJoinRequest,
  getMemberRequestsForLeader,
  getApprovedMembersForLeader,
  approveMemberRequest,
  rejectMemberRequest,
  removeMember
};