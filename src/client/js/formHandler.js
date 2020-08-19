
const tripRequest = document.getElementById('tripRequest');
const tripResult = document.getElementById('tripResult');
const postingData = {};
let hasError = false;
let errorMessage = 'Trip Destination Not Found !';
let weatherDesc = 'The Current weather is ';

function handleSubmit(e) {
    e.preventDefault(); 
    // Getting elements value from DOM
    postingData['destname'] = document.getElementById('destName').value;
    postingData['destdate'] = document.getElementById('destDate').value;
    postingData['daystotrip'] = dateDiff(postingData['destdate']);

    try {
        // check for input errors  
			hasError = false;
			let hasValue = document.getElementById("destName");
			if (hasValue == null || hasValue.value === "")
			{
				hasError = true;
				errorMessage = "No Destination Entered";
				updateErrorScreen();
				return;
			}
			hasValue = document.getElementById("destDate");
			if (hasValue == null || hasValue.value === "")
			{
				hasError = true;
				errorMessage = "No Destination Date";
				updateErrorScreen();
				return;
			}
        // call Geonames api to get the lattatude and longitude 
        geonamesApi(postingData['destname'])
            .then((result) => {
				if (result.geonames.length === 0){
					hasError = true;  // if it can't find the destination return error
					return;
				}
                const Lat = result.geonames[0].lat;
                const Lng = result.geonames[0].lng;
                // call Weatherbit api - passing in the longitude and lattatude to get the temperature and weather description
                return getWeatherData(Lat, Lng, postingData['destdate']);
            })
            .then((weatherData) => {
				if (hasError) {
					return;
				}
				let isError = weatherData['error'];
				if (isError !== undefined){
					hasError = true;
					errorMessage = weatherData['error'];
					return;
				}
                postingData['temperature'] = weatherData['data'][0]['temp'];
                postingData['weather'] = weatherData['data']['0']['weather']['description'];

                // call Pixabay api to get the destination pictures
                return getImage(postingData['destname']);
            })
            .then((imageDetails) => {
				if (hasError) {
					return;
				}
                if (imageDetails['hits'].length > 0) {
                    postingData['cityImage1'] = imageDetails['hits'][0]['webformatURL'];
                }
                if (imageDetails['hits'].length > 1) {
                    postingData['cityImage2'] = imageDetails['hits'][1]['webformatURL'];
                }
                if (imageDetails['hits'].length > 2) {
                    postingData['cityImage3'] = imageDetails['hits'][2]['webformatURL'];
                }
                //Sending data to server to store the details.
                return postData(postingData);
            })
            .then((data) => {
                //get screen data
				if (hasError) {
					updateErrorScreen();
					return;
				}
                updateScreen(data);
            })
    } catch (e) {
        console.log('error', e);
    }
}

//  get Lat & Lon
async function geonamesApi(destname) {
    const response = await fetch('http://api.geonames.org/searchJSON?q=' + destname + '&maxRows=10&username=yabski');
    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}


//Function to get weather data
async function getWeatherData(Lat, Lng, destdate) {

    let response;
    // Check if within 1 week 

	let weekFromNow = new Date();
	weekFromNow.setDate(weekFromNow.getDate() + 7);
	let destdate2 = new Date(postingData['destdate']);
	destdate2.setDate(destdate2.getDate() + 1);
	
	if (destdate2 > weekFromNow) {	
		weatherDesc = 'The predicted forecast is ';
        response = await fetch('https://api.weatherbit.io/v2.0/forecast/daily?lat=' + Lat + '&lon=' + Lng + '&units=I&key=7e6ef199c4b34c7989bd4395bf643fd1');
    } else {
        response = await fetch('https://api.weatherbit.io/v2.0/current?lat=' + Lat + '&lon=' + Lng + '&units=I&key=7e6ef199c4b34c7989bd4395bf643fd1')
    }

    try {
        return await response.json();
    } catch (e) {
        console.log('error', e)
    }
}

async function getImage(toCity) {
    const response = await fetch('https://pixabay.com/api/?key=17655399-5965040f2f71c2c0ca89916e1&q=' + toCity + ' city&image_type=photo');
    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}

async function postData(postingData) {
    const response = await fetch('http://localhost:3002/postData', {
        method: "POST",
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postingData)
    });

    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}

//Updating the screen
function updateScreen(data) {
	tripResult.style.display = "block";
	tripRequest.style.display = "none";
    let goingToDiv = document.getElementById("destination");
    let temperature = document.getElementById('temperature');
    let weather = document.getElementById('weather');
    let weatherType = document.getElementById('weatherType');
    let cityPic = document.getElementById('cityPic');
    let cityPic2 = document.getElementById('cityPic2');
    let cityPic3 = document.getElementById('cityPic3');
    let daysLeft = document.getElementById('daysLeft');

    goingToDiv.innerHTML = data.destname;

    if (data.daystotrip < 0) {
		errorMessage = "Invalid date entered";
		updateErrorScreen();
		return;

    } else {
        daysLeft.innerHTML = data.daystotrip;
    }

    temperature.innerHTML = data.temperature;
    weather.innerHTML = data.weather;
    weatherType.innerHTML = weatherDesc;

    if (data.cityImage1 !== undefined) {
        cityPic.setAttribute('src', data.cityImage1);
    }
    if (data.cityImage2 !== undefined) {
        cityPic2.setAttribute('src', data.cityImage2);
    }
    if (data.cityImage3 !== undefined) {
        cityPic3.setAttribute('src', data.cityImage3);
    }
}

function updateErrorScreen() {
 let errDiv = document.getElementById("errorDiv");
 let errMsg = document.getElementById('errMsg');

 let dest = document.getElementById('errMsg');
	tripResult.style.display = "none";
	tripRequest.style.display = "block";
	tripError.style.display = "none";
	errDiv.style.display = "block";
	errMsg.innerHTML = errorMessage;
}

let dateDiff = function (date1) {
	//Get 1 day in milliseconds
	var one_day=1000*60*60*24;

	var a = new Date(); // Current date now.
	var b = new Date(date1); // users date 
	var c = (b-a); // difference in milliseconds
	
	return Math.round(c/one_day); 
};

export {
    tripRequest,
    handleSubmit,
    tripResult
}









