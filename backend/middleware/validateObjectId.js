const mongoose = require('mongoose');

function validateObjectId(paramName) {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({ error: `Érvénytelen azonosító: ${paramName}!` });
    }
    next();
  };
}

module.exports = validateObjectId;
