import { handleSubmit } from "../client/js/app";

describe("Form submission functionality", () => {
  let locationInput;
  let departureDateInput;
  let tripDetailsElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="location" value="New York" />
      <input id="departureDate" value="2024-12-25" />
      <div id="tripDetails"></div>
    `;

    locationInput = document.getElementById("location");
    departureDateInput = document.getElementById("departureDate");
    tripDetailsElement = document.getElementById("tripDetails");

    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes("geonames")) {
        return Promise.resolve({
          json: () => Promise.resolve({ geonames: [{ name: "New York" }] }),
        });
      } else if (url.includes("weatherbit")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  weather: { description: "Clear sky" },
                  temp: 22,
                  rh: 60,
                  wind_spd: 15,
                },
              ],
            }),
        });
      } else if (url.includes("pixabay")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: [{ webformatURL: "https://example.com/image.jpg" }],
            }),
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update the UI with correct data on successful form submission", async () => {
    await handleSubmit();

    expect(tripDetailsElement.innerHTML).toContain("New York");
    expect(tripDetailsElement.innerHTML).toContain("Clear sky");
    expect(tripDetailsElement.innerHTML).toContain("22°C");
    expect(tripDetailsElement.innerHTML).toContain("60%");
    expect(tripDetailsElement.innerHTML).toContain("15 km/h");
    expect(tripDetailsElement.innerHTML).toContain(
      "https://example.com/image.jpg"
    );
  });

  it("should display an error message if there is an issue with the API requests", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("API request failed"))
    );

    await handleSubmit();

    expect(tripDetailsElement.innerHTML).toContain(
      "Something went wrong. Please try again later."
    );
  });

  it("should show loading spinner while waiting for API responses", async () => {
    handleSubmit();

    expect(tripDetailsElement.innerHTML).toContain(
      '<div class="loading-spinner"></div>'
    );
    expect(tripDetailsElement.innerHTML).toContain("Loading...");
  });
});
