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
                <FormattedDate of={weather.date} />
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

export default CurrentWeather;
