// import the mongoose to interact with MongoDB
const mongoose = require("mongoose");

// define a new schema for the User model
const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true, required: true }, // define the email field as a unique and required String
  googleId: { type: String }, // Define the googleId field as a String, used for Google signup

  // define the createdAt field as a date with a default value of the current date and time
  createdAt: { type: Date, default: Date.now },
});

// export the User model based on the UserSchema
module.exports = mongoose.model("User", UserSchema);
