import React, { useState, useCallback, useEffect } from 'react';

import { weatherAppUnitsKey } from '../../constants';
import CityForecastHeader from './components/CityForecastHeader';
import UnitsSwitch from './components/UnitsSwitch';
import CurrentWeather from './components/CurrentWeather';
import DailyForecast from './components/DailyForecast';
import { Units, WeatherForecast } from '../../types';
import '../../css/cityForecast.css';

interface CityForecastViewProps {
  weather: WeatherForecast;
  onBackButtonClick: () => void;
}

function CityForecastView({
  weather,
  onBackButtonClick,
}: CityForecastViewProps) {
  const [units, setUnits] = useState<Units>(
    (localStorage.getItem(weatherAppUnitsKey) as Units) || 'imperial',
  );

  useEffect(() => {
    localStorage.setItem(weatherAppUnitsKey, units);
  }, [units]);

  const onUnitsSwitchChanged = useCallback(() => {
    setUnits((prevUnits) => (prevUnits === 'metric' ? 'imperial' : 'metric'));
  }, []);

  return (
    <div className="city-forecast">
      <CityForecastHeader
        onBackClickHandler={onBackButtonClick}
        cityName={weather?.requestedCity?.name}
      />
      <UnitsSwitch
        onChangeHandler={onUnitsSwitchChanged}
        checked={units === 'metric'}
      />
      <CurrentWeather
        weather={weather.currentWeather}
        sliced={weather.slicedTodaysForecast}
        units={units}
      />
      <DailyForecast forecast={weather.dailyForecast} units={units} />
    </div>
  );
}

export default CityForecastView;
