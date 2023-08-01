import React from 'react';
import 'weather-icons/css/weather-icons.min.css';

import FormattedDate from '../../../components/FormattedDate';
import { DayForecast, Units } from '../../../types';
import '../../../css/dailyForecast.css';

interface DailyForecastProps {
  forecast: DayForecast[];
  units: Units;
}

function DailyForecast({ forecast, units }: DailyForecastProps) {
  return (
    <ul className="daily-forecast">
      {forecast.map((forecastEntry) => (
        <li className="daily-forecast__item" key={forecastEntry.date}>
          <FormattedDate of={forecastEntry.date} format="short" />
          <span
            title={forecastEntry.conditionsDescription}
            className={'daily-forecast__item-icon wi wi-fw ' + forecastEntry.conditionsIcon}
          />
          <span>{forecastEntry.temp[units]}</span>
        </li>
      ))}
    </ul>
  );
}

export default DailyForecast;
