// memberRoutes.js
const express = require('express');
const router = express.Router();
const { getMemberProfile, updateMemberProfile,changePassword,getAllGroups,joinGroup,handleLoanApplication,getExpectedLoanAmount ,getLoanStatus} = require('../controllers/memberController');

const authMiddleware = require('../middleware/authMiddleware');
router.get('/loan-expected', authMiddleware, getExpectedLoanAmount);
router.get('/loan-status', authMiddleware, getLoanStatus);

router.post('/loan-application', handleLoanApplication);
router.post('/join-group', authMiddleware, joinGroup);
router.get('/groups', authMiddleware, getAllGroups);
// GET /memberdashboard (just an example)
router.get('/memberdashboard', authMiddleware, getMemberProfile);
// Route for the update-profile page – return full profile details
router.get('/update-profile', authMiddleware, updateMemberProfile);
// PUT /update-profile -> update data
router.put('/update-profile', authMiddleware, updateMemberProfile);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
