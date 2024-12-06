const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const geonamesBaseURL = "http://api.geonames.org/searchJSON?q=";
const weatherbitBaseURL = "https://api.weatherbit.io/v2.0/forecast/daily";
const pixabayBaseURL = "https://pixabay.com/api/";
const geonamesApiKey = process.env.GEONAMES_API_KEY;
const weatherbitApiKey = process.env.WATHERBIT_API_KEY;
const pixabayApiKey = process.env.PIXABAY_API_KEY;
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

app.post("/geonames", async (req, res) => {
  const { location } = req.body;
  try {
    const response = await fetch(
      `${geonamesBaseURL}${location}&username=${geonamesApiKey}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data from Geonames.");
  }
});

app.post("/weather", async (req, res) => {
  const { city, date } = req.body;
  try {
    const response = await fetch(
      `${weatherbitBaseURL}?key=${weatherbitApiKey}&city=${city}&start_date=${date}}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data from Weather.");
  }
});

app.post("/pixabay", async (req, res) => {
  const { query } = req.body;
  try {
    const response = await fetch(
      `${pixabayBaseURL}?key=${pixabayApiKey}&q=${query}&image_type=photo`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data from Pixabay.");
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
