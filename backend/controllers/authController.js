const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = (req, res) => {
    const { username, name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    User.create({ username, name, email, password: hashedPassword }, (err, result) => {
        if (err) return res.status(500).send('There was a problem registering the user.');
        res.status(200).send({ message: 'User registered successfully!' });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, (err, users) => {
        if (err) return res.status(500).send('Error on the server.');
        if (users.length === 0) return res.status(404).send('No user found.');

        const user = users[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.id }, 'supersecret', { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
};
