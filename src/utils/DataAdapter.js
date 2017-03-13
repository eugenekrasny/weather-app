import moment from 'moment'

class DataAdapter {

    static adaptJSON(json) {
        if (!json.list || 0 >= json.list.length) {
            return {forecastError: json};
        }

        const currentWeather = json.list[0],
            slicedForecast = filteredSlicedForecast(json.list, currentWeather);
        let dailyForecast = filteredDailyForecast(json.list);
        dailyForecast = extendedDailyForecastWithTodaysForecastIfNeeded(dailyForecast,
            slicedForecast[slicedForecast.length - 1]);
        dailyForecast = dailyForecastWithMockObjectsIfNeeded(dailyForecast);

        return {
            requestedCity: json.city,
            currentWeather: adaptedCurrentWeather(currentWeather),
            slicedTodaysForecast: adaptedSlicedTodaysForecast(slicedForecast),
            dailyForecast: adaptedDailyForecast(dailyForecast)
        };
    }
}

export default DataAdapter;

const kDaySliceOffsets = {
        morning: 6,
        day: 12,
        evening: 18
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
        if (0 === index) {
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
        firstEntryInSlicedForecast = moment.unix(todaysWeather.dt - 1).utc();
    if (firstEntryInSlicedForecast.date() !== firstEntryInDailyForecast.date()) {
        const modifiedDailyForecast = dailyForecast.concat();
        modifiedDailyForecast.splice(0, 0, todaysWeather);
        return modifiedDailyForecast;
    }
    return dailyForecast;
}

function dailyForecastWithMockObjectsIfNeeded(dailyForecast) {
    const numberOfDaysNeededInForecast = 7,
        daysLeftToAdd = numberOfDaysNeededInForecast - dailyForecast.length;
    if (0 === daysLeftToAdd) {
        return dailyForecast;
    }

    const modifiedForecast = dailyForecast.concat(),
        lastDayInForecast = dailyForecast[dailyForecast.length - 1],
        secondsInDay = 86400;
    for (let i = 1; i <= daysLeftToAdd; i++) {
        const clonedForecast = Object.assign({}, lastDayInForecast);
        clonedForecast.dt += i * secondsInDay;
        modifiedForecast.push(clonedForecast);
    }

    return modifiedForecast;
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
        date: forecast.dt
    };

    if (forecast.weather && forecast.weather.length > 0) {
        const weatherObject = forecast.weather[0];
        adaptedWeather.conditionsDescription = capitalizedString(weatherObject.description);
        adaptedWeather.conditionsIcon = adaptedIconClass(weatherObject.icon);
    }

    return adaptedWeather;
}

function capitalizedString(string) {
    let capitalizedString = string;
    capitalizedString = capitalizedString.charAt(0).toUpperCase() + capitalizedString.slice(1);

    return capitalizedString;
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
                date: forecast.dt
            },
            caption: kDaySliceNames[index]
        });
        return newArray;
    }, []).reverse();
}

function adaptedDailyForecast(dailyForecast) {
    const adaptedDailyForecast = [];
    dailyForecast.forEach(forecast => {
        let conditionsIcon = null,
            conditionsDescription = null;
        if (forecast.weather && forecast.weather.length > 0) {
            const weather = forecast.weather[0];
            conditionsIcon = adaptedIconClass(weather.icon, true);
            conditionsDescription = capitalizedString(weather.description);
        }
        adaptedDailyForecast.push({
            temp: adaptedTemperatureValues(forecast),
            conditionsIcon: conditionsIcon,
            conditionsDescription: conditionsDescription,
            date: forecast.dt
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
