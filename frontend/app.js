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
const COORDS_CACHE_KEY = "weather_coords_cache_v1";
const COORDS_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setTheme(themeClass, label) {
  document.body.classList.remove(...THEME_CLASSES);
  document.body.classList.add(themeClass);

  const weatherState = document.getElementById("weatherState");
  if (weatherState) {
    weatherState.textContent = label;
  }
}

function applyDynamicBackground(temperature, humidity) {
  const safeTemp = typeof temperature === "number" ? clamp(temperature, 0, 40) : 20;
  const safeHumidity = typeof humidity === "number" ? clamp(humidity, 0, 100) : 50;

  // Temperature: 0C(blue) -> 40C(warm orange)
  const hue = Math.round(220 - (safeTemp / 40) * 190);
  // Humidity: adjust saturation only
  const saturation = Math.round(35 + (safeHumidity / 100) * 55);

  document.body.style.setProperty("--bg-hue", String(hue));
  document.body.style.setProperty("--bg-sat", `${saturation}%`);
}

function setWeatherDetails(current) {
  const tempEl = document.getElementById("weatherTemp");
  const humidityEl = document.getElementById("weatherHumidity");
  const windEl = document.getElementById("weatherWind");

  if (tempEl) {
    tempEl.textContent =
      typeof current.temperature_2m === "number"
        ? `${current.temperature_2m.toFixed(1)}℃`
        : "--";
  }

  if (humidityEl) {
    humidityEl.textContent =
      typeof current.relative_humidity_2m === "number"
        ? `${Math.round(current.relative_humidity_2m)}%`
        : "--";
  }

  if (windEl) {
    windEl.textContent =
      typeof current.wind_speed_10m === "number"
        ? `${current.wind_speed_10m.toFixed(1)} km/h`
        : "--";
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

function loadCachedCoords() {
  try {
    const raw = localStorage.getItem(COORDS_CACHE_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw);
    if (!cached || typeof cached !== "object") return null;
    if (typeof cached.latitude !== "number" || typeof cached.longitude !== "number") {
      return null;
    }
    if (typeof cached.savedAt !== "number") return null;

    const age = Date.now() - cached.savedAt;
    if (age > COORDS_CACHE_MAX_AGE_MS) return null;

    return {
      latitude: cached.latitude,
      longitude: cached.longitude,
    };
  } catch (error) {
    console.warn("Failed to load cached coords.", error);
    return null;
  }
}

function saveCachedCoords(latitude, longitude) {
  try {
    localStorage.setItem(
      COORDS_CACHE_KEY,
      JSON.stringify({
        latitude,
        longitude,
        savedAt: Date.now(),
      })
    );
  } catch (error) {
    console.warn("Failed to save cached coords.", error);
  }
}

async function fetchCurrentWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
    `&longitude=${longitude}` +
    "&current=weather_code,is_day,temperature_2m,relative_humidity_2m,wind_speed_10m" +
    "&timezone=auto";

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

  const weather = classifyWeather(weatherCode, isDay);

  return {
    themeClass: weather.themeClass,
    label: weather.label,
    current,
  };
}

async function applyWeatherTheme() {
  const cachedCoords = loadCachedCoords();
  let coords = cachedCoords || TOKYO_COORDS;

  if (!cachedCoords) {
    try {
      const position = await getCurrentPosition();
      coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      saveCachedCoords(coords.latitude, coords.longitude);
    } catch (error) {
      console.warn("Using fallback coordinates.", error);
    }
  }

  try {
    const weather = await fetchCurrentWeather(coords.latitude, coords.longitude);
    setTheme(weather.themeClass, weather.label);
    setWeatherDetails(weather.current);
    applyDynamicBackground(
      weather.current.temperature_2m,
      weather.current.relative_humidity_2m
    );
  } catch (error) {
    console.error(error);
    setTheme("theme-cloudy", "Cloudy");
    setWeatherDetails({});
    applyDynamicBackground(20, 50);
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
