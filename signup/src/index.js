import React from 'react';
import './index.css';
import App from './App.js';
import { BrowserRouter } from 'react-router-dom';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
  <App />
</BrowserRouter>,

);
