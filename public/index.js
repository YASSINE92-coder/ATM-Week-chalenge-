let users = [];
let currentUser = null;

// localStorage management functions
function saveUsersToLocalStorage() {
  try {
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Users saved to localStorage:', users);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

function loadUsersFromLocalStorage() {
  try {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      console.log('Users loaded from localStorage:', parsedUsers);
      return parsedUsers;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return [];
}

function saveCurrentUserToLocalStorage() {
  if (currentUser) {
    try {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      console.log('Current user saved to localStorage:', currentUser);
    } catch (error) {
      console.error('Error saving current user to localStorage:', error);
    }
  }
}

function loadCurrentUserFromLocalStorage() {
  try {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Current user loaded from localStorage:', parsedUser);
      return parsedUser;
    }
  } catch (error) {
    console.error('Error loading current user from localStorage:', error);
  }
  return null;
}

function clearLocalStorage() {
  try {
    localStorage.removeItem('users');
    localStorage.removeItem('currentUser');
    console.log('localStorage cleared');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// Load users from server and sync with localStorage
async function loadUsers() {
  try {
    const response = await fetch('/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    users = await response.json();
    console.log("Loaded users from server:", users);
    
    // Save to localStorage after successful server load
    saveUsersToLocalStorage();
    
    // Check if we have a stored current user and restore session
    const storedCurrentUser = loadCurrentUserFromLocalStorage();
    if (storedCurrentUser) {
      // Verify the stored user still exists in the server data
      const userExists = users.find(u => u.accountID === storedCurrentUser.accountID);
      if (userExists) {
        currentUser = userExists;
        // Restore the user session
        restoreUserSession();
      } else {
        // Stored user no longer exists, clear localStorage
        localStorage.removeItem('currentUser');
      }
    }
  } catch (error) {
    console.error('Error loading users from server:', error);
    // Fallback to localStorage if server is unavailable
    users = loadUsersFromLocalStorage();
    if (users.length === 0) {
      users = [];
    }
  }
}

// Restore user session after page reload
function restoreUserSession() {
  if (currentUser) {
    // Hide login/signup forms
    document.getElementById('emptydiv').style.display = 'none';
    document.getElementById('auth').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    
    // Show main menu
    document.getElementById('menu').style.display = 'block';
    document.getElementById('menuContainer').style.display = 'block';
    
    // Clear output
    document.getElementById('output').textContent = '';
    resetBalanceButton();
    
    console.log('User session restored:', currentUser.accountID);
  }
}

// Update user on server
async function updateUserOnServer(user) {
  try {
    const response = await fetch(`/users/${user.accountID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Server update error:", error);
    throw error;
  }
}

// Create new user
document.getElementById('createUserBtn').addEventListener('click', async () => {
  const accountID = document.getElementById('newAccountID').value.trim();
  const pin = document.getElementById('newPin').value.trim();

  if (!accountID || !pin) {
    return alert("Please fill in all fields.");
  }

  try {
    const response = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountID, pin })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    const newUser = await response.json();
    users.push(newUser);
    
    // Save to localStorage after successful creation
    saveUsersToLocalStorage();
    
    alert("✅ User created successfully!");
    
    // Clear form and hide signup
    document.getElementById('newAccountID').value = '';
    document.getElementById('newPin').value = '';
    document.getElementById('signup').style.display = 'none';
    
  } catch (error) {
    console.error("User creation error:", error);
    alert("❌ " + error.message);
  }
});

// Login user
document.getElementById('loginBtn').addEventListener('click', async () => {
  const id = document.getElementById('accountID').value.trim();
  const pin = document.getElementById('pin').value.trim();
  
  if (!id || !pin) {
    return alert("Please fill in all fields.");
  }

  try {
    // Check if user exists in loaded users
    let user = users.find(u => u.accountID === id && u.pin === pin);
    
    if (!user) {
      // If not found locally, refresh from server and check again
      await loadUsers();
      user = users.find(u => u.accountID === id && u.pin === pin);
    }
    
    if (user) {
      currentUser = user;
      
      // Save current user to localStorage
      saveCurrentUserToLocalStorage();
      
      alert(`✅ Welcome back ${id}`);
      
      // Show main menu
      document.getElementById('emptydiv').style.display = 'none';
      document.getElementById('auth').style.display = 'none';
      document.getElementById('signup').style.display = 'none';
      document.getElementById('menu').style.display = 'block';
      document.getElementById('menuContainer').style.display = 'block';
      
      // Clear login form
      document.getElementById('accountID').value = '';
      document.getElementById('pin').value = '';
      
      // Reset balance display
      document.getElementById('output').textContent = '';
      resetBalanceButton();
    } else {
      alert("❌ Invalid credentials");
    }
  } catch (error) {
    console.error('Login error:', error);
    alert("❌ Login failed. Please try again.");
  }
});

// Check balance
document.getElementById('checkBalance').addEventListener('click', async () => {
  if (!currentUser) {
    return alert("Please login first.");
  }
  
  try {
    // Refresh user data from server
    const response = await fetch(`/users/${currentUser.accountID}`);
    if (response.ok) {
      const updatedUser = await response.json();
      currentUser = updatedUser;
      users = users.map(u => u.accountID === currentUser.accountID ? currentUser : u);
      
      // Save updated data to localStorage
      saveUsersToLocalStorage();
      saveCurrentUserToLocalStorage();
    }
    
    document.getElementById('output').textContent = `Your current balance is $${currentUser.balance.toFixed(2)}`;
    resetBalanceButton();
    reloadHistory();
  } catch (error) {
    console.error('Error checking balance:', error);
    alert("❌ Failed to check balance. Please try again.");
  }
});

// Deposit money
document.getElementById('deposit').addEventListener('click', async () => {
  if (!currentUser) {
    return alert("Please login first.");
  }
  
  const amount = parseFloat(prompt("Enter deposit amount:"));
  if (isNaN(amount) || amount <= 0) {
    return alert("Invalid amount.");
  }

  try {
    currentUser.balance += amount;
    currentUser.transactions.push({
      type: 'deposit',
      amount: amount,
      date: new Date().toISOString()
    });

    await updateUserOnServer(currentUser);
    
    // Update local users array
    users = users.map(u => u.accountID === currentUser.accountID ? currentUser : u);
    
    // Save updated users to localStorage
    saveUsersToLocalStorage();
    saveCurrentUserToLocalStorage();
    
    alert("✅ Deposit successful!");
    setBalanceButtonRed();
    
    // Clear output
    document.getElementById('output').textContent = '';
    
  } catch (error) {
    // Revert changes on error
    currentUser.balance -= amount;
    currentUser.transactions.pop();
    alert("❌ Failed to save deposit: " + error.message);
  }
});

// Withdraw money
document.getElementById('withdraw').addEventListener('click', async () => {
  if (!currentUser) {
    return alert("Please login first.");
  }
  
  const amount = parseFloat(prompt("Enter withdrawal amount:"));
  if (isNaN(amount) || amount <= 0) {
    return alert("Invalid amount.");
  }
  
  if (amount > currentUser.balance) {
    return alert("❌ Insufficient balance.");
  }

  try {
    currentUser.balance -= amount;
    currentUser.transactions.push({
      type: 'withdraw',
      amount: amount,
      date: new Date().toISOString()
    });

    await updateUserOnServer(currentUser);
    
    // Update local users array
    users = users.map(u => u.accountID === currentUser.accountID ? currentUser : u);
    
    // Save updated users to localStorage
    saveUsersToLocalStorage();
    saveCurrentUserToLocalStorage();
    
    alert("✅ Withdrawal successful!");
    setBalanceButtonRed();
    
    // Clear output
    document.getElementById('output').textContent = '';
    
  } catch (error) {
    // Revert changes on error
    currentUser.balance += amount;
    currentUser.transactions.pop();
    alert("❌ Failed to save withdrawal: " + error.message);
  }
});

// Show transaction history
document.getElementById('history').addEventListener('click', () => {
  if (!currentUser) {
    return alert("Please login first.");
  }
  
  if (currentUser.transactions.length === 0) {
    alert("No transactions yet.");
    return;
  }
  
  const history = currentUser.transactions
    .map((t, i) => `${i + 1}. [${new Date(t.date).toLocaleString()}] ${t.type.toUpperCase()} - $${t.amount.toFixed(2)}`)
    .join('\n');
  
  alert(history);
});

// Delete account
document.getElementById('deleteAccount').addEventListener('click', async () => {
  if (!currentUser) {
    return alert("Please login first.");
  }
  
  const confirmDelete = confirm(`Are you sure you want to delete your account (${currentUser.accountID})? This action cannot be undone and all your data will be permanently lost.`);
  
  if (!confirmDelete) {
    return;
  }
  
  try {
    const response = await fetch(`/users/${currentUser.accountID}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete account');
    }
    
    // Remove user from local users array
    users = users.filter(u => u.accountID !== currentUser.accountID);
    
    // Clear localStorage for deleted user
    clearLocalStorage();
    
    alert("✅ Account deleted successfully!");
    
    // Logout and return to login screen
    currentUser = null;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('menuContainer').style.display = 'none';
    document.getElementById('auth').style.display = 'block';
    document.getElementById('signup').style.display = 'block';
    document.getElementById('emptydiv').style.display = 'block';
    document.getElementById('output').textContent = '';
    resetBalanceButton();
    
  } catch (error) {
    console.error("Account deletion error:", error);
    alert("❌ Failed to delete account: " + error.message);
  }
});

// Logout
document.getElementById('logout').addEventListener('click', () => {
  // Clear current user from localStorage
  localStorage.removeItem('currentUser');
  
  currentUser = null;
  
  // Show login/signup forms
  document.getElementById('menu').style.display = 'none';
  document.getElementById('menuContainer').style.display = 'none';
  document.getElementById('auth').style.display = 'block';
  document.getElementById('signup').style.display = 'block';
  document.getElementById('emptydiv').style.display = 'block';
  
  // Clear output
  document.getElementById('output').textContent = '';
  
  // Reset balance button
  resetBalanceButton();
});

// Show users in localStorage (for debugging)
document.getElementById('display').addEventListener('click', () => {
  const storedUsers = localStorage.getItem('users');
  const storedCurrentUser = localStorage.getItem('currentUser');
  
  let displayText = '=== localStorage Data ===\n\n';
  
  if (storedUsers) {
    const usersFromStorage = JSON.parse(storedUsers);
    displayText += 'Users:\n' + JSON.stringify(usersFromStorage, null, 2) + '\n\n';
  } else {
    displayText += 'Users: No users found in localStorage.\n\n';
  }
  
  if (storedCurrentUser) {
    const currentUserFromStorage = JSON.parse(storedCurrentUser);
    displayText += 'Current User:\n' + JSON.stringify(currentUserFromStorage, null, 2);
  } else {
    displayText += 'Current User: No current user in localStorage.';
  }
  
  document.getElementById('usersDisplay').textContent = displayText;
  
  // Show admin panel
  document.getElementById('adminPanel').style.display = 'block';
});

// Delete user by ID (Admin function)
document.getElementById('deleteUserBtn').addEventListener('click', async () => {
  const accountID = document.getElementById('deleteUserID').value.trim();
  
  if (!accountID) {
    return alert("Please enter an Account ID to delete.");
  }
  
  const confirmDelete = confirm(`Are you sure you want to delete user with Account ID: ${accountID}? This action cannot be undone.`);
  
  if (!confirmDelete) {
    return;
  }
  
  try {
    const response = await fetch(`/users/${accountID}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }
    
    // Remove user from local users array
    users = users.filter(u => u.accountID !== accountID);
    
    // Save updated users to localStorage
    saveUsersToLocalStorage();
    
    // If the deleted user was the current user, logout and clear localStorage
    if (currentUser && currentUser.accountID === accountID) {
      clearLocalStorage();
      currentUser = null;
      document.getElementById('menu').style.display = 'none';
      document.getElementById('menuContainer').style.display = 'none';
      document.getElementById('auth').style.display = 'block';
      document.getElementById('signup').style.display = 'block';
      document.getElementById('emptydiv').style.display = 'block';
      document.getElementById('output').textContent = '';
      resetBalanceButton();
    }
    
    alert("✅ User deleted successfully!");
    
    // Clear input and hide admin panel
    document.getElementById('deleteUserID').value = '';
    document.getElementById('adminPanel').style.display = 'none';
    
  } catch (error) {
    console.error("User deletion error:", error);
    alert("❌ Failed to delete user: " + error.message);
  }
});

// Helper functions for balance button styling
function resetBalanceButton() {
  document.getElementById('checkBalance').style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
  document.getElementById('checkBalance').textContent = 'Check Balance';
}

function setBalanceButtonRed() {
  document.getElementById('checkBalance').textContent = 'Please reload your account balance';
  document.getElementById('checkBalance').style.background = 'linear-gradient(135deg, rgb(158, 32, 27) 0%, rgb(254, 148, 0) 100%)';
}

function reloadHistory() {
  // This function can be used for additional history reloading logic if needed
  console.log('History reloaded');
}

// Clear localStorage manually (for testing)
function clearLocalStorageManually() {
  if (confirm('Are you sure you want to clear all localStorage data? This will log you out and remove all cached data.')) {
    clearLocalStorage();
    currentUser = null;
    
    // Return to login screen
    document.getElementById('menu').style.display = 'none';
    document.getElementById('menuContainer').style.display = 'none';
    document.getElementById('auth').style.display = 'block';
    document.getElementById('signup').style.display = 'block';
    document.getElementById('emptydiv').style.display = 'block';
    document.getElementById('output').textContent = '';
    resetBalanceButton();
    
    alert('localStorage cleared successfully!');
  }
}

// Add clear localStorage button to admin panel
document.addEventListener('DOMContentLoaded', () => {
  const adminPanel = document.getElementById('adminPanel');
  if (adminPanel) {
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear localStorage';
    clearButton.className = 'delete-button';
    clearButton.style.marginTop = '10px';
    clearButton.onclick = clearLocalStorageManually;
    adminPanel.appendChild(clearButton);
  }
});

// Initialize the application
window.onload = async () => {
  // First try to load from localStorage for immediate response
  const storedUsers = loadUsersFromLocalStorage();
  const storedCurrentUser = loadCurrentUserFromLocalStorage();
  
  if (storedUsers.length > 0) {
    users = storedUsers;
    console.log('Initialized with localStorage data:', users);
  }
  
  if (storedCurrentUser) {
    currentUser = storedCurrentUser;
    console.log('Initialized with stored current user:', currentUser);
  }
  
  // Then try to sync with server
  await loadUsers();
  
  // If we have a current user, restore the session
  if (currentUser) {
    restoreUserSession();
  }
};
