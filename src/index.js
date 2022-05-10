function formatDate() {
  let now = new Date();

  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDayOfWeek = daysOfWeek[now.getDay()];

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
  console.log(currentDate);
  return currentDate;
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
    displayCity(response);
    displayTemperature(response);
    displayWeatherDetails(response);
  });
  let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(forecastURL).then(function (response) {
    displayForecast(response);
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
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  // TODO: pull API forecast data here
  console.log("Forecast data", response.data);
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];

  let forecastHTML = `<div class="row mt-5 ml-5 mr-5 mb-2">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
    <div class="col future-day">
    <div class="day">
    ${day}
    </div>
    <img
    src="images/sun.svg"
    alt=""
    width="35px"
    class="mt-1 mb-2"
    />
          <div class="temperature">
            H:<span class="max-temp">62</span>º
          </div>
          <div class="temperature">
          L:<span class="min-temp">54</span>º
          </div>
          </div>
          `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  console.log(forecastHTML);
}
function handleUserLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(`Latitude: ${latitude}`);
  console.log(`Longitude: ${longitude}`);
  getTemperature(latitude, longitude);
  getForecast(latitude, longitude);
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

  let weatherIcon = response.data.weather[0].icon;
  let currentWeatherIcon = document.querySelector("#main-weather-icon");
  if (weatherIcon == "01d" || weatherIcon == "01n") {
    currentWeatherIcon.setAttribute("src", "images/sun.svg");
  }
  if (weatherIcon == "02d" || weatherIcon == "02n") {
    currentWeatherIcon.setAttribute("src", "images/partly_cloudy.svg");
  }
  if (weatherIcon == "03d" || weatherIcon == "03n") {
    currentWeatherIcon.setAttribute("src", "images/cloud.svg");
  }
  if (weatherIcon == "04d" || weatherIcon == "04n") {
    currentWeatherIcon.setAttribute("src", "images/cloud.svg");
  }
  if (weatherIcon == "09d" || weatherIcon == "09n") {
    currentWeatherIcon.setAttribute("src", "images/raining.svg");
  }
  if (weatherIcon == "10d" || weatherIcon == "10n") {
    currentWeatherIcon.setAttribute("src", "images/raining.svg");
  }
  if (weatherIcon == "11d" || weatherIcon == "11n") {
    currentWeatherIcon.setAttribute("src", "images/storm.svg");
  }
  if (weatherIcon == "13d" || weatherIcon == "13n") {
    currentWeatherIcon.setAttribute("src", "images/snowing.svg");
  }
  if (weatherIcon == "50d" || weatherIcon == "50n") {
    currentWeatherIcon.setAttribute("src", "images/mist.svg");
  }
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
