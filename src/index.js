const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatDate() {
  let now = new Date();

  let currentDayOfWeek = DAYS_OF_WEEK[now.getDay()];

  let hours = now.getHours();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  let currentHour = hours % 12 || 12;

  let currentMinute = now.getMinutes();
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }

  let currentDate = `${currentDayOfWeek} ${currentHour}:${currentMinute} ${ampm}`;
  // console.log(currentDate);
  return currentDate;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  // console.log(day);
  return DAYS_OF_WEEK[day].substring(0, 3);
}

let dateElement = document.querySelector(".format-date");
dateElement.innerHTML = formatDate();

function onSubmitCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value.trim();
  getWeather(cityInput);
}

let apiKey = "b5b56bf4012bed80cd4ce11f2dda7ff2";
let units = "imperial";

function getWeather(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(function (response) {
    getForecast(response.data.coord.lat, response.data.coord.lon).then(
      function (forecastResponse) {
        displayCity(response);
        displayTemperature(response);
        displayWeatherDetails(response);
        displayForecast(forecastResponse);
      }
    );
  });
}

let citySubmitBtn = document.querySelector("#city-submit-btn");
citySubmitBtn.addEventListener("click", onSubmitCity);

function getTemperature(latitude, longitude) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(function (response) {
    displayCity(response);
    displayTemperature(response);
    displayWeatherDetails(response);
  });
}

function getForecast(latitude, longitude) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  return axios.get(url);
}

function displayForecast(response) {
  // TODO: pull API forecast data here
  let forecast = response.data.daily;
  // console.log("Forecast data", forecast);

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row mt-5 ml-5 mr-5 mb-2">`;
  forecast.forEach(function (forecastDay, index) {
    // console.log(forecastDay);
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col future-day">
    <div class="day">
    ${formatDay(forecastDay.dt)}
    </div>
    <img
    src="${convertApiIconToLocalImage(forecastDay.weather[0].icon)}"
    alt="${forecastDay.weather.description}"
    width="35px"
    class="mt-1 mb-2"
    />
          <div class="temperature">
            H:<span class="max-temp">${Math.round(forecastDay.temp.max)}</span>º
          </div>
          <div class="temperature">
          L:<span class="min-temp">${Math.round(forecastDay.temp.min)}</span>º
          </div>
          </div>
          `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function handleUserLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(`Latitude: ${latitude}`);
  console.log(`Longitude: ${longitude}`);
  getTemperature(latitude, longitude);
  getForecast(latitude, longitude).then(displayForecast);
}

function displayTemperature(response) {
  fahrenheitTemperature = response.data.main.temp;
  celciusTemperature = Math.round(((fahrenheitTemperature - 32) * 5) / 9);
  let temperature = Math.round(fahrenheitTemperature);
  console.log(`${temperature}ºF`);
  console.log(fahrenheitTemperature);
  console.log(celciusTemperature);
  let currentTemp = document.querySelector(".main-temperature");
  currentTemp.innerHTML = `${temperature}`;
}

function displayCity(response) {
  let city = response.data.name;
  console.log(city);
  let currentCity = document.querySelector(".city");
  currentCity.innerHTML = city;
}

function displayWeatherDetails(response) {
  console.log(response.data);
  let humidity = response.data.main.humidity;
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `${humidity}%`;
  // let precipitation = response.data;
  let wind = Math.round(response.data.wind.speed);
  let currentWind = document.querySelector("#wind");
  currentWind.innerHTML = `${wind}mph`;
  let weatherDescription = response.data.weather[0].description;
  let currentWeatherDesc = document.querySelector("#weather-description");
  currentWeatherDesc.innerHTML = `${weatherDescription}`;
  displayWeatherIcon(response.data.weather[0].icon);
}

function convertApiIconToLocalImage(apiIcon) {
  if (apiIcon == "01d" || apiIcon == "01n") {
    return "images/sun.svg";
  }
  if (apiIcon == "02d" || apiIcon == "02n") {
    return "images/partly_cloudy.svg";
  }
  if (apiIcon == "03d" || apiIcon == "03n") {
    return "images/cloud.svg";
  }
  if (apiIcon == "04d" || apiIcon == "04n") {
    return "images/cloud.svg";
  }
  if (apiIcon == "09d" || apiIcon == "09n") {
    return "images/raining.svg";
  }
  if (apiIcon == "10d" || apiIcon == "10n") {
    return "images/raining.svg";
  }
  if (apiIcon == "11d" || apiIcon == "11n") {
    return "images/storm.svg";
  }
  if (apiIcon == "13d" || apiIcon == "13n") {
    return "images/snowing.svg";
  }
  if (apiIcon == "50d" || apiIcon == "50n") {
    return "images/mist.svg";
  }

  // Unexpected, but in case new API images are added, default to sun.
  return "images/sun.svg";
}

function displayWeatherIcon(apiImage) {
  let currentWeatherIcon = document.querySelector("#main-weather-icon");
  const niceImagePath = convertApiIconToLocalImage(apiImage);
  currentWeatherIcon.setAttribute("src", niceImagePath);
}

function requestLocation() {
  navigator.geolocation.getCurrentPosition(handleUserLocation);
}

let cityLocationBtn = document.querySelector("#current-location-btn");
cityLocationBtn.addEventListener("click", function (event) {
  event.preventDefault();
  requestLocation();
});

let fahrenheitTemperature = 0;
let celciusTemperature = 0;

function displayCelciusTemp() {
  let temperatureElement = document.querySelector(".main-temperature");
  fahrenheitLink.classList.remove("active");
  celciusLink.classList.add("active");
  temperatureElement.innerHTML = celciusTemperature;
}

function displayFahrenheitTemp() {
  let temperatureElement = document.querySelector(".main-temperature");
  fahrenheitLink.classList.add("active");
  celciusLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", function (event) {
  event.preventDefault();
  displayCelciusTemp();
});

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", function (event) {
  event.preventDefault();
  displayFahrenheitTemp();
});

getWeather("Boulder");
// displayForecast();
