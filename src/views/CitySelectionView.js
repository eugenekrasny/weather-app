import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DataLoader from '../utils/DataLoader';
import axios from 'axios';
import InlineLoader from '../components/InlineLoader';
import '../css/citySelection.css';

function CitySelectionView() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const inputRef = useRef();

  const navigate = useNavigate();

  const weatherLoadedCallback = useCallback(
    (error, result) => {
      if (error) {
        setIsLoading(false);
        setErrorMessage(error || 'Error');
        return;
      }
      navigate('/' + result.requestedCity.name);
    },
    [navigate],
  );

  const onSearchClick = useCallback((e) => {
    e.preventDefault();
    const inputValue = inputRef.current?.value;
    if (inputValue && 0 < inputValue.length) {
      setIsLoading(true);
      DataLoader.loadWeatherDataByCityName(inputValue, weatherLoadedCallback);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    var errorFunc = (err) => {
      setIsLoading(false);
      setErrorMessage(err.message || err.toString());
    };

    var success = (position) => {
      DataLoader.loadWeatherDataByCoords(
        position.coords,
        weatherLoadedCallback,
      );
    };
    var error = (err) => {
      // fallback to different service first
      axios('https://ipinfo.io')
        .then((response) => {
          const city = response.data.city;
          if (!city) {
            return errorFunc({
              message: "Can't get location. Please use search.",
            });
          }
          DataLoader.loadWeatherDataByCityName(city, weatherLoadedCallback);
        })
        .catch(errorFunc);
    };

    if (!navigator.geolocation) {
      return errorFunc({
        message: 'Sorry, but your position is not available at the moment',
      });
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(success, error, {
      maximumAge: 30 * 60 * 1000,
      timeout: 2 * 1000,
    });
  }, []);

  if (isLoading) {
    return <InlineLoader />;
  }

  let errorMessageComponent = null;
  if (errorMessage) {
    errorMessageComponent = (
      <h4 className="error-message">Error: {errorMessage}</h4>
    );
  }
  return (
    <div className="city-selection">
      <form className="city-search" onSubmit={onSearchClick}>
        <input
          className="city-search-field"
          type="text"
          placeholder="City"
          ref={(input) => {
            inputRef.current = input;
          }}
          maxLength="20"
        />
        <button type="submit" className="city-search-button">
          <i className="material-icons">&#xE8B6;</i>
        </button>
      </form>
      <p className="or-caption">or</p>
      <p>
        use my{' '}
        <span className="use-current-position" onClick={getCurrentLocation}>
          current position
        </span>
      </p>
      {errorMessageComponent}
    </div>
  );
}

export default CitySelectionView;
