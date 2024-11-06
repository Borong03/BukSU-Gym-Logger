// routes/webauthn.js
const express = require("express");
const router = express.Router();
const base64url = require("base64url");
const crypto = require("crypto");
const Credential = require("../models/Credential");

// Endpoint for registering a passkey
router.post("/register-passkey", (req, res) => {
  const userId = req.body.userId;
  const challenge = base64url(crypto.randomBytes(32));

  const options = {
    challenge,
    rp: { name: "My App" },
    user: {
      id: base64url.encode(userId),
      name: req.body.email,
      displayName: req.body.displayName,
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    timeout: 60000,
    attestation: "direct",
  };

  req.session.challenge = challenge;
  res.json(options);
});

// Endpoint for verifying the passkey
router.post("/verify-passkey", async (req, res) => {
  const { userId, credential } = req.body;
  const { id, response } = credential;
  const challenge = req.session.challenge;

  if (base64url.decode(response.clientDataJSON.challenge) !== challenge) {
    return res.status(400).json({ error: "Invalid challenge" });
  }

  const newCredential = new Credential({
    userId,
    credentialId: id,
    publicKey: response.attestationObject,
    counter: 0,
  });

  try {
    await newCredential.save();
    res.status(200).json({ message: "Passkey created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save credential" });
  }
});

// Endpoint for authenticating with a passkey
router.post("/authenticate-passkey", async (req, res) => {
  const { userId, credentialId, response } = req.body;
  const credential = await Credential.findOne({ userId, credentialId });

  if (!credential)
    return res.status(404).json({ error: "Credential not found" });

  // Additional validation and authentication here

  res.status(200).json({ message: "User authenticated" });
});

module.exports = router;
