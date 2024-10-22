const connection = require('../db');
const User = require('../models/User');

exports.addAccount = async (req, res) => {
  const { account_name } = req.body;
  const userId = req.user.userId;

  try {
    await User.createUser(userId, account_name);
    res.status(201).redirect('/account');
    console.log('Account is Success!');
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send('Error adding account');
  }
};

exports.deleteAccount = (req, res) => {
  const accountId = req.params.id;
  const userId = req.user.userId;

  connection.query(
    'DELETE FROM transactions WHERE account_id = ? AND user_id = ?',
    [accountId, userId],
    (err) => {
      if (err) {
        console.error('Error deleting transactions:', err);
        return res.status(500).send('Error deleting transactions');
      }

      connection.query(
        'DELETE FROM accounts WHERE id = ? AND user_id = ?',
        [accountId, userId],
        (err) => {
          if (err) {
            console.error('Error deleting account:', err);
            return res.status(500).send('Error deleting account');
          }

          res.status(200).redirect('/account');
          console.log('Account and related transactions deleted successfully!');
        }
      );
    }
  );
};


exports.addExpenseType = (req, res) => {
  const { type_name } = req.body;

  connection.query('INSERT INTO expense_types (type_name) VALUES (?)',
    [type_name], (err) => {
      if (err) return res.status(500).send('Error adding expense type');
      res.status(201).send('Expense type added');
    });
};
