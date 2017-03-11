import React from 'react'
import moment from 'moment'

class CityForecastView extends React.Component {

    constructor(props) {
        super(props);
        const params = props.params;
        let coords = null;
        if (params.lon && params.lat) {
            coords = {
                lon: params.lon,
                lat: params.lat
            };
        }
        this.state = {
            cityName: params.cityName,
            coords: coords
        };
        this.navigateToCitySelector = this.navigateToCitySelector.bind(this);
    }

    navigateToCitySelector(e) {
        e.preventDefault();
        this.context.router.push('/');
    }

    componentWillMount() {
        let apiRoute = null;
        if (this.state.coords) {
            const coords = this.state.coords;
            apiRoute = '/forecast?lat=' + coords.lat + '&lon=' + coords.lon + '&appid=ac4ac652654d00e02b9cbe592d3848ce';
        } else if (this.state.cityName) {
            apiRoute = '/forecast?q=' + this.state.cityName + '&appid=ac4ac652654d00e02b9cbe592d3848ce';
        }
        fetch(apiRoute)
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (200 === parseInt(json.cod, 10)) {
                    const todaysEndOfDay = moment.utc().endOf('day').unix();
                    json.list = json.list.filter(hourlyForecast => {
                        const hourlyForecastDate = moment.unix(hourlyForecast.dt).utc();
                        const hourlyForecastStartOfDayDate = moment.unix(hourlyForecast.dt).utc().startOf('day');
                        const diffInHours = hourlyForecastDate.diff(hourlyForecastStartOfDayDate, 'hours');

                        return hourlyForecast.dt < todaysEndOfDay || (hourlyForecast.dt > todaysEndOfDay && 12 === diffInHours);
                    });
                    json.cnt = json.list.length;
                    this.setState({
                        forecast: json
                    });
                } else {
                    this.setState({
                        forecastError: json
                    });
                }
                console.log(json);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        let cityName = null;
        if (this.state && this.state.forecast) {
            const forecast = this.state.forecast;
            cityName = forecast.city.name;
        } else {
            cityName = this.state.cityName;
        }
        return <div>
            <button type="button" onClick={this.navigateToCitySelector}>Back</button> <span>{cityName}</span>
        </div>
    }
}

CityForecastView.contextTypes = {
    router: React.PropTypes.object
};

export default CityForecastView;
