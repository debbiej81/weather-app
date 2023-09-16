function getDateSuffix(date) {
  if (date % 10 === 1 && date !== 11) {
    return "st";
  } else if (date % 10 === 2 && date !== 12) {
    return "nd";
  } else if (date % 10 === 3 && date !== 13) {
    return "rd";
  } else {
    return "th";
  }
}

function currentDateAndTime() {
  let now = new Date();
  let currentYear = now.getFullYear();
  let currentDate = now.getDate();
  let suffix = getDateSuffix(currentDate);
  let currentHours = now.getHours();
  let currentMinutes = now.getMinutes().toString().padStart(2, "0");
  let currentTime = `${currentHours}:${currentMinutes}`;

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[now.getDay()];

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  return `${day} ${currentDate}${suffix} ${month} ${currentYear} ${currentTime}`;
}
let displayTodaysDate = document.querySelector("#todays-date");
displayTodaysDate.innerHTML = currentDateAndTime();

//The following code contains update data functions based on current location

function displayTemp(response) {
  let tempHeader = document.querySelector("#temperature");
  let temperature = Math.round(response.data.main.temp);
  tempHeader.innerHTML = `${temperature}°`;
}
function displayCity(response) {
  let cityHeader = document.querySelector("#city-header-day");
  let currentCity = response.data.name;
  cityHeader.innerHTML = `${currentCity}`;
}

function displayWeatherDescription(response) {
  let weatherDescriptonHeader = document.querySelector("#weather-description");
  let weatherDescription = response.data.weather[0].description;
  let capitalisedWeatherDescription = capitaliseEveryWord(weatherDescription);
  weatherDescriptonHeader.innerHTML = `${capitalisedWeatherDescription}`;
}

function fetchWeatherForCurrentPosition(position) {
  let apiKey = "fda3688b1db05987dd5d07c237aecfba";
  let unit = "metric";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(function (response) {
    displayTemp(response);
    displayCity(response);
    displayWeatherDescription(response);
  });
}
let currentLocationButton = document.querySelector(
  "#current-location-button-day"
);
currentLocationButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(fetchWeatherForCurrentPosition);
});

//The following code contains update data functions based on searched location

function capitaliseEveryWord(string) {
  return string
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function fetchWeatherForSearchedCity(response) {
  let apiKey = "fda3688b1db05987dd5d07c237aecfba";
  let unit = "metric";
  let city = document.querySelector("#city-search-box").value;
  let capitalisedCity = capitaliseEveryWord(city);
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capitalisedCity}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(function (response) {
    displayTemp(response);
    displayCity(response);
    displayWeatherDescription(response);
  });
}
let searchedLocationButton = document.querySelector("#search-button-day");
searchedLocationButton.addEventListener("click", fetchWeatherForSearchedCity);

let searchedLocationBox = document.querySelector("#city-search-box");
searchedLocationBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.keyCode === 13) {
    fetchWeatherForSearchedCity();
  }
});
