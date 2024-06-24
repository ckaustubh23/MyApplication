const db = require('../config/db');

const User = {
    create: (user, callback) => {
        const query = 'INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)';
        db.query(query, [user.username, user.name, user.email, user.password], callback);
    },
    findByUsername: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], callback);
    }
};

module.exports = User;
