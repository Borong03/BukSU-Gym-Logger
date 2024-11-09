// import the mongoose to interact with MongoDB
const mongoose = require("mongoose");

// define a new schema for the User model
const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true, required: true }, // define the email field as a unique and required string
  googleId: { type: String }, // used for google signup
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
  },
});

// export the User model based on the UserSchema
module.exports = mongoose.model("User", UserSchema);
