import React from 'react'
import DataLoader from '../utils/DataLoader'
import FormattedDate from '../components/FormattedDate'
import '../css/cityForecast.css'
import 'weather-icons/css/weather-icons.min.css'

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

function CityForecastHeader(props) {
    return <h2 className="header">
        <button type="button" className="button-back" onClick={props.onBackClickHandler}><i className="material-icons">&#xE5C4;</i></button> {props.cityName}
    </h2>
}

function UnitsSwitch(props) {
    return <label className="switch">
        <input type="checkbox" onChange={props.onChangeHandler} checked={props.checked} />
        <span className="slider"></span>
        <span className="switch-label"></span>
    </label>
}

function CurrentWeather(props) {
    if (!props) {
        return;
    }

    const weather = props.weather,
        slicedForecast = props.sliced,
        units = props.units;

    let slicedForecastComponent = null;
    if (slicedForecast) {
        const slicedItems = slicedForecast.map((wrappedForecast) => {
            return <li key={wrappedForecast.caption}>
                <span className="slice-caption">{wrappedForecast.caption}</span>
                <span className="slice-temperature">{wrappedForecast.forecast.temp[units]}</span>
            </li>
        });
        slicedForecastComponent = <ul className="weather-sliced">{slicedItems}</ul>
    }

    return (
        <div className="current-weather">
            <h3><FormattedDate of={weather.date} /></h3>
            <h4>{weather.conditionsDescription}</h4>
            <h1 className="weather-description">{weather.temp[units]}<i className={"weather-icon wi "+ weather.conditionsIcon}/></h1>
            {slicedForecastComponent}
        </div>
    );
}

function DailyForecast(props) {
    if (!props) {
        return;
    }

    const forecast = props.forecast,
        units = props.units;

    let dailyItems = null;
    if (forecast) {
        dailyItems = forecast.map(forecastEntry => {
            return <li key={forecastEntry.date}>
                <FormattedDate of={forecastEntry.date} format="short"/>
                <span title={forecastEntry.conditionsDescription}
                      className={"weather-icon wi wi-fw " + forecastEntry.conditionsIcon}/>
                <span>{forecastEntry.temp[units]}</span>
            </li>;
        });
    }

    return (
        <ul className="daily-forecast">{dailyItems}</ul>
    );
}

CityForecastView.contextTypes = {
    router: React.PropTypes.object
};

export default CityForecastView;
