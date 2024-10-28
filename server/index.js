const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import db
const members = require("./db");

// Login
app.post("/index", (req, res) => {
  const newMember = req.body;
  members.push(newMember);
  res.status(201).send({ status: "Welcome to BukSU fitness gym" });
});

// Get all members
app.get("/member/all", (req, res) => {
  res.status(200).send(members);
});

// Visit history
app.get("/member/:id/visits", (req, res) => {
  const memberId = req.params.id;
  const visits = getVisitHistory(memberId); // Assume this function is defined elsewhere
  res.status(200).send(visits);
});

// Logout
app.post("/logout", (req, res) => {
  // Handle logout logic here
  res.status(200).send({ status: "Logged out successfully" });
});

// Admin management
app.post("/admin/add", (req, res) => {
  const newAdmin = req.body;
  admins.push(newAdmin);
  res.status(201).send({ status: "Admin added successfully" });
});

app.delete("/admin/:id", (req, res) => {
  const adminId = req.params.id;
  removeAdmin(adminId);
  res.status(200).send({ status: "Admin removed successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
