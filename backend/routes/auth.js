const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// === Regisztráció ===
router.post('/register', [
    body('name').notEmpty().withMessage('A név megadása kötelező'),
    body('email').isEmail().withMessage('Érvénytelen e-mail cím'),
    body('password').isLength({ min: 6 }).withMessage('A jelszónak legalább 6 karakter hosszúnak kell lennie')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Ez az email már regisztrálva van' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashed });
        await newUser.save();

        res.status(201).json({ message: 'Sikeres regisztráció' });
    } catch (err) {
        res.status(500).json({ error: 'Hiba a regisztráció során' });
    }
});

// === Bejelentkezés ===
router.post('/login', [
    body('email').isEmail().withMessage('Érvénytelen e-mail'),
    body('password').notEmpty().withMessage('A jelszó nem lehet üres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Hibás e-mail vagy jelszó' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Hibás e-mail vagy jelszó' });

        const token = jwt.sign({ userId: user._id }, 'titkoskulcs', { expiresIn: '1h' });
        res.json({ token, name: user.name });
    } catch (err) {
        res.status(500).json({ error: 'Bejelentkezési hiba' });
    }
});

module.exports = router;
