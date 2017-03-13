import React from 'react';
import moment from 'moment';
import '../libs/weather-icons/css/weather-icons.min.css'

class TodaysWeather extends React.Component {
    render() {
        const props = this.props;
        if (!props) {
            return null;
        }

        let currentWeather = null,
            dailyForecast = null;

        const currentWeatherObject = props.current,
            units = props.units;
        if (currentWeatherObject) {
            currentWeather = <CurrentWeather weather={currentWeatherObject} slicedForecast={props.sliced} units={units} />;
        }

        const dailyForecastObject = props.daily;
        if (dailyForecastObject) {
            dailyForecast = <DailyForecast forecast={dailyForecastObject} units={units} />;
        }

        return (
            <div>
                {currentWeather}
                {dailyForecast}
            </div>
        );
    }
}

export default TodaysWeather;

function CurrentWeather(props) {
    const weather = props.weather,
        slicedForecast = props.slicedForecast,
        units = props.units;
    if (!weather) {
        return;
    }

    let slicedForecastComponent = null;
    if (slicedForecast) {
        const slicedItems = slicedForecast.reverse().map((wrappedForecast) => {
            return <div className="slice-container" key={wrappedForecast.caption}>
                <div className="slice-caption">{wrappedForecast.caption}</div>
                <div className="slice-temperature">{wrappedForecast.forecast.temp[units]}</div>
            </div>
        });
        slicedForecastComponent = <div className="weather-sliced">{slicedItems}</div>
    }

    return (
        <div className="current-weather">
            <FormattedDate of={weather.date} />
            <div className="weather-conditions">{weather.conditionsDescription}</div>
            <div>
                <div className="weather-description">{weather.temp[units]}  <i className={"weather-icon wi "+ weather.conditionsIcon} /></div>
                {slicedForecastComponent}
            </div>
        </div>
    );
}

function FormattedDate(props) {
    const date = props.of;
    if (!date) {
        return;
    }

    let format = 'dddd, MMMM Do YYYY';
    if (props.format === 'short') {
        format = 'dddd';
    }

    return (
        <div className="formatted-date">{moment.unix(props.of - 1).utc().format(format)}</div>
    );
}

function DailyForecast(props) {
    const forecast = props.forecast,
        units = props.units;
    if (!forecast) {
        return;
    }

    const dailyItems = forecast.map(forecastEntry => {
        return <div key={forecastEntry.date} className="daily-forecast-item">
            <FormattedDate of={forecastEntry.date} format="short" /><br />
            <i className={"weather-icon wi wi-fw " + forecastEntry.conditionsIcon} /><br/>
            <span>{forecastEntry.temp[units]}</span>
        </div>;
    });

    return (
        <div className="daily-forecast-container">{dailyItems}</div>
    );
}
