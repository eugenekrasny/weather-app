import React from 'react'
import CityForecastHeader from '../components/CityForecastHeader'
import UnitsSwitch from '../components/UnitsSwitch'
import CurrentWeather from '../components/CurrentWeather'
import DailyForecast from '../components/DailyForecast'
import DataLoader from '../utils/DataLoader'

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

        const weather = state.weather,
            requestedCity = weather.requestedCity,
            currentWeather = weather.currentWeather,
            slicedTodaysForecast = weather.slicedTodaysForecast,
            dailyForecast = weather.dailyForecast,
            units = state.units;

        let cityName = state.cityName;
        if (requestedCity) {
            cityName = requestedCity.name;
        }

        return <div className="city-forecast">
            <CityForecastHeader onBackClickHandler={this.navigateToCitySelector} cityName={cityName} />
            <UnitsSwitch onChangeHandler={this.onUnitsSwitchChanged} checked={(units === 'metric') ? 'true' : ''} />
            <CurrentWeather weather={currentWeather} sliced={slicedTodaysForecast} units={units} />
            <DailyForecast forecast={dailyForecast} units={units} />
        </div>
    }
}

CityForecastView.contextTypes = {
    router: React.PropTypes.object
};

export default CityForecastView;
