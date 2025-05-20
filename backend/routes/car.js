const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const validateObjectId = require('../middleware/validateObjectId');
const { body, validationResult } = require('express-validator');
const Car = require('../models/Car');

const router = express.Router();

// === JWT ellenőrzés middleware ===
router.use(verifyToken);

// === GET /api/cars – saját autók lekérdezése ===
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.userId });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a lekérdezés során!' });
  }
});

// === GET /api/cars/:id – egy autó lekérdezése ID alapján ===
router.get(
  '/:id',
  validateObjectId('id'),
  async (req, res) => {
    try {
      const car = await Car.findOne({ _id: req.params.id, userId: req.userId });
      if (!car) {
        return res.status(404).json({ error: 'Nem található ilyen autó!' });
      }
      res.json(car);
    } catch (err) {
      console.error('Autó lekérdezési hiba:', err);
      res.status(500).json({ error: 'Hiba az autó lekérdezésekor!' });
    }
  }
);

// === POST /api/cars – új autó hozzáadása validációval ===
router.post(
  '/',
  [
    body('brand').notEmpty().withMessage('A márka megadása kötelező!').isString().trim(),
    body('model').notEmpty().withMessage('A típus megadása kötelező!').isString().trim(),
    body('year')
      .optional({ checkFalsy: true })
      .isInt({ min: 1886, max: new Date().getFullYear() })
      .withMessage(`Kérlek adj meg egy valós évjáratot (1886–${new Date().getFullYear()})!`),
    body('engine').optional().isString().trim(),
    body('plate')
      .optional().isString().trim()
      .isLength({ max: 10 }).withMessage('A rendszám maximum 10 karakter lehet!')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const newCar = new Car({ ...req.body, userId: req.userId });
      const saved = await newCar.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: 'Hibás adat vagy mentési hiba!' });
    }
  }
);

// === DELETE /api/cars/:id – autó törlése ===
router.delete(
  '/:id',
  validateObjectId('id'),
  async (req, res) => {
    try {
      const deleted = await Car.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      if (!deleted) return res.status(404).json({ error: 'Nem található ilyen autó!' });
      res.json({ message: 'Autó törölve!', id: deleted._id });
    } catch (err) {
      res.status(500).json({ error: 'Törlési hiba!' });
    }
  }
);

module.exports = router;
