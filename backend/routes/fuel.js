const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const FuelEntry = require('../models/FuelEntry');

const router = express.Router();

// === JWT ellenőrzés middleware ===
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Hiányzó hitelesítési token!' });

    jwt.verify(token, 'titkoskulcs', (err, payload) => {
        if (err) return res.status(403).json({ error: 'Érvénytelen token!' });
        req.userId = payload.userId;
        next();
    });
}

router.use(authenticateToken);

// === GET /api/fuel – összes bejegyzés ===
router.get('/', async (req, res) => {
    try {
        const entries = await FuelEntry.find({ userId: req.userId });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: 'Hiba a lekérdezés során!' });
    }
});

// === POST /api/fuel – új bejegyzés validációval ===
router.post('/', [
    body('date')
      .isISO8601().toDate().withMessage('Érvénytelen dátum!')
      .custom((value) => {
        const now = new Date();
        return value <= now;
      }).withMessage('A dátum nem lehet a mai napnál későbbi!'),

    body('odometer').isFloat({ min: 1 }).withMessage('A kilométeróra állása nem lehet negatív vagy nulla!'),
    body('liters').isFloat({ min: 0.1 }).withMessage('A liter értéke nem lehet negatív vagy nulla!'),
    body('unitPrice').isFloat({ min: 1 }).withMessage('Az egységár értéke nem lehet negatív vagy nulla!'),
    body('location').optional().isString().trim(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
    const userId = req.userId;
    const { odometer, liters, unitPrice } = req.body;
    const price = Math.round(liters * unitPrice);

    // Keresd meg az előző bejegyzést ennél a felhasználónál (legutóbbi odometer alapján)
    const lastEntry = await FuelEntry.findOne({ userId }).sort({ odometer: -1 });

    let consumption = undefined;

    if (lastEntry && lastEntry.odometer && odometer > lastEntry.odometer) {
      const distance = odometer - lastEntry.odometer;
      consumption = (liters / distance) * 100;
      consumption = Math.round(consumption * 100) / 100; // két tizedesre kerekít
    }

    if (lastEntry && odometer <= lastEntry.odometer) {
      return res.status(400).json({
        errors: [{ msg: 'A kilométeróra állásnak nagyobbnak kell lennie az előző tankoláshoz képest!' }]
      });
    }

    const newEntry = new FuelEntry({
      ...req.body,
      userId,
      price,
      consumption
    });

    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Hibás adat vagy mentési hiba!' });
  }
});

// === GET /api/fuel/:id ===
router.get('/:id', async (req, res) => {
    try {
        const entry = await FuelEntry.findOne({ _id: req.params.id, userId: req.userId });
        if (!entry) return res.status(404).json({ error: 'Nem található ilyen bejegyzés!' });
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: 'Hiba a lekérdezés során!' });
    }
});

// === DELETE /api/fuel/:id ===
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await FuelEntry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!deleted) return res.status(404).json({ error: 'Nem található ilyen bejegyzés!' });
        res.json({ message: 'Bejegyzés törölve!', id: deleted._id });
    } catch (err) {
        res.status(500).json({ error: 'Törlési hiba!' });
    }
});

module.exports = router;