const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/get-api-key", (req, res) => {
  res.json({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  });
});

// Mount property API routes
app.use(require("./apis/getProperty.js"));
app.use(require("./apis/getImages.js"));

// here serving all files inside the public folder directly to the browser.

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});