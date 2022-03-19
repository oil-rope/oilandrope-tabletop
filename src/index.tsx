import React, { StrictMode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactDOM from 'react-dom';

import ErrorFallback from '@Components/ErrorFallback';
import App from '@Components/App';

const element = document.getElementById('oilAndRopeTabletopRoot');
ReactDOM.render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
  element,
);
