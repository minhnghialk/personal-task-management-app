import React from 'react';
import './styles/tailwind.css';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ReactQueryProvider } from './components/ReactQueryProvider';
import { ToastContainer } from 'react-toastify';

const App = () => (
  <ErrorBoundary>
    <ReactQueryProvider>
      <AppRoutes />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ReactQueryProvider>
  </ErrorBoundary>
);

export default App;
