const mongoose = require("mongoose");

const CredentialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  credentialId: { type: String, unique: true, required: true },
  publicKey: { type: String, required: true },
  counter: { type: Number, default: 0 },
  transports: [String], // Optional, stores transport methods like "usb", "ble"
});

module.exports = mongoose.model("Credential", CredentialSchema);
