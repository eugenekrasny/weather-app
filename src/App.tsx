import React, { useCallback, useEffect, useState } from 'react';

import CitySelectionView from './views/CitySelectionView';
import CityForecastView from './views/CityForecastView';
import {
  loadWeatherDataByCityName,
  loadWeatherDataByCoords,
  getLastLoadedData,
} from './utils/DataLoader';

function Application() {
  const [weather, setWeather] = useState(getLastLoadedData());

  const resetWeather = useCallback(() => {
    setWeather(undefined);
  }, []);

  const onCitySearchClick = useCallback(async (cityName?: string) => {
    if (cityName) {
      const weatherData = await loadWeatherDataByCityName(cityName);
      setWeather(weatherData);
    }
  }, []);

  const onUseCurrentPositionClick = useCallback(async () => {
    const weatherData = await loadWeatherDataByCoords();
    setWeather(weatherData);
  }, []);

  useEffect(() => {
    onCitySearchClick(weather?.requestedCity?.name);
    // need to run only on mount to get fresh weather data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (weather) {
    return (
      <CityForecastView weather={weather} onBackButtonClick={resetWeather} />
    );
  }

  return (
    <CitySelectionView
      onCitySearchClick={onCitySearchClick}
      onUseCurrentPositionClick={onUseCurrentPositionClick}
    />
  );
}

export default Application;
