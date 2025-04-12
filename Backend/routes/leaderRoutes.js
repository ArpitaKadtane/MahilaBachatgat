// leaderRoutes.js
const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/leaderController');
const authMiddleware = require('../middleware/authMiddleware');



router.get('/loan-applications', fetchLoanApplications);

// Accept loan
router.put('/loan-accept/:id', acceptLoanApplication);
// Reject loan
router.post('/loan-reject/:id', rejectLoanApplication);

// Approve request for member to join group
router.put('/approved-request/:id', authMiddleware, approveRequest);
router.delete('/remove-member/:id', authMiddleware, removeMember);

// Reject request for member to join group
router.put('/reject-request/:id', authMiddleware, rejectRequest);

router.get('/member-requests', authMiddleware, getMemberJoinRequests);
// Assuming you are using Express.js
router.get('/approved-members', authMiddleware, getApprovedMembers); // Add this line
// ✅ Group management - Create a group
router.post('/group-management', authMiddleware, createGroup);
router.put('/change-password-leader', authMiddleware, changeLeaderPassword);
// Route for the update-profile page – return full profile details
router.get('/update-profile-leader', authMiddleware, updateLeaderProfile);
// PUT /update-profile -> update data
router.put('/update-profile-leader', authMiddleware, updateLeaderProfile);
// Dashboard profile
router.get('/leaderdashboard', authMiddleware, getLeaderProfile);

// Group members management
router.get('/members', authMiddleware, getGroupMembers);

// Financial management
router.get('/savings', authMiddleware, getGroupSavings);
router.get('/loans', authMiddleware, getGroupLoans);
router.get('/transactions/recent', authMiddleware, getRecentTransactions);

// Meeting management
router.get('/meetings/upcoming', authMiddleware, getUpcomingMeetings);

module.exports = router;