import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'material-design-icons/iconfont/material-icons.css';

import CitySelectionView from './views/CitySelectionView'
import CityForecastView from './views/CityForecastView'

const container = document.getElementById('root');
const root = createRoot(container);
root.render((
    <Router>
        <Routes>
            <Route index element={<CitySelectionView />} />
            <Route path="/:cityName" element={<CityForecastView />} />
        </Routes>
    </Router>
));

const lastViewedCity = localStorage.getItem('lastViewedCity');
if (lastViewedCity) {
    // window.location.assign('/' + lastViewedCity);
}
