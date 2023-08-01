export type Units = 'imperial' | 'metric';

export interface DayForecast {
  temp: Record<Units, string>;
  conditionsIcon?: string;
  conditionsDescription?: string;
  date: number;
}

export interface SliceForecast {
  forecast: {
    date: number;
    temp: Record<Units, string>;
  };
  caption: string;
}

export interface WeatherForecast {
  requestedCity: {
    name: string;
  };
  currentWeather: DayForecast;
  slicedTodaysForecast: SliceForecast[];
  dailyForecast: DayForecast[];
}

export interface OpenWeatherMapCity {
  name: string;
}

export interface OpenWeatherMapWeatherEntry {
  description: string;
  icon: string;
}

export interface OpenWeatherMapForecastListEntry {
  dt: number;
  weather: [OpenWeatherMapWeatherEntry];
  main: {
    temp: number;
  };
}

export type OpenWeatherMapForecastList = OpenWeatherMapForecastListEntry[];

export interface OpenWeatherMapForecastResponse {
  list: OpenWeatherMapForecastList;
  city: OpenWeatherMapCity;
}
