import React from 'react';

import 'material-design-icons/iconfont/material-icons.css';
import '../../../css/cityForecastHeader.css';

interface CityForecastHeaderProps {
  cityName: string;
  onBackClickHandler: () => void;
}

function CityForecastHeader({
  cityName,
  onBackClickHandler,
}: CityForecastHeaderProps) {
  return (
    <h2 className="forecast-header">
      <button
        type="button"
        className="forecast-header__button-back"
        onClick={onBackClickHandler}
      >
        <i className="material-icons">&#xE5C4;</i>
      </button>{' '}
      {cityName}
    </h2>
  );
}

export default CityForecastHeader;
