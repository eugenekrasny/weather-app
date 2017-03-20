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
        if (!state) {
            return null;
        }

        const weather = state.weather,
            units = state.units;

        let currentWeatherComponent = null,
            dailyForecastComponent = null;

        let cityName = state.cityName;
        if (weather) {
            currentWeatherComponent = <CurrentWeather weather={weather.currentWeather} sliced={weather.slicedTodaysForecast} units={units} />;
            dailyForecastComponent = <DailyForecast forecast={weather.dailyForecast} units={units} />;
            cityName = weather.requestedCity ? weather.requestedCity.name : cityName;
        }

        return <div className="city-forecast">
            <CityForecastHeader onBackClickHandler={this.navigateToCitySelector} cityName={cityName} />
            <UnitsSwitch onChangeHandler={this.onUnitsSwitchChanged} checked={(units === 'metric') ? 'true' : ''} />
            {currentWeatherComponent}
            {dailyForecastComponent}
        </div>
    }
}

CityForecastView.contextTypes = {
    router: React.PropTypes.object
};

export default CityForecastView;
