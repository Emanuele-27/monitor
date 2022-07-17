import React from "react";

// Triggera 2 volte il render (e componentDidMount ?)
// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

import { BrowserRouter } from "react-router-dom";

import { suffissiDomini, propsDominio } from 'util/config'

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./index.css";


const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Mapping dominio corrente - file css
const mapperDominioCSS = new Map([
  [suffissiDomini.suffissoAdm, 'adm'],
  [suffissiDomini.suffissoAe, 'agenzia-entrate'],
  [suffissiDomini.suffissoAer, 'ader'],
  [suffissiDomini.suffissoSogei, 'sogei'],
]);

let link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', '/css/' + mapperDominioCSS.get(propsDominio.suffissoDom) + '.css');
document.head.appendChild(link);

root.render(
  // <StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </StrictMode>
);