const geonamesBaseURL = "http://api.geonames.org/searchJSON?q=";
const weatherbitBaseURL = "https://api.weatherbit.io/v2.0/forecast/daily";
const pixabayBaseURL = "https://pixabay.com/api/";
const geonamesApiKey = "janainamj";
const weatherbitApiKey = "83fef7d4cb64488b82129deb64946e29";
const pixabayApiKey = "47431835-9ec241e1eefbcadb0d95c0767";

export const handleSubmit = async () => {
  const location = document.getElementById("location").value;
  const departureDate = document.getElementById("departureDate").value;
  const tripDetails = document.getElementById("tripDetails");

  tripDetails.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Loading...</p>
  `;

  try {
    const geoData = await fetch("/geonames", {
      method: "POST",
      Headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location }),
    }).then((res) => res.json());

    const weatherData = await fetch("/weather", {
      method: "POST",
      Headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: location, data: departureDate }),
    }).then((res) => res.json());

    const pixabayData = await fetch("/pixabay", {
      method: "POST",
      Headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: location }),
    }).then((res) => res.json());

    updateUI(geoData, weatherData, pixabayData, departureDate);
  } catch (error) {
    tripDetails.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    console.error(error);
  }
};

const updateUI = (geoData, weatherData, pixabayData, departureDate) => {
  const weather = weatherData.data[0].weather;
  const temperature = weatherData.data[0].temp;
  const humidity = weatherData.data[0].rh;
  const windSpeed = weatherData.data[0].wind_spd;

  document.getElementById("tripDetails").innerHTML = `
    <img src="${pixabayData.hits[0].webformatURL}" alt="Trip Image" class="trip-image">
    <p><strong>Location:</strong> ${geoData.geonames[0].name}</p>
    <p><strong>Weather on ${departureDate}:</strong> ${weather.description}</p>
    <p><strong>Temperature:</strong> ${temperature}°C</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Wind Speed:</strong> ${windSpeed} km/h</p>
  `;
};
