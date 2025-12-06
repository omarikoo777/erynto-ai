import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root element in index.html
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found. Did you forget <div id='root'></div> in index.html?");
}
