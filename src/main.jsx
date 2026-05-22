import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext'; // ← import provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>      {/* ← wrap App */}
      <App />
    </AppProvider>
  </React.StrictMode>
);
