import DataAdapter from '../utils/DataAdapter'
import axios from 'axios'

class DataLoader {
    static getLastLoadedData() {
        const lastData = DataLoader.lastLoadedData;
        DataLoader.lastLoadedData = null;
        return lastData;
    }

    static loadWeatherDataByCoords(coords, callback) {
        loadWeatherData('lat=' + coords.latitude + '&lon=' + coords.longitude, callback);
    }

    static loadWeatherDataByCityName(cityName, callback) {
        loadWeatherData('q=' + cityName, callback);
    }
}

export default DataLoader;

DataLoader.lastLoadedData = null;

function loadWeatherData(queryString, callback) {
    const apiRoute = 'http://api.openweathermap.org/data/2.5/forecast?' + queryString + '&appid=ac4ac652654d00e02b9cbe592d3848ce';
    axios.get(apiRoute)
        .then(response => {
            const responseData = response.data;
            console.log(responseData);
            if (200 !== parseInt(responseData.cod, 10)) {
                DataLoader.lastLoadedData = null;
                return callback(responseData.message || responseData);
            }

            const adaptedJson = DataAdapter.adaptJSON(response.data);
            localStorage.setItem('lastViewedCity', adaptedJson.requestedCity.name);
            DataLoader.lastLoadedData = adaptedJson;
            callback(null, adaptedJson);
            console.log(adaptedJson);
        })
        .catch(error => {
            callback(error.message || error);
            DataLoader.lastLoadedData = null;
            console.log(error);
        })

}
