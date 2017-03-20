import React from 'react'
import DataLoader from '../utils/DataLoader'
import axios from 'axios'
import InlineLoader from '../components/InlineLoader'
import '../css/citySelection.css'

class CitySelectionView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: false};
        this.onSearchClick = this.onSearchClick.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.weatherLoadedCallback = this.weatherLoadedCallback.bind(this);
    }

    render() {
        if (this.state.isLoading) {
            return <InlineLoader />;
        }

        let errorMessageComponent = null;
        if (this.state.errorMessage) {
            errorMessageComponent = <h4 className="error-message">Error: {this.state.errorMessage}</h4>
        }
        return <div className="city-selection">
            <form className="city-search" onSubmit={this.onSearchClick} >
                <input className="city-search-field" type="text" placeholder="City" ref={(input) => { this.searchField = input; }} maxLength="20" />
                <button type="submit" className="city-search-button"><i className="material-icons">&#xE8B6;</i></button>
            </form>
            <p className="or-caption">or</p>
            <p>use my <span className="use-current-position" onClick={this.getCurrentLocation}>current position</span></p>
            {errorMessageComponent}
        </div>
    }

    onSearchClick(e) {
        e.preventDefault();
        const inputValue = this.searchField.value;
        if (inputValue && 0 < inputValue.length) {
            this.setState({
                isLoading: true
            }, () => {
                DataLoader.loadWeatherDataByCityName(inputValue, this.weatherLoadedCallback);
            });
        }
    }

    weatherLoadedCallback(error, result) {
        if (error) {
            return this.setState({
                isLoading: false,
                errorMessage: error || 'Error'
            });
        }
        this.context.router.push('/' + result.requestedCity.name);
    }

    getCurrentLocation() {
        var errorFunc = (err) => {
            this.setState({
                isLoading: false,
                errorMessage : err.message || err.toString()
            });
        };

        var success = (position) => {
            DataLoader.loadWeatherDataByCoords(position.coords, this.weatherLoadedCallback);
        };
        var error = (err) => {
            // fallback to different service first
            axios("https://ipinfo.io")
                .then(response => {
                    const city = response.data.city;
                    if (!city) {
                        return errorFunc({message: "Can't get location. Please use search."});
                    }
                    DataLoader.loadWeatherDataByCityName(city, this.weatherLoadedCallback);
                })
                .catch(errorFunc);
        };

        if (!navigator.geolocation) {
            return errorFunc({message: 'Sorry, but your position is not available at the moment'});
        }
        this.setState({
            isLoading: true
        }, () => {
            navigator.geolocation.getCurrentPosition(success, error, {
                maximumAge: 30 * 60 * 1000,
                timeout: 2 * 1000
            });
        });
    }
}

CitySelectionView.contextTypes = {
    router: React.PropTypes.object
};

export default CitySelectionView;
