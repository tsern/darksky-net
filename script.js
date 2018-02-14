var Weather = function(time, temperatureLow, temperatureHigh, humidity, icon) {
	this.time = time;
	this.temperatureHigh = temperatureHigh;
	this.temperatureLow = temperatureLow;
	this.humidity = humidity;
	this.icon = icon;
};

var forecast = new Array();
var latitude = '0.0';
var longitude = '0.0';
var curDay = 0;

var populateForecast = function(response) {
	
	_.each(response.daily.data, function (child) {
		
		var date = new Date(child.time*1000);
		var day = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();
        var formatDate = day + '.' + month + '.' + year;
		var temperatureHighF = child.temperatureHigh;
		var temperatureHighC = fToC(temperatureHighF);
		temperatureHighC  = Math.round(temperatureHighC);
		var temperatureLowF = child.temperatureLow;
		var temperatureLowC = fToC(temperatureLowF);
		var icon = child.icon;
		var humidity = child.humidity * 100 + '%';
		
		var weather = new Weather(formatDate, temperatureLowC, temperatureHighC, humidity, icon);
		
		forecast.push(weather);
	});
		
	updateWeather();
}

var fToC = function(fahrenheit) 
{
  var fToCel = (fahrenheit - 32) * 5 / 9;
  return fToCel.toFixed(0);
} 

var updateLocation = function(location) {
	latitude = location.coords.latitude;
	longitude = location.coords.longitude;
	
	addGoogleMapsJs();
      
}

function initMap() {
    var geocoder = new google.maps.Geocoder;
	var latlng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
	geocoder.geocode({'location': latlng}, function(results, status) {
	  if (status === 'OK') {
		if (results[0]) {
		  	var location = document.getElementById('location');
			location.innerHTML = results[0].address_components[3].long_name;
			
		} else {
		  window.alert('No results found');
		}
	  } else {
		window.alert('Geocoder failed due to: ' + status);
	  }
	});
      }

var addDarkskyNetJs = function() {
	var key = '72e22e684337099d13115772b0079652';
	var url = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}?callback=populateForecast`;
		
	var jsonpScript = document.createElement('script');
	jsonpScript.src = url;
	document.body.appendChild(jsonpScript);
}

var addGoogleMapsJs = function() {
	var url = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDHo41Sfyflf1nvmHwjNWBWa1DAQT9N6pk&callback=initMap`;
	
	var jsElem = document.createElement('script');
	jsElem.src = url;
	document.body.appendChild(jsElem);
	
	addDarkskyNetJs();	
}

var updateWeather = function() {
	var temperatureHigh = document.getElementById('temperatureHigh');
	temperatureHigh.innerHTML = forecast[curDay].temperatureHigh+'°C';
	
	var temperatureLow = document.getElementById('temperatureLow');
	temperatureLow.innerHTML = forecast[curDay].temperatureLow+'°C';
	
	var time = document.getElementById('time');
	time.innerHTML = forecast[curDay].time;
	
	var humidity = document.getElementById('humidity');
	humidity.innerHTML = forecast[curDay].humidity;
	
	var iconEl = document.getElementById('icon');
	switch (forecast[curDay].icon) {
	case 'clear-day':
		iconEl.src = 'img/clear-day.png';
		break;
	case 'clear-night':
		iconEl.src = 'img/clear-night.png';
		break;
	case 'fog':
		iconEl.src = 'img/fog.png';
		break;
	case 'cloudy':
		iconEl.src = 'img/cloudy.png';
		break;
	case 'snow':
		iconEl.src = 'img/snow.png';
		break;
	case 'party-cloudy-day':
		iconEl.src = 'img/party-cloudy-day.png';
		break;
	case 'wind':
		iconEl.src = 'img/wind.png';
		break;
	case 'sleet':
		iconEl.src = 'img/sleet.png';
		break;
	}
		   
}

var onPrevDayClick = function() {
	curDay = curDay - 1;
	if (curDay < 0) {
		curDay = 0;
	}
	
	updateWeather();
}

var onNextDayClick = function() {
	curDay = curDay + 1;
	if (curDay > forecast.length - 1) {
		curDay = forecast.length - 1;
	}
	
	updateWeather();
}

var onTodayClick = function() {
	curDay = 0;
	
	updateWeather();
}

navigator.geolocation.getCurrentPosition(updateLocation);

