import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
          <ThemeContextProvider>
              <BrowserRouter>
                  <App />
              </BrowserRouter>
          </ThemeContextProvider>
  </React.StrictMode>
);
