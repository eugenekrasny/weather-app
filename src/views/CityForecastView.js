import React from 'react'
import TodaysWeather from '../components/TodaysWeather'
import DataLoader from '../utils/DataLoader'
import '../css/switch.css'
import '../css/cityForecast.css'

class CityForecastView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            weather: DataLoader.getLastLoadedData(),
            cityName: props.params.cityName,
            units: localStorage.getItem('weatherAppUnits') || 'imperial'
        };
        this.navigateToCitySelector = this.navigateToCitySelector.bind(this);
        this.onUnitsSwitchChanged = this.onUnitsSwitchChanged.bind(this);
    }

    navigateToCitySelector(e) {
        e.preventDefault();
        this.context.router.push('/');
    }

    onUnitsSwitchChanged(e) {
        const units = this.state.units === 'metric' ? 'imperial' : 'metric';
        localStorage.setItem('weatherAppUnits', units);

        this.setState({
            units: units
        });
    }

    componentWillMount() {
        if (!this.state.weather) {
            DataLoader.loadWeatherDataByCityName(this.state.cityName, (error) => {
                if (error) {
                    this.context.router.push('/');
                }

                this.setState({
                    weather: DataLoader.getLastLoadedData()
                })
            });
        }
    }

    render() {
        const state = this.state;
        if (!state || !state.weather) {
            return null;
        }

        const weather = state.weather;

        let cityName = null,
            todaysWeatherComponent = null;

        const requestedCity = weather.requestedCity,
            currentWeather = weather.currentWeather,
            slicedTodaysForecast = weather.slicedTodaysForecast,
            dailyForecast = weather.dailyForecast,
            units = state.units;

        if (requestedCity) {
            cityName = requestedCity.name;
        } else {
            cityName = state.cityName;
        }

        if (currentWeather && slicedTodaysForecast && dailyForecast) {
            todaysWeatherComponent = <TodaysWeather current={currentWeather} sliced={slicedTodaysForecast} daily={dailyForecast} units={units} />;
        }

        return <div className="city-forecast">
            <div className="header">
                <i className="button-back material-icons" onClick={this.navigateToCitySelector}>&#xE5C4;</i> <span>{cityName}</span>
            </div>
            <label className="switch">
                <input type="checkbox" onChange={this.onUnitsSwitchChanged} checked={(units === 'metric') ? 'true' : ''} />
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
