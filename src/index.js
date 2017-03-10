import { Router, Route, hashHistory } from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import CitySelectionView from './views/CitySelectionView'
import CityForecastView from './views/CityForecastView'

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={CitySelectionView}/>
        <Route path="/forecast/:cityName" component={CityForecastView}/>
    </Router>
), document.getElementById('root'));
