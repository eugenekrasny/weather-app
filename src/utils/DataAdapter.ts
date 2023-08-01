import moment from 'moment';
import {
  DayForecast,
  OpenWeatherMapForecastList,
  OpenWeatherMapForecastListEntry,
  OpenWeatherMapForecastResponse,
  SliceForecast,
  WeatherForecast,
} from '../types';

const adaptJSON = (response: OpenWeatherMapForecastResponse): WeatherForecast => {
  const currentWeather = response.list[0];
  const slicedForecast = filteredSlicedForecast(response.list, currentWeather);
  let dailyForecast = filteredDailyForecast(response.list);
  dailyForecast = extendedDailyForecastWithTodaysForecastIfNeeded(
    dailyForecast,
    slicedForecast[slicedForecast.length - 1],
  );
  dailyForecast = dailyForecastWithMockObjectsIfNeeded(dailyForecast);

  return {
    requestedCity: response.city,
    currentWeather: adaptedCurrentWeather(currentWeather),
    slicedTodaysForecast: adaptedSlicedTodaysForecast(slicedForecast),
    dailyForecast: adaptedDailyForecast(dailyForecast),
  };
};

export default adaptJSON;

const kDaySliceOffsets = {
    morning: 6,
    day: 12,
    evening: 18,
  },
  kDaySliceIndexes = {
    night: 0,
    evening: 1,
    day: 2,
    morning: 3,
  };

function filteredSlicedForecast(
  forecastList: OpenWeatherMapForecastList,
  currentWeather: OpenWeatherMapForecastListEntry,
) {
  const tomorrowsStartOfDay = moment.utc().add(1, 'days').startOf('day').unix();
  const startDate = moment.unix(currentWeather.dt).utc().startOf('day');
  const slicedForecast: OpenWeatherMapForecastList = [];
  forecastList
    .filter((forecastEntry) => {
      return forecastEntry.dt <= tomorrowsStartOfDay;
    })
    .reverse()
    .forEach((forecastEntry, index) => {
      const hoursDiff = moment.unix(forecastEntry.dt).diff(startDate, 'hours');
      if (index === 0) {
        return (slicedForecast[kDaySliceIndexes.night] = forecastEntry);
      }

      if (kDaySliceOffsets.evening <= hoursDiff) {
        return (slicedForecast[kDaySliceIndexes.evening] = forecastEntry);
      }

      if (kDaySliceOffsets.day <= hoursDiff) {
        return (slicedForecast[kDaySliceIndexes.day] = forecastEntry);
      }

      if (kDaySliceOffsets.morning <= hoursDiff) {
        return (slicedForecast[kDaySliceIndexes.morning] = forecastEntry);
      }
    });

  return slicedForecast.filter((value) => {
    return !!value;
  });
}

function filteredDailyForecast(forecastList: OpenWeatherMapForecastList) {
  return forecastList.filter((forecastEntry) => {
    const hourlyForecastDate = moment.unix(forecastEntry.dt).utc();
    const hourlyForecastStartOfDayDate = moment
        .unix(forecastEntry.dt)
        .utc()
        .startOf('day');
    const diffInHours = hourlyForecastDate.diff(
        hourlyForecastStartOfDayDate,
        'hours',
      );
    return kDaySliceOffsets.day === diffInHours;
  });
}

function extendedDailyForecastWithTodaysForecastIfNeeded(
  dailyForecast: OpenWeatherMapForecastList,
  todaysWeather: OpenWeatherMapForecastListEntry,
) {
  const firstEntryInDailyForecast = moment.unix(dailyForecast[0].dt).utc();
  const firstEntryInSlicedForecast = moment.unix(todaysWeather.dt - 1).utc();
  if (firstEntryInSlicedForecast.date() !== firstEntryInDailyForecast.date()) {
    const modifiedDailyForecast = dailyForecast.concat();
    modifiedDailyForecast.splice(0, 0, todaysWeather);
    return modifiedDailyForecast;
  }
  return dailyForecast;
}

function dailyForecastWithMockObjectsIfNeeded(
  dailyForecast: OpenWeatherMapForecastList,
) {
  const numberOfDaysNeededInForecast = 7;
  const daysLeftToAdd = numberOfDaysNeededInForecast - dailyForecast.length;
  if (daysLeftToAdd === 0) {
    return dailyForecast;
  }

  const modifiedForecast = dailyForecast.concat();
  const lastDayInForecast = dailyForecast[dailyForecast.length - 1];
  const secondsInDay = 86400;
  for (let i = 1; i <= daysLeftToAdd; i++) {
    const clonedForecast = { ...lastDayInForecast };
    clonedForecast.dt += i * secondsInDay;
    modifiedForecast.push(clonedForecast);
  }

  return modifiedForecast;
}

function adaptedTemperatureValues(forecast: OpenWeatherMapForecastListEntry) {
  const temp = forecast.main.temp;
  return {
    metric: convertedTemperatureToCelsius(temp),
    imperial: convertedTemperatureToFahrenheit(temp),
  };
}

function convertedTemperatureToCelsius(tempInKelvin: number) {
  return Math.round(tempInKelvin - 273.5) + '°C';
}
function convertedTemperatureToFahrenheit(tempInKelvin: number) {
  return Math.round((tempInKelvin * 9) / 5.0 - 459.67) + '°F';
}

function adaptedCurrentWeather(forecast: OpenWeatherMapForecastListEntry) {
  const adaptedWeather: DayForecast = {
    temp: adaptedTemperatureValues(forecast),
    date: forecast.dt,
  };

  if (forecast.weather && forecast.weather.length > 0) {
    const weatherObject = forecast.weather[0];
    adaptedWeather.conditionsDescription = capitalizedString(
      weatherObject.description,
    );
    adaptedWeather.conditionsIcon = adaptedIconClass(weatherObject.icon);
  }

  return adaptedWeather;
}

function capitalizedString(string: string) {
  let capitalizedString = string;
  capitalizedString =
    capitalizedString.charAt(0).toUpperCase() + capitalizedString.slice(1);

  return capitalizedString;
}

const kDaySliceNames: Record<number, string> = {
  0: 'Night',
  1: 'Evening',
  2: 'Day',
  3: 'Morning',
};

function adaptedSlicedTodaysForecast(
  slicedTodaysForecast: OpenWeatherMapForecastList,
) {
  return slicedTodaysForecast
    .reduce<SliceForecast[]>((newArray, forecast, index) => {
      newArray.push({
        forecast: {
          temp: adaptedTemperatureValues(forecast),
          date: forecast.dt,
        },
        caption: kDaySliceNames[index],
      });
      return newArray;
    }, [])
    .reverse();
}

function adaptedDailyForecast(dailyForecast: OpenWeatherMapForecastList) {
  const adaptedDailyForecast: DayForecast[] = [];
  dailyForecast.forEach((forecast) => {
    const day: DayForecast = {
      date: forecast.dt,
      temp: adaptedTemperatureValues(forecast),
    };
    if (forecast.weather && forecast.weather.length > 0) {
      const weather = forecast.weather[0];
      day.conditionsIcon = adaptedIconClass(weather.icon, true);
      day.conditionsDescription = capitalizedString(weather.description);
    }
    adaptedDailyForecast.push(day);
  });

  return adaptedDailyForecast;
}

function adaptedIconClass(iconCode: string, isNeutral?: boolean) {
  let iconClass = 'wi';
  if (!isNeutral) {
    if (iconCode.search('d') !== -1) {
      iconClass += '-day';
    } else if (iconCode.search('n') !== -1) {
      iconClass += '-night';
    }
  }
  const neutralIconCode = iconCode.substr(0, iconCode.length - 1);
  let condition;
  switch (neutralIconCode) {
    case '01':
      condition = '-clear';
      break;
    case '02':
    case '03':
    case '04':
      condition = '-cloudy';
      break;
    case '09':
      condition = '-showers';
      break;
    case '10':
      condition = '-rain';
      break;
    case '11':
      condition = '-thunderstorm';
      break;
    case '13':
      condition = '-snow';
      break;
    case '50':
      condition = '-fog';
      break;
    default:
      condition = '';
      break;
  }
  iconClass += condition;
  return iconClass;
}
