import React from "react";

// Triggera 2 volte il render (e componentDidMount ?)
// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from "react-router-dom";
import Footer from "./layout/footer";
import Header from "./layout/header";
import Content from "./layout/content";

import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";      
import "primeicons/primeicons.css";  

import "./index.css";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  // <StrictMode>
    <BrowserRouter>
      <Header />
      <Content/>
      <Footer />
    </BrowserRouter >
  // </StrictMode>,
);