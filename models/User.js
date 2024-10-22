const connection = require('../db');

class User {
    static async create(username, password) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, password],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    }

    static async findByUsername(username) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, users) => {
                    if (err) return reject(err);
                    resolve(users);
                }
            );
        });
    }
    static async createUser(userId, accountName) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO accounts (account_name, user_id) VALUES (?, ?)',
                [accountName, userId],
                (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                }
            );
        });
    }

    static async deleteUserAccount(accountId, userId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'DELETE FROM transactions WHERE account_id = ? AND user_id = ?',
                [accountId, userId],
                (err) => {
                    if (err) {
                        return reject(err);
                    }
                    connection.query(
                        'DELETE FROM accounts WHERE id = ? AND user_id = ?',
                        [accountId, userId],
                        (err) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve();
                        }
                    );
                }
            );
        });
    }
}

module.exports = User;
