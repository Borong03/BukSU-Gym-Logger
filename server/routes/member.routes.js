const express = require("express");
const memberRoutes = express.Router();
const {
  getAll,
  createMember,
  getVisitHistory,
} = require("../controllers/member.controller");

memberRoutes.get("/", getAll); // GET /api/members
memberRoutes.post("/", createMember); // POST /api/members
memberRoutes.get("/:id/visits", getVisitHistory); // GET /api/members/:id/visits

module.exports = memberRoutes;
