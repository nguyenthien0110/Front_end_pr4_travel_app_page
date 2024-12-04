const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
