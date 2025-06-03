import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// npm install axios react-router-dom
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// titik masuk aplikasi React.