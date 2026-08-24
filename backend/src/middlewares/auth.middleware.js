const jwt = require("jsonwebtoken");

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader; // Support both "Bearer <token>" and raw token

  if (!token) {
    return res.status(401).json({ message: "Authentication required. Missing token." });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("FATAL: JWT_SECRET environment variable is not set.");
    return res.status(500).json({ message: "Server configuration error." });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);

    if (!payload || !payload.teamId) {
      return res.status(401).json({ message: "Invalid token payload: missing team identification." });
    }

    req.teamId = payload.teamId;
    req.team = payload; // { teamId, name, isAdmin, iat, exp }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    return res.status(403).json({ message: "Invalid or malformed authentication token." });
  }
}

module.exports = { authenticateToken };
