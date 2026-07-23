import '@/_app/i18n/config';
import { App } from '@/_app/index';
import '@/_app/index.css';
import * as Sentry from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!, {
  onUncaughtError: Sentry.reactErrorHandler(),
}).render(
  <StrictMode>
    <App />
  </StrictMode>
);
