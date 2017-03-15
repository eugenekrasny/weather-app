import React from 'react';
import FormattedDate from './FormattedDate'
import '../css/dailyForecast.css'

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

export default DailyForecast;