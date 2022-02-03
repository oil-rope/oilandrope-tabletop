import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import App from '@Components/App';

const element = document.getElementById('oilAndRopeTabletopRoot');
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  element,
);
