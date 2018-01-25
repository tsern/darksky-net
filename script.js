var latitude = '0.0';
var longitude = '0.0';

var get = function (url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.withCredentials = true;

	xhr.onreadystatechange = function () {
	if (xhr.readyState != xhr.DONE) return;

		var status = xhr.status;
		var headers = xhr.getAllResponseHeaders();
		var text = xhr.responseText;

		callback(status, headers, text);
	}

	xhr.send();
}

var updateLocation = function() {
	// Latitude і Longitude захардкодена, так як я не знаю АПІшки www.where-am-i.net
	latitude = '49.82149';
	longitude = '24.00327';
	
	var location = document.getElementById('location');
	location.innerHTML = `${latitude}, ${longitude}`;
}

var updateWeather = function() {
	var key = '72e22e684337099d13115772b0079652';
	var url = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`;
		
	
	get(url, function (status, headers, body) {
		var response = JSON.parse(body);

		/*_.each(response.data.children, function (child) {
			var url = child.data.url;

			appendImage(url);
		});*/

	});
		
}

updateLocation();
updateWeather();