import { Router, Route, hashHistory } from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './libs/material-icons/material-icons.css'

import CitySelectionView from './views/CitySelectionView'
import CityForecastView from './views/CityForecastView'

ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={CitySelectionView} />
            <Route path="/:cityName" component={CityForecastView} />
        </Router>
    ),
    document.getElementById('root'),
    () => {
        const lastViewedCity = localStorage.getItem('lastViewedCity');
        if (lastViewedCity) {
            window.location.hash = '#/' + lastViewedCity;
        }
    }
);
