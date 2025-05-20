const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'titkoskulcs';

// === Regisztráció ===
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('A név megadása kötelező!'),
    body('email').isEmail().withMessage('Érvénytelen e-mail cím!'),
    body('password').isLength({ min: 6 }).withMessage('A jelszónak legalább 6 karakter hosszúnak kell lennie!'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ error: 'Ez az email már regisztrálva van!' });
      }
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash });
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, name: user.name });
    } catch (err) {
      console.error('Regisztrációs hiba:', err);
      res.status(500).json({ error: 'Hiba a regisztráció során!' });
    }
  }
);

// === Bejelentkezés ===
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Érvénytelen e-mail cím!'),
    body('password').notEmpty().withMessage('A jelszó megadása kötelező!'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Hibás e-mail vagy jelszó!' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ error: 'Hibás e-mail vagy jelszó!' });
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, name: user.name });
    } catch (err) {
      console.error('Bejelentkezési hiba:', err);
      res.status(500).json({ error: 'Hiba a bejelentkezés során!' });
    }
  }
);

module.exports = router;
