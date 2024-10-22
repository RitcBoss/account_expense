const connection = require('../db');
const multer = require('multer');

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
  const userId = req.user.userId;


  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; 
  const offset = (page - 1) * limit;

  connection.query('SELECT * FROM expense_types', (err, types) => {
    if (err) {
      console.error('Error fetching transaction types:', err);
      return res.status(500).send('Error fetching transaction types');
    }

    connection.query('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, accounts) => {
      if (err) {
        console.error('Error fetching accounts:', err);
        return res.status(500).send('Error fetching accounts');
      }

      const accountId = req.query.account_id || null;
      const day = req.query.transaction_day ? req.query.transaction_day : null;
      const month = req.query.transaction_month ? req.query.transaction_month : null;
      const year = req.query.transaction_year ? req.query.transaction_year - 543 : null;
      const typeId = req.query.type_id || null;

      console.log('Filter Parameters:', { accountId, day, month, year, typeId });

      let query = `
          SELECT t.*, a.account_name, et.type_name 
          FROM transactions t 
          LEFT JOIN accounts a ON t.account_id = a.id 
          LEFT JOIN expense_types et ON t.type_id = et.id 
          WHERE t.user_id = ?
        `;

      let params = [userId];

      if (accountId) {
        query += ' AND t.account_id = ?';
        params.push(accountId);
      }

      if (year) {
        query += ' AND YEAR(t.transaction_date) = ?';
        params.push(year);
      }

      if (month) {
        query += ' AND MONTH(t.transaction_date) = ?';
        params.push(month);
      }

      if (day) {
        query += ' AND DAY(t.transaction_date) = ?';
        params.push(day);
      }

      if (typeId) {
        query += ' AND t.type_id = ?';
        params.push(typeId);
      }

      query += ' ORDER BY t.transaction_date ASC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      connection.query(query, params, (err, transactions) => {
        if (err) {
          console.error('Error fetching transactions:', err);
          return res.status(500).send('Error fetching transactions');
        }

        connection.query(`
          SELECT COUNT(*) AS total 
          FROM transactions t 
          WHERE t.user_id = ?`, 
          [userId], (err, result) => {
          if (err) {
            console.error('Error fetching transaction count:', err);
            return res.status(500).send('Error fetching transaction count');
          }

          const totalItems = result[0].total;
          const totalPages = Math.ceil(totalItems / limit); 

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

          res.render('summary', { 
            transactions, 
            user: req.user, 
            types, 
            accounts, 
            totalIncome, 
            totalExpense, 
            currentPage: page, 
            totalPages,
            limit,
          });
        });
      });
    });
  });
};
