import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Spinner from './views/spinner/Spinner';
import './utils/i18n';
import { CustomizerContextProvider } from './context/CustomizerContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

async function deferRender() {
  // Solo iniciar MSW en desarrollo y si realmente lo necesitamos
  if (import.meta.env.DEV && false) {
    // Desactivado temporalmente
    try {
      const { worker } = await import('./api/mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: true, // Reduce logs de MSW
      });
      console.log('MSW started successfully');
    } catch (error) {
      console.warn('MSW failed to start (non-critical):', error);
    }
  }
}

deferRender().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <CustomizerContextProvider>
        <Suspense fallback={<Spinner />}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Suspense>
      </CustomizerContextProvider>
    </AuthProvider>,
  );
});
