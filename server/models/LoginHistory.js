const mongoose = require("mongoose");

const LoginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date },
  ipAddress: { type: String },
  device: { type: String },
});

const LoginHistory = mongoose.model("LoginHistory", LoginHistorySchema);

module.exports = LoginHistory;
