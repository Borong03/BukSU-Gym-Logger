const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import db
const students = require("./db");

// Login
app.post("/index", (req, res) => {
  const newMember = req.body;
  members.push(newMember);
  res.status(201).send({ status: "Welcome to BukSU fitness gym" });
});

// Get all members
app.get("/member/all", (req, res) => {
  res.status(200).json(members);
});

// Get user by ID
app.get("/member/i/:id", (req, res) => {
  const id = req.params.id;
  const s = members.find((st) => st.id == id);
  if (s) {
    res.status(200).json(s);
  } else {
    res.status(404).send({ status: "Member not found" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
