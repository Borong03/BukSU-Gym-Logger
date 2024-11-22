const express = require('express');
const { verifyCaptcha } = require('../controllers/captchaController');
const router = express.Router();

// POST route to verify CAPTCHA response
router.post('/verify-captcha', async (req, res) => {
  const { captchaResponse } = req.body;

  if (!captchaResponse) {
    return res.status(400).json({ error: "No CAPTCHA response provided" });
  }

  const isCaptchaValid = await verifyCaptcha(captchaResponse);

  if (isCaptchaValid) {
    res.status(200).json({ message: "CAPTCHA verified successfully" });
    // proceed with further processing
  } else {
    res.status(400).json({ error: "CAPTCHA verification failed" });
  }
});

module.exports = router;
