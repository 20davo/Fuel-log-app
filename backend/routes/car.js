const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Car = require('../models/Car');

const router = express.Router();

// === JWT ellenőrzés middleware ===
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Hiányzó token!' });

  jwt.verify(token, 'titkoskulcs', (err, payload) => {
    if (err) return res.status(403).json({ error: 'Érvénytelen token!' });
    req.userId = payload.userId;
    next();
  });
}

router.use(authenticateToken);

// === GET /api/cars – saját autók lekérdezése ===
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.userId });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a lekérdezés során!' });
  }
});

// === POST /api/cars – új autó hozzáadása validációval ===
router.post('/', [
  body('brand').notEmpty().withMessage('A márka megadása kötelező!').isString().trim(),
  body('model').notEmpty().withMessage('A típus megadása kötelező!').isString().trim(),
  body('year')
    .optional({ checkFalsy: true })
    .isInt({ min: 1886, max: new Date().getFullYear() })
    .withMessage(`Kérlek adj meg egy valós évjáratot (1986-${new Date().getFullYear()})!`),
  body('engine').optional().isString().trim(),
  body('plate').optional().isString().trim().isLength({ max: 10 }).withMessage('A rendszám maximum 10 karakter lehet!')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newCar = new Car({ ...req.body, userId: req.userId });
    const saved = await newCar.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Hibás adat vagy mentési hiba!' });
  }
});

// === DELETE /api/cars/:id – autó törlése ===
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Car.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).json({ error: 'Nem található ilyen autó!' });
    res.json({ message: 'Autó törölve!', id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: 'Törlési hiba!' });
  }
});

module.exports = router;
