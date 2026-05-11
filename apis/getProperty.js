const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
// app.get("/", (req, res) => {
//   res.send("APIIIII is running");
// });
app.get("/get-property", (req, res) => {
  const {
    "most-popular": mostPopular,
    "highest-price": highestPrice,
    "lowest-price": lowestPrice,
    limit,
  } = req.query;

  let fileName = "";

  // Select file based on query
  if (mostPopular === "true") {
    fileName = "most_popular.json";
  } else if (highestPrice === "true") {
    fileName = "highest_price.json";
  } else if (lowestPrice === "true") {
    fileName = "lowest_price.json";
  } else {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid query parameter",
    });
  }

  try {
    // Read JSON file
    const filePath = path.join(__dirname, "..", "data", fileName);

    const rawData = fs.readFileSync(filePath, "utf-8");

    const parsedData = JSON.parse(rawData);

    // Nested JSON -> Result.Items
    let items = parsedData.Result.Items;

    // Apply limit if provided
    if (limit) {
      items = items.slice(0, Number(limit));
    }

    res.status(200).json({
      success: true,
      total: items.length,
      Items: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to read data",
      error: error.message,
    });
  }
});

module.exports = app;
