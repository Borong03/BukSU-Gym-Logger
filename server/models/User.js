const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, unique: true, required: true },
  googleId: { type: String, required: false },
  password: { type: String, required: false },
  isActive: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  version: { type: Number, default: 0 },
});

// export the User model based on the updated schema
module.exports = mongoose.model("User", UserSchema);
