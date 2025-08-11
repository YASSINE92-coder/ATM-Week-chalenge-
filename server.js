const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data file path
const USERS_FILE = 'users.json';

// Helper function to read users from file
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    throw error;
  }
}

// Helper function to write users to file
async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// GET /users - Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await readUsers();
    res.json(users);
  } catch (error) {
    console.error('Error reading users:', error);
    res.status(500).json({ error: 'Failed to read users' });
  }
});

// GET /users/:id - Get specific user
app.get('/users/:id', async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.accountID === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error reading user:', error);
    res.status(500).json({ error: 'Failed to read user' });
  }
});

// POST /users - Create new user
app.post('/users', async (req, res) => {
  try {
    const { accountID, pin } = req.body;
    
    if (!accountID || !pin) {
      return res.status(400).json({ error: 'Account ID and PIN are required' });
    }
    
    const users = await readUsers();
    
    // Check if user already exists
    if (users.some(u => u.accountID === accountID)) {
      return res.status(409).json({ error: 'Account ID already exists' });
    }
    
    const newUser = {
      accountID,
      pin,
      balance: 0,
      transactions: []
    };
    
    users.push(newUser);
    await writeUsers(users);
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /users/:id - Update user
app.put('/users/:id', async (req, res) => {
  try {
    const { accountID, pin, balance, transactions } = req.body;
    
    if (!accountID || !pin) {
      return res.status(400).json({ error: 'Account ID and PIN are required' });
    }
    
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.accountID === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user data
    users[userIndex] = {
      accountID,
      pin,
      balance: balance || 0,
      transactions: transactions || []
    };
    
    await writeUsers(users);
    
    res.json(users[userIndex]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /users/:id - Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.accountID === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    await writeUsers(users);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.htm'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});