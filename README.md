# Income and Expense Management System

## Description
The Income and Expense Management System is designed to assist users in tracking and controlling their daily spending. It allows users to record financial data and effectively manage various accounts.

## Features
- **Login**: Secure login functionality.
- **Account Management**: Add and delete spending accounts as needed.
- **Expense Categories**: Add and delete categories for expenses.
- **Expense Summary**: View spending statistics for each account.
- **Data Filtering**: Filter data by month, year, category, and account.
- **Attachment of Evidence**: Supports attaching transaction slips for expenditure verification.

## Technologies Used
- **Node.js**: For server-side development.
- **MySQL**: For database management.
- **Express**: A web application framework for Node.js, simplifying routing and middleware integration.
- **EJS**: A templating engine that lets you generate HTML markup with plain JavaScript.
- **Bcrypt**: A library for hashing passwords securely.
- **jsonwebtoken**: For generating and verifying JSON Web Tokens (JWT) for user authentication.
- **Multer**: Middleware for handling `multipart/form-data`, used for file uploads (e.g., attaching transaction slips).
- **dotenv**: A module to load environment variables from a `.env` file into `process.env`.
- **Cookie-parser**: Middleware to parse cookies attached to the client request object.
- **Express-session**: Middleware for managing user sessions.
- **Connect-flash**: A simple way to pass flash messages (temporary messages) to users.

## Installation
Install the necessary packages using the command:
```bash
npm install
```

## Usage
1. Create a `.env` file and set up your database connection settings.
2. Run the server with the command:
   ```bash
   npm start
   ```
