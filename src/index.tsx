import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';

import ErrorFallback from '@Components/ErrorFallback';
import App from '@Components/App';

const container = document.getElementById('oilAndRopeTabletopRoot');
if (!container) throw new Error('Impossible to render');
const root = createRoot(container);

root.render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
