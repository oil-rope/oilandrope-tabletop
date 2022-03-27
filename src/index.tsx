import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@Components/ErrorFallback';
import App from '@Components/App';

const rootElement = document.getElementById('oilAndRopeTabletopRoot');
ReactDOM.render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
  rootElement,
);
