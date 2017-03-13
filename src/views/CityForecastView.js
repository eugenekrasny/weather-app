import React from 'react'
import TodaysWeather from '../components/TodaysWeather'
import DataAdapter from '../utils/DataAdapter'
import axios from 'axios'
import '../css/switch.css'
import '../css/cityForecast.css'

class CityForecastView extends React.Component {

    constructor(props) {
        super(props);
        const params = props.params;
        let coords = null;
        if (params.lon && params.lat) {
            coords = {
                lon: params.lon,
                lat: params.lat
            };
        }
        this.state = {
            cityName: params.cityName,
            coords: coords,
            units: 'imperial'
        };
        this.navigateToCitySelector = this.navigateToCitySelector.bind(this);
        this.onUnitsSwitchChanged = this.onUnitsSwitchChanged.bind(this);
    }

    navigateToCitySelector(e) {
        e.preventDefault();
        this.context.router.push('/');
    }

    onUnitsSwitchChanged(e) {
        this.setState(prevState => ({
            units: prevState.units === 'metric' ? 'imperial' : 'metric'
        }));
    }

    componentWillMount() {
        let apiRoute = null;
        if (this.state.coords) {
            const coords = this.state.coords;
            apiRoute = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + coords.lat + '&lon=' + coords.lon + '&appid=ac4ac652654d00e02b9cbe592d3848ce';
        } else if (this.state.cityName) {
            apiRoute = 'http://api.openweathermap.org/data/2.5/forecast?q=' + this.state.cityName + '&appid=ac4ac652654d00e02b9cbe592d3848ce';
        }
        axios.get(apiRoute)
            .then(response => {
                const adaptedJson = DataAdapter.adaptJSON(response.data);
                this.setState(adaptedJson);
                if (adaptedJson.requestedCity) {
                    localStorage.setItem('lastViewedCity', adaptedJson.requestedCity.name);
                }
                console.log(adaptedJson);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const state = this.state;
        if (!state) {
            return null;
        }

        let cityName = null,
            todaysWeatherComponent = null;

        const requestedCity = state.requestedCity,
            currentWeather = state.currentWeather,
            slicedTodaysForecast = state.slicedTodaysForecast,
            dailyForecast = state.dailyForecast;

        if (requestedCity) {
            cityName = requestedCity.name;
        } else {
            cityName = state.cityName;
        }

        if (currentWeather && slicedTodaysForecast && dailyForecast) {
            todaysWeatherComponent = <TodaysWeather current={currentWeather} sliced={slicedTodaysForecast} daily={dailyForecast} units={state.units} />;
        }

        return <div className="city-forecast">
            <div className="header">
                <i className="button-back material-icons" onClick={this.navigateToCitySelector}>&#xE5C4;</i> <span>{cityName}</span>
            </div>
            <label className="switch">
                <input type="checkbox" onChange={this.onUnitsSwitchChanged} />
                <span className="slider"></span>
                <span className="switch-label"></span>
            </label>
            {todaysWeatherComponent}
        </div>
    }
}

CityForecastView.contextTypes = {
    router: React.PropTypes.object
};

export default CityForecastView;
