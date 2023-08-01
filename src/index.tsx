import React from 'react';
import { createRoot } from 'react-dom/client';

import Application from './App';
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
);
