const TOKYO_COORDS = {
  latitude: 35.6762,
  longitude: 139.6503,
};

const THEME_CLASSES = [
  "theme-sunny",
  "theme-cloudy",
  "theme-rainy",
  "theme-snowy",
  "theme-night",
];

const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
]);
const CLOUDY_CODES = new Set([2, 3, 45, 48]);

function setTheme(themeClass, label) {
  document.body.classList.remove(...THEME_CLASSES);
  document.body.classList.add(themeClass);

  const weatherState = document.getElementById("weatherState");
  if (weatherState) {
    weatherState.textContent = label;
  }
}

function classifyWeather(weatherCode, isDay) {
  if (isDay === 0) {
    return { themeClass: "theme-night", label: "Night" };
  }

  if (SNOW_CODES.has(weatherCode)) {
    return { themeClass: "theme-snowy", label: "Snowy" };
  }

  if (RAIN_CODES.has(weatherCode)) {
    return { themeClass: "theme-rainy", label: "Rainy" };
  }

  if (CLOUDY_CODES.has(weatherCode)) {
    return { themeClass: "theme-cloudy", label: "Cloudy" };
  }

  return { themeClass: "theme-sunny", label: "Sunny" };
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    });
  });
}

async function fetchCurrentWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
    `&longitude=${longitude}&current=weather_code,is_day`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Weather API request failed.");
  }

  const data = await response.json();
  const current = data.current || data.current_weather;

  if (!current) {
    throw new Error("Weather API response is missing current data.");
  }

  const weatherCode = current.weather_code ?? current.weathercode;
  const isDay = current.is_day ?? 1;

  if (typeof weatherCode !== "number") {
    throw new Error("Weather code is invalid.");
  }

  return classifyWeather(weatherCode, isDay);
}

async function applyWeatherTheme() {
  let coords = TOKYO_COORDS;

  try {
    const position = await getCurrentPosition();
    coords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    console.warn("Using Tokyo fallback coordinates.", error);
  }

  try {
    const weather = await fetchCurrentWeather(coords.latitude, coords.longitude);
    setTheme(weather.themeClass, weather.label);
  } catch (error) {
    console.error(error);
    setTheme("theme-cloudy", "Cloudy");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cta = document.querySelector(".cta");

  if (cta) {
    cta.addEventListener("click", () => {
      cta.textContent = "スクロールしています...";
      window.setTimeout(() => {
        cta.textContent = "詳細を見る";
      }, 900);
    });
  }

  applyWeatherTheme();
});
