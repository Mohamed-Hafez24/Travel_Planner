const dotenv = require('dotenv');
dotenv.config();

// Setup empty JS object to act as endpoint for all routes
//projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/*Dependencies*/
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

//For fetch requests
const fetch = require("node-fetch");

// Initialize the main project folder
app.use(express.static('dist'));

app.get('/', (req, res) => {
    res.sendFile('dist/index.html');
});

// Setup Server
// const port = process.env.port || 8000;
const PORT = process.env.PORT || 7000;

//Callback to debug
const server = app.listen(PORT, ()=>{
    console.log('server running');
    console.log(`running on localhost: ${PORT}`);
})



//Geonames API URL & parameters
const geonamesURL = 'http://api.geonames.org/searchJSON?q=';
const geonamesParameters = '&maxRows=10&fuzzy=0.8&';
const geonamesUsername = `username=${process.env.GEONAMES_USERNAME}`;

//Dark Sky API Data
const darkSkyURL = 'https://api.darksky.net/forecast/';
const darkSkyKey = `${process.env.DARKSKY_KEY}/`;
const darkSkyExclude = '?exclude=currently,minutely,hourly,alerts,flags';

//Pixabay URL
const pixabayURL = 'https://pixabay.com/api/?key=';
const pixabayKey = `${process.env.PIXABAY_KEY}&q=`;
const pixabayParameters = '&image_type=photo';

// Weatherbit URL
const weatherbitURL = 'https://api.weatherbit.io/v2.0/forecast/daily?'
const weatherbitKey = `${process.env.WEATHERBIT_KEY}`;

const parseGeonamesData = (data) => {
    const longitude = data.geonames[0].lng;
    const latitude = data.geonames[0].lat;
    const country = data.geonames[0].countryName;

    const geonamesInfo = {
        longitude: longitude,
        latitude: latitude,
        country: country
    }
    return geonamesInfo;
}

const getDarkSkyData = (data, tripInSeconds) => {
    const longitude = data.longitude;
    const latitude = data.latitude;
    const url = `${darkSkyURL}${darkSkyKey}${latitude},${longitude},${tripInSeconds.toString()}${darkSkyExclude}`;

    return fetch(url)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            const summary = data.daily.data[0].summary;
            const icon = data.daily.data[0].icon;
            const highTemp = data.daily.data[0].temperatureHigh;
            const lowTemp = data.daily.data[0].temperatureLow;
            const darkskyInfo = {
                summary: summary,
                icon: icon,
                highTemp: highTemp,
                lowTemp: lowTemp
            }
            console.log(darkskyInfo);
            return darkskyInfo;
        })
}


const getWeatherBitData = (data, tripInSeconds)=> {
    const longitude = data.longitude;
    const latitude = data.latitude;
    const url = `${weatherbitURL}&lat=${latitude}&lon=${longitude}&key=${weatherbitKey}`;
    return fetch(url)
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            const summary = data.data[0].weather.description;
            const icon = data.data[0].weather.icon;
            const highTemp = data.data[0].high_temp;
            const lowTemp = data.data[0].low_temp;
            const contryCode = data.country_code;

            const WeatherBit = {
                summary: summary,
                icon: icon,
                highTemp: highTemp,
                lowTemp: lowTemp,
                contryCode: contryCode
            }
            return WeatherBit;
        })

}



const getPixabayData = (data, location) => {
    const clientObject = {
        destination:location,
        summary: data.summary,
        icon: data.icon,
        highTemp: data.highTemp,
        lowTemp: data.lowTemp,
        contryCode: data.contryCode

    }
    return fetch(`${pixabayURL}${pixabayKey}${location}${pixabayParameters}`)
        .then((res) => {
            return res.json()
        })
        .then((newData) => {
            let photoUrl = '';
            const results = newData.hits;

            results.length > 0 ? photoUrl += results[0].webformatURL : photoUrl += '';

            clientObject['photoUrl'] = photoUrl;

            return clientObject;
        })
}



app.post('/destination', (req, res) => {
    const data = req.body;

    //parse destination from req object
    let location = data.destination;
    location = location.replace(/\s+/g, '');
    
    let date = data.departure;
    date = new Date(date);
    const tripInSeconds = date.getTime() / 1000;

    fetch(`${geonamesURL}${location}${geonamesParameters}${geonamesUsername}`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            return parseGeonamesData(data);
        })
        .then((geoNamesData) => {
            return getWeatherBitData(geoNamesData, tripInSeconds);
        })
        .then((WeatherBit) => {
            return getPixabayData(WeatherBit, location);
        })
        .then((data) => {
            res.send(data);
        })
        .catch(e => console.log(e));
});
module.exports = app;
