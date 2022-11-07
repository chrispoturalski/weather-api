// Variables
var API_Key = '4253ae682bded8fe54667e18d996e279'
// HTML Variable
var title = document.getElementById('title');
var colLeft = document.getElementById('column-left');
var search = document.getElementById('search');
var colMid = document.getElementById('column-middle');
var curCity = document.getElementById('current-city');
var forecast = document.getElementById('forecast');
var colRight = document.getElementById('column-right');
var prevCity = document.getElementById('history');

//function to grab location from API Key
function getGeoLocation(query, limit = 5){
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${API_KEY}`)
}

function getCurrentWeather({arguments}) {
    return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${arguments.lat}&lon=${arguments.lon}&units=${'imperial'}&appid={API_KEY}`)
}


getGeoLocation('Irvine')
.then(response => response.json())
.then(data => {
    var { lat, lon } = data[0]
    getCurrentWeather ({lat, lon})
    .then(weatherResponse => weatherResponse.json())
    .then(weatherData => {
        console.log(JSON.stringify(data, null, 2))
    })
    .catch(error => {
        console.log(error.message)
    })
})
.catch(error => {
    console.log(error.message)
});
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