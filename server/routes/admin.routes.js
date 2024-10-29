const express = require("express");
const adminRoutes = express.Router();
const {
  getAllAdmins,
  createAdmin,
  deleteAdmin,
} = require("../controllers/admin.controller");

adminRoutes.get("/", getAllAdmins); // GET /api/admins
adminRoutes.post("/", createAdmin); // POST /api/admins
adminRoutes.delete("/:id", deleteAdmin); // DELETE /api/admins/:id

module.exports = adminRoutes;
