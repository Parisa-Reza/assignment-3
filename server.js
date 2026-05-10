const express = require("express");
const propertyAPI = require("./apis/getProperty.js");

const app = express();

const PORT = 3000;

// Mount property API routes
app.use(require("./apis/getProperty.js"));
app.use(require("./apis/getImages.js"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
