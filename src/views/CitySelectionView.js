import React from 'react'
import DataLoader from '../utils/DataLoader'
import '../css/citySelection.css'

class CitySelectionView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onSearchClick = this.onSearchClick.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.weatherLoadedCallback = this.weatherLoadedCallback.bind(this);
    }

    render() {
        let errorMessageComponent = null;
        if (this.state.errorMessage) {
            errorMessageComponent = <div className="error-message">Error: {this.state.errorMessage}</div>
        }
        //TODO: handle error messages
        return <div className="city-selection">
            <div className="city-search-container">
                <form onSubmit={this.onSearchClick} >
                    <input className="city-search-field" type="text" placeholder="City" ref={(input) => { this.searchField = input; }} maxLength="20" />
                    <button type="submit" className="city-search-button"><i className="material-icons">&#xE8B6;</i></button>
                </form>
            </div>
            <div className="location-selector">
                <span className="or">or</span>
                <span>use my <a href="#" onClick={this.getCurrentLocation}>current position</a></span>
            </div>
            {errorMessageComponent}
        </div>
    }

    onSearchClick(e) {
        e.preventDefault();
        const inputValue = this.searchField.value;
        if (inputValue && 0 < inputValue.length) {
            DataLoader.loadWeatherDataByCityName(inputValue, this.weatherLoadedCallback);
        }
    }

    weatherLoadedCallback(error, result) {
        if (error) {
            return this.setState({
                errorMessage: error || 'Error'
            });
        }
        this.context.router.push('/' + result.requestedCity.name);
    }

    getCurrentLocation() {
        var success = (position) => {
            console.log(position);
            DataLoader.loadWeatherDataByCoords(position.coords, this.weatherLoadedCallback);
        };
        var error = (err) => {
            console.log(err);
            this.setState({
                errorMessage : err.message
            });
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            this.setState({
                errorMessage : 'Sorry, but your position is not available at the moment'
            });
        }
    }
}

CitySelectionView.contextTypes = {
    router: React.PropTypes.object
};

export default CitySelectionView;
