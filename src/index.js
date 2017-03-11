import { Router, Route, hashHistory } from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import CitySelectionView from './views/CitySelectionView'
import CityForecastView from './views/CityForecastView'

ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={CitySelectionView} />
            <Route path="/:cityName" component={CityForecastView} />
            <Route path="/:lat/:lon" component={CityForecastView} />
        </Router>
    ),
    document.getElementById('root'),
    () => {
        var lastViewedCity = localStorage.getItem('lastViewedCity');
        if (lastViewedCity) {
            window.location.hash = '#/' + lastViewedCity;
        }
    }
);
