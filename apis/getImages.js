const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use("/images", express.static(path.join(__dirname, "..", "images")));

app.get("/images", (req, res) => {
  const imagesDirectory = path.join(__dirname, "..", "images");

  // Read the directory files inside the request handler
  fs.readdir(imagesDirectory, (err, files) => {
    if (err) {
      console.error(err); 
      return res.status(500).json({ error: "Unable to scan directory" });
    }

    // Filter for images and format the URL
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/images/${file}`);

    res.json(imageFiles);
  });
});

module.exports = app;