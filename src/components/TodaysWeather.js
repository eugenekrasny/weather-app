import React from 'react';
import moment from 'moment';
import '../libs/weather-icons/css/weather-icons.min.css'

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
            dailyForecast = null;

        const currentWeatherObject = this.state.currentWeather;
        const slicedForecast = this.state.slicedForecast;
        if (currentWeatherObject) {
            currentWeather = <CurrentWeather weather={currentWeatherObject} slicedForecast={slicedForecast} />;
        }

        const dailyForecastObject = this.state.dailyForecast;
        if (dailyForecastObject) {
            dailyForecast = <DailyForecast forecast={dailyForecastObject} />;
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
        slicedForecast = props.slicedForecast;
    if (!weather) {
        return;
    }

    let slicedForecastComponent = null;
    if (slicedForecast) {
        const slicedItems = slicedForecast.reverse().map((wrappedForecast) => {
            return <div className="slice-container" key={wrappedForecast.caption}>
                <div className="slice-caption">{wrappedForecast.caption}</div>
                <div className="slice-temperature">{wrappedForecast.forecast.temp.metric}</div>
            </div>
        });
        slicedForecastComponent = <div className="weather-sliced">{slicedItems}</div>
    }

    return (
        <div className="current-weather">
            <FormattedDate of={weather.date} />
            <div className="weather-conditions">{weather.conditionsDescription}</div>
            <div>
                <div className="weather-description">{weather.temp.metric}  <i className={"weather-icon wi "+ weather.conditionsIcon} /></div>
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
    const forecast = props.forecast;
    if (!forecast) {
        return;
    }

    const dailyItems = forecast.map(forecastEntry => {
        return <div key={forecastEntry.date} className="daily-forecast-item">
            <FormattedDate of={forecastEntry.date} format="short" /><br />
            <i className={"weather-icon wi wi-fw " + forecastEntry.conditionsIcon} /><br/>
            <span>{forecastEntry.temp.metric}</span>
        </div>;
    });

    return (
        <div className="daily-forecast-container">{dailyItems}</div>
    );
}
