import axios from 'axios';
import adaptJSON from './DataAdapter';
import {
  apiInfoToken,
  lastLoadedWeatherKey,
  openWeatherMapAppId,
} from '../constants';
import { WeatherForecast } from '../types';

export function getLastLoadedData(): WeatherForecast | undefined {
  const weather = localStorage.getItem(lastLoadedWeatherKey);
  try {
    if (weather) {
      const weatherData = JSON.parse(weather);
      return weatherData;
    }
  } catch {
    return undefined;
  }
}

export function loadWeatherDataByCityName(cityName: string) {
  return loadWeatherData(`q=${cityName}`);
}

export async function loadWeatherDataByCoords() {
  const fallbackApi = async () => {
    const response = await axios(`https://ipinfo.io?token=${apiInfoToken}`);
    const city = response.data.city;
    if (!city) {
      throw new Error("Can't get location. Please use search.");
    }
    const weatherData = await loadWeatherDataByCityName(city);
    return weatherData;
  };

  if (!navigator.geolocation) {
    return fallbackApi();
  }

  return new Promise<WeatherForecast>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const weatherData = await loadWeatherData(
            `lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          resolve(weatherData);
        } catch (error) {
          reject(error);
        }
      },
      async () => {
        try {
          resolve(fallbackApi());
        } catch (error) {
          reject(error);
        }
      },
      {
        maximumAge: 30 * 60 * 1000,
        timeout: 2 * 1000,
      },
    );
  });
}

async function loadWeatherData(queryString: string) {
  const response = await axios.get(
    `?${queryString}&appid=${openWeatherMapAppId}`,
    {
      baseURL: 'http://api.openweathermap.org/data/2.5/forecast/',
    },
  );
  const responseData = response.data;
  if (parseInt(responseData.cod, 10) !== 200) {
    throw responseData.message || responseData;
  }

  const adaptedJson = adaptJSON(response.data);
  localStorage.setItem(lastLoadedWeatherKey, JSON.stringify(adaptedJson));
  return adaptedJson;
}
