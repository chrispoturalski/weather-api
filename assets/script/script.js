// Variables

// HTML Variable
var title = document.getElementById('title');
var colLeft = document.getElementById('column-left');
var search = document.getElementById('search');
var colMid = document.getElementById('column-middle');
var curCity = document.getElementById('current-city');
var forecast = document.getElementById('forecast');
var colRight = document.getElementById('column-right');
var prevCity = document.getElementById('history');
var input = document.querySelector('#input');
var searchNow = document.querySelector('#search-now')
var city = document.getElementById('#city');
var temp = document.getElementById('#temp');
var wind = document.getElementById('#wind');
var humidity = document.getElementById('#humidity');
var historyCity = document.getElementById('#history-city')

input.addEventListener('keyup', function(event){
    if(event.key === 'Enter') {
        createWeatherDisplay(event.target.value)
    }
})

var previousSearchHistory = localStorage.getItem('history')
if (previousSearchHistory) {
    previousSearchHistory = JSON.parse(previousSearchHistory)
} else {
    previousSearchHistory = []
}

for (var i = 0; i < previousSearchHistory.length; i++) {
    var historyBtn = document.createElement('button')
    var historyItem = previousSearchHistory[i]
    historyBtn.textContent = historyItem
    historyBtn.addEventListener('click', function(event) {
        createWeatherDisplay(event.target.textContent)
    })
}

var API_KEY = 'fb504c3aaa39e72e8534a9c4c32fcd83'

//function to grab location from API Key
function getGeoLocation(query, limit = 5) {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${API_KEY}`)
  }

  function getCurrentWeather(arguments) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${arguments.lat}&lon=${arguments.lon}&units=${'imperial'}&appid=${API_KEY}`)
  }

function addToHistory(location) {
    var searchHistory = localStorage.getItem('history')
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory)
        for(var i = 0; i < searchHistory; i++) {
            if (searchHistory[i] === location) {
            return
            }
        }
        searchHistory.push(location)
        localStorage.setItem('history', JSON.stringify(searchHistory))
    } else {
        searchHistory = (location)
        localStorage.setItem('history', JSON.stringify(searchHistory))
    }
}

//A function that returns a promise. The promise is a fetch to api geolocator
function createWeatherDisplay(location){
    return getGeoLocation(location)
    .then(function(response) {
        return response.json()
    })
    .then(data => {
        console.log(data)
        if (data.length === 0) {
            var errorEl = document.createElement('p')
            errorEl.textContent = `We couldn't find ${location}`
            document.body.appendChild(errorEl)
        } else {
            getCurrentWeather ({ lat: data[0].lat, lon: data[0].lon })
            .then(weatherResponse => weatherResponse.json())
            .then(weatherData => {
                //This following function will display the weather icon and basic despription of current weather
                var weatherPicture = document.createElement('img')
                weatherPicture.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
                var currentWeatherStatement = document.createElement('p')
                currentWeatherStatement.textContent = `${weatherData.weather[0].main}: it is currently ${weatherData.weather[0].description}`
                //document.body.appendChild(weatherPicture)
                //document.appendChild(currentWeatherStatement)
                console.log(JSON.stringify(data, null, 2))
                addToHistory(location)
            })
            .catch(error => {
                document.body.textContent = error.message
            })
        }
    })
    .catch(error => {
        document.body.textContent = error.message
    });
}


//Criteria
// I want to see the weather outlook for multiple cities
// GIVEN a weather dashboard with form input
//When I search for a city
//Then I am presented with current and future conditions for that city and 
// (cont.) this city is added to the search history
//Then I am presented with the city name, the date, an icon representation
// (cont.) of weather cond., temp, humid, and wind speed
//When I view the weather conditions for that city
//Then I am presented with a 5-day forecast that displays the date, an icon
//represenation of weather conditions, the temp, wind speed, and humidity
//When I click on a city in the search history
//Then I am again presented with current and future conditions for that city