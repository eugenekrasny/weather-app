import moment from 'moment'

class DataAdapter {}

DataAdapter.adaptJSON = (json) => {
    if (200 !== parseInt(json.cod, 10)) {
        return { forecastError: json };
    }

    const currentWeather = json.list[0],
        slicedForecast = filteredSlicedForecast(json.list, currentWeather);
    let dailyForecast = filteredDailyForecast(json.list);
    dailyForecast = extendedDailyForecastWithTodaysForecastIfNeeded(dailyForecast,
        slicedForecast[slicedForecast.length - 1]);

    return {
        requestedCity: json.city,
        currentWeather: adaptedCurrentWeather(currentWeather),
        slicedTodaysForecast: adaptedSlicedTodaysForecast(slicedForecast),
        dailyForecast: adaptedDailyForecast(dailyForecast)
    };
};

export default DataAdapter;

const kDaySliceOffsets = {
        morning: 6,
        day: 12,
        evening: 18,
        night: 24
    },
    kDaySliceIndexes = {
        night: 0,
        evening: 1,
        day: 2,
        morning: 3
    };

function filteredSlicedForecast(json, currentWeather) {
    const tomorrowsStartOfDay = moment.utc().add(1,'days').startOf('day').unix(),
        startDate = moment.unix(currentWeather.dt).utc().startOf('day'),
        slicedForecast = [null, null, null, null];
    json.filter(forecastEntry => {
        return forecastEntry.dt <= tomorrowsStartOfDay;
    }).reverse().forEach((forecastEntry, index) => {
        const hoursDiff = moment.unix(forecastEntry.dt).diff(startDate, 'hours');
        if (kDaySliceOffsets.night <= hoursDiff) {
            return slicedForecast[kDaySliceIndexes.night] = forecastEntry;
        }

        if (kDaySliceOffsets.evening <= hoursDiff) {
            return slicedForecast[kDaySliceIndexes.evening] = forecastEntry;
        }

        if (kDaySliceOffsets.day <= hoursDiff) {
            return slicedForecast[kDaySliceIndexes.day] = forecastEntry;
        }

        if (kDaySliceOffsets.morning <= hoursDiff) {
            return slicedForecast[kDaySliceIndexes.morning] = forecastEntry;
        }
    });

    return slicedForecast.filter(value => {
        return !!value;
    });
}

function filteredDailyForecast(json) {
    return json.filter(forecastEntry => {
        const hourlyForecastDate = moment.unix(forecastEntry.dt).utc(),
            hourlyForecastStartOfDayDate = moment.unix(forecastEntry.dt).utc().startOf('day'),
            diffInHours = hourlyForecastDate.diff(hourlyForecastStartOfDayDate, 'hours');
        return kDaySliceOffsets.day === diffInHours;
    });
}

function extendedDailyForecastWithTodaysForecastIfNeeded(dailyForecast, todaysWeather) {
    const firstEntryInDailyForecast = moment.unix(dailyForecast[0].dt).utc(),
        firstEntryInSlicedForecast = moment.unix(todaysWeather.dt).utc();
    if (firstEntryInSlicedForecast.date() !== firstEntryInDailyForecast.date()) {
        const modifiedDailyForecast = dailyForecast.slice();
        modifiedDailyForecast.splice(0, 0, todaysWeather);
        return modifiedDailyForecast;
    }
    return dailyForecast;
}

function adaptedTemperatureValues(forecast) {
    const temp = forecast.main.temp;
    return {
        metric: convertedTemperatureToCelsius(temp),
        imperial: convertedTemperatureToFahrenheit(temp)
    };
}

function convertedTemperatureToCelsius(tempInKelvin) {
    return Math.round(tempInKelvin - 273.5) + '\u2103';
}
function convertedTemperatureToFahrenheit(tempInKelvin) {
    return Math.round(tempInKelvin * 9/5.0 - 459.67) + '\u2109';
}

function adaptedCurrentWeather(forecast) {
    const adaptedWeather = {
        temp: adaptedTemperatureValues(forecast),
        date: forecast.dt,
        dt_txt: forecast.dt_txt
    };

    if (forecast.weather && forecast.weather.length > 0) {
        const weatherObject = forecast.weather[0];
        let conditionDescription = weatherObject.description;
        conditionDescription = conditionDescription.charAt(0).toUpperCase() + conditionDescription.slice(1)
        adaptedWeather.conditionsDescription = conditionDescription;
        adaptedWeather.conditionsIcon = adaptedIconClass(weatherObject.icon);
    }

    return adaptedWeather;
}

const kDaySliceNames = {
    '0': 'Night',
    '1': 'Evening',
    '2': 'Day',
    '3': 'Morning'
};

function adaptedSlicedTodaysForecast(slicedTodaysForecast) {
    return slicedTodaysForecast.reduce((newArray, forecast, index) => {
        newArray.push({
            forecast: {
                temp: adaptedTemperatureValues(forecast),
                date: forecast.dt,
                dt_txt: forecast.dt_txt
            },
            caption: kDaySliceNames[index]
        });
        return newArray;
    }, []);
}

function adaptedDailyForecast(dailyForecast) {
    const adaptedDailyForecast = [];
    dailyForecast.forEach(forecast => {
        let conditionsIcon = null;
        if (forecast.weather && forecast.weather.length > 0) {
            conditionsIcon = adaptedIconClass(forecast.weather[0].icon, true);
        }
        adaptedDailyForecast.push({
            temp: adaptedTemperatureValues(forecast),
            conditionsIcon: conditionsIcon,
            date: forecast.dt,
            dt_txt: forecast.dt_txt
        });
    });

    return adaptedDailyForecast;
}

function adaptedIconClass(iconCode, isNeutral) {
    let iconClass = 'wi';
    if (!isNeutral) {
        if (-1 !== iconCode.search('d')) {
            iconClass += '-day'
        } else if (-1 !== iconCode.search('n')) {
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
