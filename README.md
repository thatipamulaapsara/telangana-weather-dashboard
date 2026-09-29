# 🌤️ Telangana Weather Dashboard

**Synent Internship – Task 6: API Integration Project (Intermediate Level)**

A responsive weather dashboard that lets you pick any of the 33 Telangana districts and shows live current weather and a 5-day forecast, fetched from a public API using the JavaScript Fetch API.

## Project Description

The user selects a Telangana district from a dropdown. The app looks up the district headquarters' coordinates, requests weather data from the Open-Meteo Forecast API and renders it dynamically on the page. No API key is required.

## Features

- Fetches live data with the **JavaScript Fetch API** (async/await)
- Dynamic display of current temperature, weather condition and icon
- Weather details: feels-like temperature, humidity, wind speed, pressure
- 5-day forecast (high/low temperature and condition)
- **Loading state**: "Loading weather..." message; the Search button is disabled and shows "Loading..." during the request
- **Error handling** with specific messages:

  | Situation | Message |
  |---|---|
  | No district selected | Please select a district. |
  | Network / API failure | Unable to connect to weather service. |
  | Location not found | Weather data not available for this district. |

- Responsive layout (desktop, tablet, mobile)
- Dark mode toggle

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, media queries)
- JavaScript (ES6+, Fetch API, async/await)

## API Used

**[Open-Meteo](https://open-meteo.com/)**: free, open-source weather API (no API key needed)

- Forecast: `https://api.open-meteo.com/v1/forecast`

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/telangana-weather-dashboard.git
   ```
2. Open the folder and double-click `index.html` (or use the VS Code *Live Server* extension).
3. Select a district and click **Search Weather**.

An internet connection is required to fetch the weather data.

## Project Structure

```
telangana-weather-dashboard/
├── index.html
├── style.css
├── script.js
├── screenshots/
└── README.md
```

## Screenshots

Add your screenshots to the `screenshots/` folder and update the file names below.

| Light mode | Dark mode | Mobile |
|---|---|---|
| ![Light](screenshots/light.png) | ![Dark](screenshots/dark.png) | ![Mobile](screenshots/mobile.png) |

## Demo Video

[Watch the demo](ADD_YOUR_VIDEO_LINK_HERE)

## GitHub Repository

https://github.com/<your-username>/telangana-weather-dashboard

## Author

<Your Name> – Synent Internship, Task 6
