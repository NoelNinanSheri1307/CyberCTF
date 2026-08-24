// src/middlewares/admin.middleware.js
const { authenticateToken } = require('./auth.middleware');

function requireAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.team && req.team.isAdmin === true) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Administrator privileges required." });
    }
  });
}

module.exports = { requireAdmin };