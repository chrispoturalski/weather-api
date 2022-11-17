// Variables

// HTML Variable
var title = document.getElementById("title");
var colLeft = document.getElementById("column-left");
var search = document.getElementById("search");
var colMid = document.getElementById("column-middle");
var curCity = document.getElementById("current-city");
var forecast = document.getElementById("forecast");
var colRight = document.getElementById("column-right");
var prevCity = document.getElementById("history");
var input = document.querySelector("#input");
var searchNow = document.querySelector("#search-now");
var city = document.getElementById("city");
var temp = document.getElementById("temp");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var historyCity = document.getElementById("history-city");
var weatherPicture = document.getElementById("icon");
var lat;
var lon;

input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    createWeatherDisplay(event.target.value);
  }
});

function displayFiveDay(arr) {
  forecast.innerHTML = "";
  for (var i = 0; i < arr.length; i++) {
    var newH4 = document.createElement("h4");
    newH4.textContent = "Date: " + arr[i].dt_txt;
    forecast.append(newH4);
    var newH4 = document.createElement("h4");
    newH4.textContent = "Temp: " + arr[i].main.temp;
    forecast.append(newH4);
    var newH4 = document.createElement("h4");
    newH4.textContent = "Wind: " + arr[i].wind.speed;
    forecast.append(newH4);
    var newH4 = document.createElement("h4");
    newH4.textContent = "Humidity: " + arr[i].main.humidity;
    forecast.append(newH4);
    console.log(arr);
  }
}

var previousSearchHistory = localStorage.getItem("history");
if (previousSearchHistory) {
  previousSearchHistory = JSON.parse(previousSearchHistory);
} else {
  previousSearchHistory = [];
}

function showHistory() {
  historyCity.innerHTML = "";
  for (var i = 0; i < previousSearchHistory.length; i++) {
    var historyBtn = document.createElement("button");
    var historyItem = previousSearchHistory[i];
    historyBtn.textContent = historyItem;
    historyBtn.addEventListener("click", function (event) {
      createWeatherDisplay(event.target.textContent);
    });
    historyCity.append(historyBtn);
  }
}

showHistory();

var API_KEY = "fb504c3aaa39e72e8534a9c4c32fcd83";
var API_KEY2 = "5730973d5137765ea7c5d5fbd6673cec";

//function to grab location from API Key
function getGeoLocation(query, limit = 5) {
  return fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${API_KEY}`
  );
}

function getCurrentWeather(arguments) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${arguments.lat}&lon=${
      arguments.lon
    }&units=${"imperial"}&appid=${API_KEY}`
  );
}

function getFiveDayDisplay(arguments) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${arguments.lat}&lon=${arguments.lon}&units=imperial&appid=${API_KEY2}`
  );
}
function addToHistory(location) {
  var searchHistory = localStorage.getItem("history")
  if (searchHistory) {
    searchHistory = JSON.parse(searchHistory)
    if (searchHistory.includes(location)) {
        return
    }
    searchHistory.push(location)
    localStorage.setItem("history", JSON.stringify(searchHistory))
  } else {
    searchHistory = [location]
    localStorage.setItem("history", JSON.stringify(searchHistory))
  }
}

//A function that returns a promise. The promise is a fetch to api geolocator
function createWeatherDisplay(location) {
  return getGeoLocation(location)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        var errorEl = document.createElement("p");
        errorEl.textContent = `We couldn't find ${location}`;
        document.body.appendChild(errorEl);
      } else {
        lat = data[0].lat;
        lon = data[0].lon;
        getCurrentWeather({ lat: data[0].lat, lon: data[0].lon })
          .then((weatherResponse) => weatherResponse.json())
          .then((weatherData) => {
            var tempValue = weatherData.main.temp;
            var windValue = weatherData.wind.speed;
            var humidityValue = weatherData.main.humidity;
            addToHistory(location);
            displayWeather(location, tempValue, windValue, humidityValue);

            function displayWeather(
              location,
              tempValue,
              windValue,
              humidityValue
            ) {
              city.textContent = `${location}`;
              temp.textContent = `Temp: ${tempValue} F`;
              wind.textContent = `Wind: ${windValue} MPH`;
              humidity.textContent = `Humidity: ${humidityValue}`;
            }
          })
          .catch((error) => {
            document.body.textContent = error.message;
          });
        getFiveDayDisplay({ lat: data[0].lat, lon: data[0].lon })
          .then((data) => data.json())
          .then((data) => {
            var fiveDayArray = data.list;
            var filteredArray = [];
            for (var i = 0; i < fiveDayArray.length; i++) {
              if (fiveDayArray[i].dt_txt.includes("12:00:00")) {
                filteredArray.push(fiveDayArray[i]);
              }
            }
            displayFiveDay(filteredArray);
            addToHistory();
            showHistory();
          });
      }
    })

    .catch((error) => {
      document.body.textContent = error.message;
    });
}
