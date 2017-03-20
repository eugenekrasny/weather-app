import React from 'react';
import FormattedDate from './FormattedDate'
import '../css/currentWeather.css'
import 'weather-icons/css/weather-icons.min.css'

class CurrentWeather extends React.Component {
    render() {
        const props = this.props;
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
}

export default CurrentWeather;
