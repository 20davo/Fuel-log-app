const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'titkoskulcs';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Hiányzó hitelesítési token!' });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Érvénytelen vagy lejárt token!' });
    }

    req.userId = payload.userId;
    next();
  });
}

module.exports = verifyToken;
