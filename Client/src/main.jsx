import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import store from './features/store.js';
import { ToastContainer } from 'react-toastify';


import App from './App.jsx'
import React from 'react'
import { ThemeProvider } from './Context/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
     <ThemeProvider>
      <App />
     </ThemeProvider>
     </Provider>
     <ToastContainer/>
  </StrictMode>,
)
