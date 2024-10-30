const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// mongoose: para sa mongoDB
// dotenv: para ma load ang .env
// passport and passport-google-oauth20: para cont. w/ google
// jsonwebtoken: para user token generator

// load config
dotenv.config();

// initialize express
const app = express();
app.use(express.json());

// routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// mongodb things
mongoose
  .connect(process.env.MONGO_URI, {
    // MONGO_URI is from .env
    useNewUrlParser: true, // para ma use ang new url parser
    useUnifiedTopology: true, // para ma use ang new server discovery and monitoring engine
  })
  .then(() => console.log("MongoDB connected")) // if connected
  .catch((err) => console.log(err));

// server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
