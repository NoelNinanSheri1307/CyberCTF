// src/api/hint/hint.routes.js
const express = require("express");
const router = express.Router();
const {
  addHint,
  updateHint,
  deleteHint,
  getHintsByChallenge,
} = require("./hint.controller");

// ✅ Routes
router.post("/:challengeId", addHint);         // Add a hint to a challenge
router.get("/:challengeId", getHintsByChallenge); // List all hints for a challenge
router.patch("/:hintId", updateHint);         // Update a hint
router.delete("/:hintId", deleteHint);        // Delete a hint

module.exports = router;
