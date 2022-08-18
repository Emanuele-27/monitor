import React from "react";

// Triggera 2 volte il render (e componentDidMount ?)
// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import { BrowserRouter } from "react-router-dom";

// CSS Per componenti primereact
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./index.css";
import { propsDominio } from "config/config";

const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', '/css/' + propsDominio.css + '.css');
document.head.appendChild(link);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    // <StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    // </StrictMode>
);