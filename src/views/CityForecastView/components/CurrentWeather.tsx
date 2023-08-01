import React from 'react';
import 'weather-icons/css/weather-icons.min.css';

import FormattedDate from '../../../components/FormattedDate';
import { DayForecast, SliceForecast, Units } from '../../../types';
import '../../../css/currentWeather.css';

interface CurrentWeatherProps {
  weather: DayForecast;
  units: Units;
  sliced: SliceForecast[];
}

function CurrentWeather({ weather, sliced, units }: CurrentWeatherProps) {
  return (
    <div className="current-weather">
      <h3 className="current-weather__title">
        <FormattedDate of={weather.date} />
      </h3>
      <h4 className="current-weather__description">
        {weather.conditionsDescription}
      </h4>
      <h1 className="current-weather__conditions">
        {weather.temp[units]}
        <i className={'current-weather__icon wi ' + weather.conditionsIcon} />
      </h1>
      <ul className="current-weather__slices">
        {sliced.map((wrappedForecast) => (
          <li className="current-weather__slice" key={wrappedForecast.caption}>
            <span className="current-weather__slice-caption">{wrappedForecast.caption}</span>
            <span className="current-weather__slice-temperature">
              {wrappedForecast.forecast.temp[units]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CurrentWeather;
