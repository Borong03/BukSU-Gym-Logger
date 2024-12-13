const fetch = require('node-fetch');

// function to verify CAPTCHA response with Google's API
const verifyCaptcha = async (captchaResponse) => {
  const secretKey = "6LeZQIMqAAAAACTwYnXIjgsERhq-FpumHrCR1ZMt";
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

  const response = await fetch(verificationUrl, { method: 'POST' });
  const data = await response.json();

  if (data.success) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  verifyCaptcha,
};
