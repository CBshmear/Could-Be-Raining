var apiKey = "620f19671ee57177ce7da59e3ed460e7";
var cityInputEl = document.querySelector("#city-input");
var citySubmitBut = document.querySelector("#city-form");
var todaysForecast = document.querySelector("#todays-forecast");
var searchedEl = document.querySelector("#searched-cities");
var cityName = cityInputEl.value.trim();

//takes city name that was written and passes it to get cords function
var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = cityInputEl.value.trim();
  console.log(cityName);
  if (cityName) {
    getCords(cityName);
  } else {
    alert("Please enter a city");
  }
  localStorage.setItem("city", cityName);
  todaysForecast.textContent = "";
  displaySearched(cityName);
};

function displaySearched() {
  var searchedList = document.createElement("ul");
  var searchedListItem = document.createElement("button");
  var storedCity = localStorage.getItem("city");
  searchedListItem.setAttribute("data-city", storedCity);
  searchedListItem.textContent = storedCity;
  searchedEl.appendChild(searchedList);
  searchedList.appendChild(searchedListItem);

  searchedListItem.addEventListener("click", function (event) {
    event.preventDefault();

    var clickedButton = event.target;

    getCords(clickedButton.getAttribute("data-city"));
    todaysForecast.textContent = "";
  });
}

var getCords = function (cityName) {
  var apiUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=5&appid=620f19671ee57177ce7da59e3ed460e7";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        var citLat = data[0].lat;
        var citLon = data[0].lon;
        getForecast(citLat, citLon);
      });
    }
  });
};

var getForecast = function (lat, lon) {
  var apiTwoUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=620f19671ee57177ce7da59e3ed460e7";

  fetch(apiTwoUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);

        var cityName = data.city.name;
        var cityDate = data.list[3].dt_txt;
        var weatherIcon = data.list[3].weather[0].icon;
        var humidity = data.list[3].main.humidity;
        var temp = data.list[3].main.temp;
        var windSpeed = data.list[3].wind.speed;

        var cityEl = document.createElement("div");
        cityEl.textContent = cityName;
        todaysForecast.appendChild(cityEl);
        var dateEl = document.createElement("div");
        dateEl.textContent = "Date: " + cityDate;
        cityEl.appendChild(dateEl);

        var weatherEl = document.createElement("div");
        var iconImage = document.createElement("img");
        iconImage.setAttribute(
          "src",
          "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
        );
        dateEl.appendChild(weatherEl);
        weatherEl.appendChild(iconImage);

        var humidityEl = document.createElement("div");
        humidityEl.textContent = "Humidity: " + humidity;
        weatherEl.appendChild(humidityEl);

        var tempEl = document.createElement("div");
        tempEl.textContent = "Temperature: " + temp + "F";
        humidityEl.appendChild(tempEl);

        var speedEl = document.createElement("div");
        speedEl.textContent = "Wind Speed: " + windSpeed;
        tempEl.appendChild(speedEl);

        let dayNum = 1;
        for (var i = 0; i < data.list.length; i = i + 8) {
          var dayBox = document.getElementById("day" + dayNum);
          var oneDay = data.list[i];
          console.log(oneDay);
          dayBox.innerHTML = "";

          var date = oneDay.dt_txt;
          var dateBox = document.createElement("div");
          dateBox.textContent = "Date: " + date;
          dayBox.appendChild(dateBox);

          var icon = oneDay.weather[0].icon;
          var iconContainer = document.createElement("div");
          var iconBox = document.createElement("img");
          iconBox.setAttribute(
            "src",
            "http://openweathermap.org/img/wn/" + icon + "@2x.png"
          );
          dateBox.appendChild(iconContainer);
          iconContainer.appendChild(iconBox);

          var temp5 = oneDay.main.temp;
          var tempBox = document.createElement("div");
          tempBox.textContent = "Temperature: " + temp5 + "F";
          iconContainer.appendChild(tempBox);

          var wind = oneDay.wind.speed;
          var windBox = document.createElement("div");
          windBox.textContent = "Wind Speed: " + wind + "mph";
          tempBox.appendChild(windBox);

          var humidity5 = oneDay.main.humidity;
          var humidBox = document.createElement("div");
          humidBox.textContent = "Humidity: " + humidity5;
          windBox.appendChild(humidBox);

          dayNum++;
        }
      });
    }
  });
};

citySubmitBut.addEventListener("submit", formSubmitHandler);
