const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const changePasswordRoutes = require('./controllers/memberController'); 
const leaderRoutes = require('./routes/leaderRoutes');
const memberRoutes = require('./routes/memberRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:4200', 'http://yourfrontend.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// app.use('/api/leader', leaderRoutes);
// app.use('/api/member', memberRoutes);
// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mahilabachatgat',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully at', res.rows[0].now);
  }
});

// 📝 Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    let { userType, fullName, email, contact, password, age, address, aadhaar, bankAccount, ifsc, bankName } = req.body;

    // Validate required fields
    if (!userType || !fullName || !contact || !password) {
      return res.status(400).json({ success: false, message: 'सर्व आवश्यक फील्ड भरा' });
    }

    // Trim input and enforce max length to avoid errors
    userType = userType.slice(0, 20);
    fullName = fullName.slice(0, 100);
    email = email ? email.slice(0, 100) : null;
    password = password.slice(0, 255);
    contact = contact.slice(0, 20);
    aadhaar = aadhaar ? aadhaar.slice(0, 12) : null;
    bankAccount = bankAccount ? bankAccount.slice(0, 50) : null;
    ifsc = ifsc ? ifsc.slice(0, 20) : null;
    bankName = bankName ? bankName.slice(0, 100) : null;

    // Debugging: Log input lengths
    console.log("🔍 Received Registration Data:");
    console.log("userType:", userType.length, "| fullName:", fullName.length);
    console.log("email:", email ? email.length : 0, "| password:", password.length);
    console.log("contact:", contact.length, "| aadhaar:", aadhaar ? aadhaar.length : 0);
    console.log("bankAccount:", bankAccount ? bankAccount.length : 0, "| ifsc:", ifsc ? ifsc.length : 0);
    console.log("bankName:", bankName ? bankName.length : 0);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const query = `
      INSERT INTO users (user_type, full_name, email, password, contact, age, address, aadhaar_number, bank_account, ifsc_code, bank_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, contact, user_type;
    `;
    const values = [userType, fullName, email, hashedPassword, contact, age, address, aadhaar, bankAccount, ifsc, bankName];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'नोंदणी यशस्वी झाली आहे',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Registration error:', error);

    if (error.code === '23505' && error.constraint === 'users_contact_key') {
      return res.status(409).json({ success: false, message: 'हा मोबाईल क्रमांक आधीपासून वापरात आहे' });
    }

    res.status(500).json({ success: false, message: 'नोंदणी करताना त्रुटी आली', error: error.message });
  }
});

// 📝 Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    console.log('🔍 Incoming login request:', req.body);

    const { contact, password, userType } = req.body;

    if (!contact || !password || !userType) {
      return res.status(400).json({ success: false, message: 'मोबाईल क्रमांक, पासवर्ड आणि वापरकर्ता प्रकार आवश्यक आहे' });
    }

    console.log(`🔎 Searching for user with Contact: ${contact}, UserType: ${userType}`);

    const query = 'SELECT * FROM users WHERE contact = $1 AND user_type = $2';
    const result = await pool.query(query, [contact, userType]);

    console.log('📊 Query Result:', result.rows);

    if (result.rows.length === 0) {
      console.log('❌ User not found or incorrect userType');
      return res.status(401).json({ success: false, message: 'अवैध मोबाईल क्रमांक, पासवर्ड किंवा वापरकर्ता प्रकार' });
    }

    const user = result.rows[0];

    console.log('✅ User found:', user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ success: false, message: 'अवैध मोबाईल क्रमांक किंवा पासवर्ड' });
    }

    console.log('🔑 Password matched, generating token');

    const token = jwt.sign(
      { id: user.id, contact: user.contact, userType: user.user_type },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'लॉगिन यशस्वी',
      token,
      user: {
        id: user.id,
        contact: user.contact,
        fullName: user.full_name,
        userType: user.user_type
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, message: 'लॉगिन करताना त्रुटी आली', error: error.message });
  }
});

// 📝 Logout endpoint
app.post('/api/logout', (req, res) => {
  res.status(200).json({ success: true, message: 'लॉगआउट यशस्वी' });
});

app.use('/api/leader', leaderRoutes);
app.use('/api/member', memberRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Example Node.js/Express endpoint
app.get('/api/user-profile', (req, res) => {
  const token = req.headers['authorization'].split(' ')[1]; // Assuming Bearer token
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    // Fetch user data from DB using decoded.id or similar
    const user = getUserById(decoded.id); 
    res.json(user);
  });
});
// 📝 Fetch logged-in member details
app.get('/api/memberdashboard', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    const query = 'SELECT id, full_name, email, contact FROM users WHERE id = $1 AND user_type = $2';
    const result = await pool.query(query, [decoded.id, decoded.userType]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.status(200).json({ success: true, member: result.rows[0] });
  } catch (error) {
    console.error('❌ Error fetching member profile:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching member details' });
  }
});
// Fetch logged-in leader details
app.get('/api/leaderdashboard', async (req, res) => { // ✅ Fixed typo here
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    // Ensure userType matches how it's stored in your DB
    const query = 'SELECT id, full_name, email, contact, bank_name FROM users WHERE id = $1 AND user_type = $2';
    const result = await pool.query(query, [decoded.id, decoded.userType]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Leader not found' });
    }

    res.status(200).json({ success: true, leader: result.rows[0] });
  } catch (error) {
    console.error('❌ Error fetching leader profile:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching leader details' });
  }
});
app.get('/api/update-profile', async (req, res) => {
  try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
          return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const userId = decoded.id;

      const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
      console.error('❌ Error fetching user:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.put('/api/update-profile', async (req, res) => {
  try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
          return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const userId = decoded.id;
      const { full_name, email, contact, age, address, aadhaar_number, bank_account, ifsc_code, bank_name } = req.body;

      const updateQuery = `
          UPDATE users 
          SET full_name = $1, email = $2, contact = $3, age = $4, address = $5, 
              aadhaar_number = $6, bank_account = $7, ifsc_code = $8, bank_name = $9
          WHERE id = $10 RETURNING *;
      `;

      const values = [full_name, email, contact, age, address, aadhaar_number, bank_account, ifsc_code, bank_name, userId];

      const result = await pool.query(updateQuery, values);

      if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, message: 'Profile updated successfully', user: result.rows[0] });
  } catch (error) {
      console.error('❌ Error updating profile:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/update-profile-leader', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userId = decoded.id;

    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND user_type = $2',
      [userId, 'leader']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Leader not found' });
    }

    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('❌ Error fetching leader profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.put('/api/update-profile-leader', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userId = decoded.id;

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
      WHERE id = $10 AND user_type = 'leader'
      RETURNING *;
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
      userId
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Leader not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Leader profile updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('❌ Error updating leader profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
