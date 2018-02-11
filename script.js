var Weather = function(time, temperatureLow, temperatureHigh, precipProbability, summary) {
	this.time = time;
	this.temperatureHigh = temperatureHigh;
	this.temperatureLow = temperatureLow;
	this.precipProbability = precipProbability;
	this.summary = summary;
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
		var temperatureLow = child.temperatureLow;
		var summary = child.precipType;
		var precipProbability = child.precipProbability;
		
		var weather = new Weather(formatDate, temperatureLow, temperatureHighC, precipProbability, summary);
		
		forecast.push(weather);
	});
		
	updateWeather();
}

var fToC = function(fahrenheit) 
{
  var fToCel = (fahrenheit - 32) * 5 / 9;
  return fToCel;
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
	var temperature = document.getElementById('temperature');
	temperature.innerHTML = forecast[curDay].temperatureHigh;
	
	var time = document.getElementById('time');
	time.innerHTML = forecast[curDay].time;
	
	var precipProbability = document.getElementById('precipProbability');
	precipProbability.innerHTML = forecast[curDay].precipProbability;
	
	var summary = document.getElementById('summary');
	summary.innerHTML = forecast[curDay].summary;
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

