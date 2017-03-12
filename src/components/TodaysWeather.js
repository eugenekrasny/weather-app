import React from 'react';
import moment from 'moment';
import '../libs/weather-icons/css/weather-icons.min.css'
import '../css/dailyForecast.css'

class TodaysWeather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slicedForecast: props.sliced,
            currentWeather: props.current,
            dailyForecast: props.daily
        }
    }
    render() {
        if (!this.state) {
            return null;
        }

        let currentWeather = null,
            hourlyDetails = null,
            dailyForecast = null;

        const currentWeatherObject = this.state.currentWeather;
        if (currentWeatherObject) {
            currentWeather = <CurrentWeather weather={currentWeatherObject} />;
        }

        const slicedForecast = this.state.slicedForecast;
        if (slicedForecast) {
            hourlyDetails = <HourlyDetails of={slicedForecast} />;
        }

        const dailyForecastObject = this.state.dailyForecast;
        if (dailyForecastObject) {
            dailyForecast = <DailyForecast forecast={dailyForecastObject} />;
        }

        return (
            <div>
                {currentWeather}
                {hourlyDetails}
                {dailyForecast}
            </div>
        );
    }
}

export default TodaysWeather;

function CurrentWeather(props) {
    const weather = props.weather;
    if (!weather) {
        return;
    }

    return (
        <div>
            <div><FormattedDate of={weather.date} /></div>
            <div>{weather.conditionsDescription}</div>
            <div>{weather.temp.metric}  <i className={weather.conditionsIcon} /></div>
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
        <span>{moment.unix(props.of - 1).utc().format(format)}</span>
    );
}

function HourlyDetails(props) {
    const slicedForecast = props.of;
    if (!slicedForecast) {
        return;
    }

    const hourlyItems = slicedForecast.reverse().map((wrappedForecast) => {
        return <div key={wrappedForecast.caption}>{wrappedForecast.forecast.dt_txt} - {wrappedForecast.caption} {wrappedForecast.forecast.temp.metric}</div>
    });

    return (
        <div>{hourlyItems}</div>
    );
}

function DailyForecast(props) {
    const forecast = props.forecast;
    if (!forecast) {
        return;
    }

    const dailyItems = forecast.map(forecastEntry => {
        return <div key={forecastEntry.date} className="daily-forecast-item">
            <FormattedDate of={forecastEntry.date} format="short" /><br />
            <i className={forecastEntry.conditionsIcon} /><br/>
            <span>{forecastEntry.temp.metric}</span>
        </div>;
    });

    return (
        <div className="daily-forecast-container">{dailyItems}</div>
    );
}
