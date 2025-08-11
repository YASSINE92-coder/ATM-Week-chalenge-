# ATM Simulation Project

A simple ATM (Automated Teller Machine) simulation built with Node.js, Express, and vanilla JavaScript.

## Features

- **User Management**: Create new accounts with Account ID and PIN
- **Authentication**: Secure login system
- **Balance Operations**: Check balance, deposit, and withdraw money
- **Transaction History**: View all transaction records with timestamps
- **Persistent Storage**: Data is stored in JSON files and persists between sessions
- **Real-time Updates**: All operations are immediately saved to the server

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ATM-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get specific user by Account ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user information
- `DELETE /users/:id` - Delete user

### Authentication
- Login with existing Account ID and PIN
- Create new account with unique Account ID

### Operations
- **Check Balance**: View current account balance
- **Deposit**: Add money to account
- **Withdraw**: Remove money from account (if sufficient balance)
- **Transaction History**: View all past transactions
- **Logout**: Secure logout and return to login screen

## Project Structure

```
ATM-project/
├── server.js          # Express server and API endpoints
├── users.json         # User data storage
├── package.json       # Project dependencies and scripts
├── public/            # Client-side files
│   ├── home.htm       # Main HTML interface
│   ├── index.js       # Client-side JavaScript
│   └── style.css      # Styling
└── README.md          # This file
```

## Usage

### Creating an Account
1. Enter a unique Account ID
2. Enter a PIN (password)
3. Click "Sign Up"
4. Account will be created with $0 balance

### Logging In
1. Enter your Account ID
2. Enter your PIN
3. Click "Login"
4. Access ATM services

### Making Transactions
1. **Deposit**: Click "Deposit" and enter amount
2. **Withdraw**: Click "Withdraw" and enter amount (must not exceed balance)
3. **Check Balance**: Click "Check Balance" to see current balance
4. **History**: Click "Transaction History" to view all transactions

### Security Features
- PIN validation on login
- Balance verification before withdrawals
- Transaction logging with timestamps
- Secure logout functionality

## Data Persistence

- User data is stored in `users.json`
- All transactions are automatically saved
- Data persists between server restarts
- No data loss during normal operation

## Error Handling

- Input validation for all forms
- Network error handling
- Graceful fallbacks for failed operations
- User-friendly error messages

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

This requires `nodemon` to be installed globally or as a dev dependency.

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `server.js` or kill the process using port 3000
2. **Dependencies not found**: Run `npm install` to install missing packages
3. **Server won't start**: Check console for error messages and ensure all dependencies are installed

### Server Logs

The server provides detailed logging for debugging:
- User creation/deletion
- Login attempts
- Transaction operations
- Error conditions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Author

Yassine - ATM Week Challenge Project
