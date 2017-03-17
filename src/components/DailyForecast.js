import React from 'react';
import FormattedDate from './FormattedDate'
import '../css/dailyForecast.css'
import 'weather-icons/css/weather-icons.min.css'

class DailyForecast extends React.Component {
    render() {
        const props = this.props;
        if (!props) {
            return;
        }
        const forecast = props.forecast,
            units = props.units;
        if (!forecast) {
            return;
        }

        const dailyItems = forecast.map(forecastEntry => {
            return <li key={forecastEntry.date}>
                <FormattedDate of={forecastEntry.date} format="short"/>
                <span title={forecastEntry.conditionsDescription}
                     className={"weather-icon wi wi-fw " + forecastEntry.conditionsIcon} />
                <span>{forecastEntry.temp[units]}</span>
            </li>;
        });

        return (
            <ul className="daily-forecast">{dailyItems}</ul>
        );
    }
}

export default DailyForecast;
