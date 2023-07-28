import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DataLoader from '../utils/DataLoader'
import FormattedDate from '../components/FormattedDate'
import InlineLoader from '../components/InlineLoader'
import '../css/cityForecast.css'
import 'weather-icons/css/weather-icons.min.css'

function CityForecastView(props) {
    const [weather, setWeather] = useState(DataLoader.getLastLoadedData());
    const [units, setUnits] = useState(localStorage.getItem('weatherAppUnits') || 'imperial');

    const { cityName } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        DataLoader.loadWeatherDataByCityName(cityName, (error) => {
            if (error) {
                navigate('/');
            }

            setWeather(DataLoader.getLastLoadedData());
        });
    }, []);

    const navigateToCitySelector = useCallback((e) => {
        e.preventDefault();
        navigate('/');
    }, [navigate]);

    useEffect(() => {
        localStorage.setItem('weatherAppUnits', units);
    }, [units]);

    const onUnitsSwitchChanged = useCallback((e) => {
        setUnits((prevUnits) => prevUnits === 'metric' ? 'imperial' : 'metric');
    }, []);

    let currentWeatherComponent = null,
        dailyForecastComponent = null,
        loaderComponent = null;

    if (weather) {
        currentWeatherComponent = <CurrentWeather weather={weather.currentWeather} sliced={weather.slicedTodaysForecast} units={units} />;
        dailyForecastComponent = <DailyForecast forecast={weather.dailyForecast} units={units} />;
    } else {
        loaderComponent = <InlineLoader />;
    }

    return (
        <div className="city-forecast">
            <CityForecastHeader onBackClickHandler={navigateToCitySelector} cityName={weather?.requestedCity?.name || cityName} />
            <UnitsSwitch onChangeHandler={onUnitsSwitchChanged} checked={units === 'metric'} />
            {loaderComponent}
            {currentWeatherComponent}
            {dailyForecastComponent}
        </div>
    );
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

export default CityForecastView;
