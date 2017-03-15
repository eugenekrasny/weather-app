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

class CurrentWeather extends React.Component {
    render() {
        const weather = this.props.weather,
            slicedForecast = this.props.slicedForecast,
            units = this.props.units;
        if (!weather) {
            return;
        }

        let slicedForecastComponent = null;
        if (slicedForecast) {
            const slicedItems = slicedForecast.map((wrappedForecast) => {
                return <div className="slice-container" key={wrappedForecast.caption}>
                    <div className="slice-caption">{wrappedForecast.caption}</div>
                    <div className="slice-temperature">{wrappedForecast.forecast.temp[units]}</div>
                </div>
            });
            slicedForecastComponent = <div className="weather-sliced">{slicedItems}</div>
        }

        return (
            <div className="current-weather">
                <FormattedDate of={weather.date}/>
                <div className="weather-conditions">{weather.conditionsDescription}</div>
                <div>
                    <div className="weather-description">{weather.temp[units]}<i
                        className={"weather-icon wi "+ weather.conditionsIcon}/></div>
                    {slicedForecastComponent}
                </div>
            </div>
        );
    }
}

class FormattedDate extends React.Component {
    render() {
        const date = this.props.of;
        if (!date) {
            return;
        }

        let format = 'dddd, MMMM Do YYYY';
        if (this.props.format === 'short') {
            format = 'dddd';
        }

        return (
            <div className="formatted-date">{moment.unix(date - 1).utc().format(format)}</div>
        );
    }
}

class DailyForecast extends React.Component {
    render() {
        const forecast = this.props.forecast,
            units = this.props.units;
        if (!forecast) {
            return;
        }

        const dailyItems = forecast.map(forecastEntry => {
            return <div key={forecastEntry.date} className="daily-forecast-item">
                <FormattedDate of={forecastEntry.date} format="short"/>
                <div title={forecastEntry.conditionsDescription}
                     className={"weather-icon wi wi-fw " + forecastEntry.conditionsIcon}></div>
                <div>{forecastEntry.temp[units]}</div>
            </div>;
        });

        return (
            <div className="daily-forecast-container">{dailyItems}</div>
        );
    }
}
