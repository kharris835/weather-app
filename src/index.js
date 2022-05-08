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

  let currentHour = now.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }

  let currentMinute = now.getMinutes();
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }

  let currentDate = `${currentDayOfWeek} ${currentHour}:${currentMinute}`;
  console.log(currentDate);
  return currentDate;
}

let dateElement = document.querySelector(".format-date");
dateElement.innerHTML = formatDate();

function onSubmitCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value.trim();
  let apiKey = "b5b56bf4012bed80cd4ce11f2dda7ff2";
  let units = "imperial";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(function (response) {
    handleCity(response);
    handleTemperature(response);
    handleTempDetails(response);
  });
}

let citySubmitBtn = document.querySelector("#city-submit-btn");
citySubmitBtn.addEventListener("click", onSubmitCity);

function getTemperature(latitude, longitude) {
  let apiKey = "b5b56bf4012bed80cd4ce11f2dda7ff2";
  let units = "imperial";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(function (response) {
    handleCity(response);
    handleTemperature(response);
    handleTempDetails(response);
  });
}

function handleUserLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(`Latitude: ${latitude}`);
  console.log(`Longitude: ${longitude}`);
  getTemperature(latitude, longitude);
}

function handleTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  console.log(`${temperature}ºC`);
  let currentTemp = document.querySelector(".main-temperature");
  currentTemp.innerHTML = `${temperature}ºF`;
}

function handleCity(response) {
  let city = response.data.name;
  console.log(city);
  let currentCity = document.querySelector(".city");
  currentCity.innerHTML = city;
}

function handleTempDetails(response) {
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
}

function requestLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleUserLocation);
}

let cityLocationBtn = document.querySelector("#city-location-btn");
cityLocationBtn.addEventListener("click", requestLocation);

// function onChangeTemp() {
//   if (displayTemp.innerHTML.includes("F")) {
//     let tempCelcius = "19ºC";
//     displayTemp.innerHTML = tempCelcius;
//   } else {
//     displayTemp.innerHTML = "62ºF";
//   }
// }

// let displayTemp = document.querySelector(".main-temperature");
// displayTemp.addEventListener("click", onChangeTemp);
