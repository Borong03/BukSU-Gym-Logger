const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// import routes
const memberRoutes = require("./routes/member.routes");
const adminRoutes = require("./routes/admin.routes");

app.use(bodyParser.json());

// register route base paths
app.use("/api/members", memberRoutes);
app.use("/api/admins", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
