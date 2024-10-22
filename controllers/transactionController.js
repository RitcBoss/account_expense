const connection = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

exports.upload = upload;


exports.getTransactions = (req, res) => {
  const accountId = req.params.accountId;
  const userId = req.user.userId;
  const isIncome = req.query.is_income;


  const limit = parseInt(req.query.limit) || 10; 
  const page = parseInt(req.query.page) || 1; 
  const offset = (page - 1) * limit; 

  connection.query('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [accountId, userId], (err, accounts) => {
    if (err || accounts.length === 0) {
      return res.status(403).send('คุณไม่มีสิทธิ์เข้าถึงบัญชีนี้');
    }

    const query = isIncome !== undefined
      ? 'SELECT * FROM transactions WHERE account_id = ? AND is_income = ? ORDER BY transaction_date ASC LIMIT ? OFFSET ?'
      : 'SELECT * FROM transactions WHERE account_id = ? ORDER BY transaction_date ASC LIMIT ? OFFSET ?';

    const params = isIncome !== undefined
      ? [accountId, isIncome, limit, offset]
      : [accountId, limit, offset];

    connection.query(query, params, (err, transactions) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        return res.status(500).send('Error fetching transactions');
      }

      let totalIncome = 0;
      let totalExpense = 0;


      transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount);
        if (transaction.is_income) {
          totalIncome += amount;
        } else {
          totalExpense += amount;
        }
      });

      connection.query('SELECT COUNT(*) AS total FROM transactions WHERE account_id = ?', [accountId], (err, result) => {
        if (err) {
          console.error('Error fetching transaction count:', err);
          return res.status(500).send('Error fetching transaction count');
        }

        const totalItems = result[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        connection.query('SELECT * FROM expense_types', (err, types) => {
          if (err) {
            console.error('Error fetching transaction types:', err);
            return res.status(500).send('Error fetching transaction types');
          }

          res.render('transactions', {
            transactions,
            account: accounts[0],
            user: req.user,
            accounts: accounts,
            types: types,
            totalIncome,
            totalExpense,
            currentPage: page,
            totalPages,
            limit 
          });
        });
      });
    });
  });
};






exports.addTransaction = (req, res) => {
  const { account_id, type_id, amount, note, is_income, transaction_date } = req.body;


  const isIncomeValue = is_income === 'true' ? 1 : 0;

  const slip = req.file ? req.file.filename : null;
  const userId = req.user.userId;

  connection.query(
    'INSERT INTO transactions (user_id, account_id, type_id, amount, note, slip, is_income, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, account_id, type_id, amount, note, slip, isIncomeValue, transaction_date],
    (err) => {
      if (err) {
        console.error('Error adding transaction:', err);
        return res.status(500).send('Error adding transaction');
      }
      return res.status(201).redirect(`/account/transactions/${account_id}/`);
    }
  );
};




exports.deleteTransaction = (req, res) => {
  const transactionId = req.params.id;

  connection.query('DELETE FROM transactions WHERE id = ?', [transactionId], (err, result) => {
    if (err) {
      console.error('Error deleting transaction:', err);
      return res.status(500).send('Error deleting transaction');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Transaction not found');
    }

    return res.status(200).redirect(`/account/transactions/${req.params.account_id}/`);
  });
};

