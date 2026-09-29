const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const error = document.getElementById("error");

const cityName = document.getElementById("cityName");
const date = document.getElementById("date");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

const forecast = document.getElementById("forecast");
const themeBtn = document.getElementById("themeBtn");



/* =========================================
   TELANGANA DISTRICT → HEADQUARTERS COORDINATES
   (fixed coordinates, so no name search is needed)
========================================= */

const districtCoords = {
    "Adilabad":                { lat: 19.6641, lon: 78.5320 },
    "Bhadradri Kothagudem":    { lat: 17.5540, lon: 80.6190 },
    "Hanamkonda":              { lat: 18.0072, lon: 79.5580 },
    "Hyderabad":               { lat: 17.3850, lon: 78.4867 },
    "Jagtial":                 { lat: 18.7895, lon: 78.9120 },
    "Jangaon":                 { lat: 17.7239, lon: 79.1518 },
    "Jayashankar Bhupalpally": { lat: 18.4392, lon: 79.8747 },
    "Jogulamba Gadwal":        { lat: 16.2333, lon: 77.8000 },
    "Kamareddy":               { lat: 18.3200, lon: 78.3400 },
    "Karimnagar":              { lat: 18.4386, lon: 79.1288 },
    "Khammam":                 { lat: 17.2473, lon: 80.1514 },
    "Komaram Bheem":           { lat: 19.3667, lon: 79.2833 },
    "Mahabubabad":             { lat: 17.6019, lon: 80.0022 },
    "Mahabubnagar":            { lat: 16.7375, lon: 77.9825 },
    "Mancherial":              { lat: 18.8710, lon: 79.4590 },
    "Medak":                   { lat: 18.0453, lon: 78.2600 },
    "Medchal Malkajgiri":      { lat: 17.6294, lon: 78.4813 },
    "Mulugu":                  { lat: 18.1920, lon: 79.9440 },
    "Nagarkurnool":            { lat: 16.4833, lon: 78.3167 },
    "Nalgonda":                { lat: 17.0575, lon: 79.2684 },
    "Narayanpet":              { lat: 16.7450, lon: 77.4980 },
    "Nirmal":                  { lat: 19.0960, lon: 78.3440 },
    "Nizamabad":               { lat: 18.6725, lon: 78.0941 },
    "Peddapalli":              { lat: 18.6150, lon: 79.3720 },
    "Rajanna Sircilla":        { lat: 18.3880, lon: 78.8280 },
    "Rangareddy":              { lat: 17.2600, lon: 78.4000 },
    "Sangareddy":              { lat: 17.6247, lon: 78.0867 },
    "Siddipet":                { lat: 18.1018, lon: 78.8520 },
    "Suryapet":                { lat: 17.1400, lon: 79.6200 },
    "Vikarabad":               { lat: 17.3380, lon: 77.9040 },
    "Wanaparthy":              { lat: 16.3620, lon: 78.0620 },
    "Warangal":                { lat: 17.9689, lon: 79.5941 },
    "Yadadri Bhuvanagiri":     { lat: 17.5130, lon: 78.8890 }
};



/* =========================================
   UI HELPERS (loading + messages)
========================================= */

function showMessage(text, type) {

    error.textContent = text;

    error.className = type || "";

}

function setLoading(isLoading) {

    searchBtn.disabled = isLoading;

    cityInput.disabled = isLoading;

    searchBtn.textContent =
        isLoading ? "Loading..." : "🔍 Search Weather";

}

function clearWeather(district) {

    cityName.textContent = `${district}, Telangana`;

    date.textContent = "";

    temperature.textContent = "--°C";

    condition.textContent = "Loading weather...";

    feelsLike.textContent = "--°C";

    humidity.textContent = "--%";

    wind.textContent = "-- km/h";

    pressure.textContent = "-- hPa";

    weatherIcon.removeAttribute("src");

    weatherIcon.style.display = "none";

    forecast.innerHTML = "";

}



/* =========================================
   SEARCH BUTTON
========================================= */

searchBtn.addEventListener("click", () => {

    const district = cityInput.value.trim();

    /* Error: empty selection */

    if (district === "") {

        showMessage("❌ Please select a district.", "error");

        return;
    }

    getWeather(district);

});



/* =========================================
   GET WEATHER
========================================= */

async function getWeather(district) {

    setLoading(true);

    clearWeather(district);

    showMessage("⏳ Loading weather...", "loading");

    try {

        /* Step 1: Get the district coordinates */

        const location = districtCoords[district];


        /* Error: invalid location */

        if (!location) {

            throw new LocationError();

        }


        /* Step 2: Weather API (Open-Meteo) */

        const weatherData =
            await fetchWeatherData(
                location.lat,
                location.lon
            );

        displayCurrentWeather(weatherData);

        displayForecast(weatherData);

        cityName.textContent = `${district}, Telangana`;

        showMessage("", "");


    } catch (err) {

        console.error(err);

        weatherIcon.style.display = "none";

        forecast.innerHTML = "";

        if (err instanceof LocationError) {

            /* Invalid location */

            showMessage(
                "❌ Weather data not available for this district.",
                "error"
            );

            condition.textContent =
                "Please select another district.";

        } else {

            /* Network / API error */

            showMessage(
                "❌ Unable to connect to weather service.",
                "error"
            );

            condition.textContent =
                "Please check your connection and try again.";

        }

    } finally {

        /* Always re-enable the button after the request */

        setLoading(false);

    }

}



/* =========================================
   FETCH HELPERS
========================================= */

class LocationError extends Error {

    constructor() {

        super("Location not found");

        this.name = "LocationError";

    }

}

/* Fetch API wrapper: throws on network failure or bad HTTP status */

async function fetchJSON(url) {

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(`Request failed (${response.status})`);

    }

    return response.json();

}

function fetchWeatherData(latitude, longitude) {

    const weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    return fetchJSON(weatherURL);

}



/* =========================================
   CURRENT WEATHER
========================================= */

function displayCurrentWeather(data) {

    const current =
        data.current;


    /* Temperature */

    temperature.textContent =
        `${Math.round(
            current.temperature_2m
        )}°C`;


    /* Feels Like */

    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    /* Humidity */

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    /* Wind */

    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    /* Pressure */

    pressure.textContent =
        `${Math.round(
            current.surface_pressure
        )} hPa`;


    /* Condition */

    condition.textContent =
        getWeatherDescription(
            current.weather_code
        );


    /* Icon */

    weatherIcon.src =
        getWeatherIcon(
            current.weather_code
        );

    weatherIcon.style.display = "block";


    /* Date */

    date.textContent =
        new Date().toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}



/* =========================================
   5 DAY FORECAST
========================================= */

function displayForecast(data) {

    forecast.innerHTML = "";


    const dates =
        data.daily.time;

    const maxTemps =
        data.daily.temperature_2m_max;

    const minTemps =
        data.daily.temperature_2m_min;

    const codes =
        data.daily.weather_code;


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const day =
            new Date(dates[i]);


        const dayName =
            day.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short"
                }
            );


        const card =
            document.createElement("div");


        card.className =
            "forecast-card";


        card.innerHTML = `

            <h3>
                ${dayName}
            </h3>

            <img
                src="${getWeatherIcon(
                    codes[i]
                )}"
                alt="Weather"
            >

            <p>
                ${getWeatherDescription(
                    codes[i]
                )}
            </p>

            <strong>
                ${Math.round(
                    maxTemps[i]
                )}°C
            </strong>

            <p>
                Low:
                ${Math.round(
                    minTemps[i]
                )}°C
            </p>

        `;


        forecast.appendChild(card);

    }

}



/* =========================================
   WEATHER DESCRIPTION
========================================= */

function getWeatherDescription(code) {

    const weatherCodes = {

        0: "Clear Sky",

        1: "Mainly Clear",

        2: "Partly Cloudy",

        3: "Overcast",

        45: "Fog",

        48: "Fog",

        51: "Light Drizzle",

        53: "Drizzle",

        55: "Heavy Drizzle",

        61: "Light Rain",

        63: "Rain",

        65: "Heavy Rain",

        71: "Light Snow",

        73: "Snow",

        75: "Heavy Snow",

        80: "Rain Showers",

        81: "Rain Showers",

        82: "Heavy Rain Showers",

        95: "Thunderstorm",

        96: "Thunderstorm",

        99: "Thunderstorm"

    };


    return (
        weatherCodes[code]
        || "Unknown"
    );

}



/* =========================================
   WEATHER ICON
========================================= */

function getWeatherIcon(code) {

    if (code === 0) {

        return "https://cdn-icons-png.flaticon.com/512/869/869869.png";

    }


    if (
        code === 1 ||
        code === 2
    ) {

        return "https://cdn-icons-png.flaticon.com/512/1163/1163661.png";

    }


    if (code === 3) {

        return "https://cdn-icons-png.flaticon.com/512/414/414825.png";

    }


    if (
        code === 45 ||
        code === 48
    ) {

        return "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";

    }


    if (
        code >= 51 &&
        code <= 67
    ) {

        return "https://cdn-icons-png.flaticon.com/512/1163/1163625.png";

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return "https://cdn-icons-png.flaticon.com/512/1163/1163626.png";

    }


    if (code >= 95) {

        return "https://cdn-icons-png.flaticon.com/512/1146/1146860.png";

    }


    return "https://cdn-icons-png.flaticon.com/512/1163/1163661.png";

}



/* =========================================
   DARK MODE
========================================= */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            themeBtn.textContent =
                "☀️";

        } else {

            themeBtn.textContent =
                "🌙";

        }

    }
);
