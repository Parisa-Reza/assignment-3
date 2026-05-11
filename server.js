const express = require("express");
const path = require("path");


const app = express();

const PORT = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Mount property API routes
app.use(require("./apis/getProperty.js"));
app.use(require("./apis/getImages.js"));

// here serving all files inside the public folder directly to the browser.

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});